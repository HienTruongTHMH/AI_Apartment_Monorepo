"""
Agent 2 — Super Broker: Core RAG Pipeline

Luồng xử lý 3 stage:
  Stage 1 — Intent Analysis  : Gemini phân tích query + audio → QueryIntentConstraints
  Stage 2 — Qdrant Search    : embed semantic_query (1 lần duy nhất) → search với hard filters
                               Nếu 0 kết quả → Relax Constraints → retry
  Stage 3 — RAG Synthesis    : Gemini tổng hợp SearchResponseOutput từ ≤3 listings + context

Tối ưu:
  - Greeting/small-talk → early return, không gọi DB hoặc vector search.
  - Chỉ generate 1 embedding cho user query, không embed từng listing.
  - Tìm kiếm trực tiếp trên Qdrant (pre-indexed embeddings).
  - Tối đa 3 listings được đưa vào Stage 3.
  - History giới hạn 3 turns gần nhất trong Stage 3 prompt.
"""

import logging
import time
from datetime import datetime
from typing import Optional

import httpx
import instructor
from openai import OpenAI

from app.core.config import settings
from app.core.redis_client import emit_event
from app.prompts.prompt_broker import INTENT_EXTRACTION_PROMPT, SYSTEM_INSTRUCTION
from app.schemas.schema_broker import (
    QueryIntentConstraints,
    SearchQueryInput,
    SearchResponseOutput,
)
from app.services.qdrant_service import get_embedding, search_apartments, get_apartment_by_id

logger = logging.getLogger(__name__)

MODEL_NAME = "gemini-3.1-flash-lite"
_AUDIO_DOWNLOAD_TIMEOUT = 10.0  # giây
_MAX_HISTORY_TURNS = 3          # Giữ tối đa 3 turns trong Stage 3 prompt


# ─────────────────────────────────────────────────────────────────────────────
# OpenAI-compat client (dùng cho instructor structured output)
# ─────────────────────────────────────────────────────────────────────────────

def _build_instructor_client() -> instructor.Instructor:
    openai_client = OpenAI(
        api_key=settings.gemini_api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    )
    return instructor.from_openai(client=openai_client, mode=instructor.Mode.JSON)


# ─────────────────────────────────────────────────────────────────────────────
# Audio Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _fetch_audio_bytes(audio_url: str) -> Optional[bytes]:
    """Tải audio từ URL. Trả về None nếu thất bại."""
    if not audio_url or not audio_url.startswith("http"):
        return None
    try:
        with httpx.Client(timeout=_AUDIO_DOWNLOAD_TIMEOUT) as client:
            resp = client.get(audio_url)
            resp.raise_for_status()
            logger.info(f"Downloaded audio {len(resp.content)} bytes from {audio_url}")
            return resp.content
    except Exception as e:
        logger.warning(f"Failed to download audio from {audio_url}: {e}")
        return None


def _detect_audio_mime(url: str) -> str:
    """Phát hiện MIME type từ đuôi file URL."""
    url_lower = url.lower()
    if ".ogg" in url_lower:
        return "audio/ogg"
    if ".wav" in url_lower:
        return "audio/wav"
    return "audio/mpeg"  # mặc định mp3


# ─────────────────────────────────────────────────────────────────────────────
# History Formatter
# ─────────────────────────────────────────────────────────────────────────────

def _format_history(payload: SearchQueryInput, max_turns: int = _MAX_HISTORY_TURNS) -> str:
    """Định dạng lịch sử hội thoại thành chuỗi text ngắn gọn."""
    history = payload.conversation_history[-max_turns:]
    if not history:
        return ""
    lines = []
    for msg in history:
        role_label = "Khách" if msg.role == "user" else "Agent"
        lines.append(f"{role_label}: {msg.content}")
    return "\n".join(lines)


# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Intent Extraction
# ─────────────────────────────────────────────────────────────────────────────

def _stage1_extract_intent(
    payload: SearchQueryInput,
    client: instructor.Instructor,
) -> QueryIntentConstraints:
    """
    Gọi Gemini để phân tích query + lịch sử → QueryIntentConstraints.
    Nếu có audio_url, tải audio và gửi kèm như multimodal input.
    """
    history_text = _format_history(payload, max_turns=5)  # Stage 1 dùng 5 turns để hiểu ngữ cảnh
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M")

    user_content_text = (
        f"Thời gian hiện tại: {current_time}\n\n"
        + (f"Lịch sử hội thoại:\n{history_text}\n\n" if history_text else "")
        + f"Tin nhắn mới nhất của khách: {payload.query}"
    )

    # Multimodal: thêm audio nếu có
    user_content: str | list
    audio_bytes = None
    if payload.audio_url:
        audio_bytes = _fetch_audio_bytes(payload.audio_url)

    if audio_bytes:
        import base64
        mime = _detect_audio_mime(payload.audio_url)
        b64_audio = base64.b64encode(audio_bytes).decode("utf-8")
        user_content = [
            {"type": "text", "text": user_content_text},
            {
                "type": "imageUrl",  # Gemini multimodal via OpenAI compat uses imageUrl for all media
                "imageUrl": {"url": f"data:{mime};base64,{b64_audio}"},
            },
        ]
        logger.info(f"[Stage1] Sending audio ({mime}, {len(audio_bytes)} bytes) to Gemini.")
    else:
        user_content = user_content_text

    constraints = client.chat.completions.create(
        model=MODEL_NAME,
        response_model=QueryIntentConstraints,
        messages=[
            {"role": "system", "content": INTENT_EXTRACTION_PROMPT},
            {"role": "user", "content": user_content},
        ],
        max_retries=2,
    )
    logger.info(
        f"[Stage1] Intent extracted — "
        f"is_greeting={constraints.is_greeting}, "
        f"semantic_query='{constraints.semantic_query[:60]}', "
        f"min_price={constraints.min_price}, "
        f"max_price={constraints.max_price}, "
        f"min_area={constraints.min_area}, "
        f"is_booking={constraints.is_booking_request}, "
        f"needs_clarification={constraints.needs_clarification}"
    )
    return constraints


# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Qdrant Vector Search (with Constraint Relaxation fallback)
# Chỉ generate 1 embedding cho query — không embed từng listing.
# ─────────────────────────────────────────────────────────────────────────────

def _filter_local_listings(
    listings: list[dict],
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_area: Optional[float] = None,
    preferred_district: Optional[str] = None,
    top_k: int = 3,
) -> list[dict]:
    """Lọc danh sách căn hộ từ PostgreSQL fallback nếu Qdrant chưa có index."""
    filtered = []
    for lst in listings:
        price = float(lst.get("pricePerMonth") or lst.get("price") or 0)
        area = float(lst.get("area") or 0)
        district = str(lst.get("district") or "").lower()

        if min_price is not None and price < min_price:
            continue
        if max_price is not None and price > max_price:
            continue
        if min_area is not None and area < min_area:
            continue
        if preferred_district and preferred_district.lower() not in district:
            continue

        filtered.append(lst)

    return filtered[:top_k]


def _stage2_search(
    constraints: QueryIntentConstraints,
    listings_source: Optional[list[dict]] = None,
) -> list[dict]:
    """
    Tìm kiếm căn hộ phù hợp trực tiếp trên Qdrant với pre-indexed embeddings.
    Nếu Qdrant trả về 0 kết quả (vd: đang re-index), tự động fallback lọc trên listings_source từ PostgreSQL.
    """
    # 1. Thử tìm kiếm trên Qdrant với đầy đủ constraints
    try:
        vector = get_embedding(constraints.semantic_query)
        results = search_apartments(
            vector=vector,
            min_price=constraints.min_price,
            max_price=constraints.max_price,
            min_area=constraints.min_area,
            top_k=3,
        )

        if results:
            logger.info(f"[Stage2] Qdrant found {len(results)} listings with full constraints.")
            return results
    except Exception as e:
        logger.error(f"[Stage2] Qdrant search error: {e}")
        results = []

    # 2. Qdrant 0 kết quả → thử nới lỏng constraints trên Qdrant (-15% min_price, +15% max_price, -20% min_area)
    logger.info("[Stage2] Zero Qdrant strict results — relaxing price/area filters.")
    relaxed_min_price = (constraints.min_price * 0.85) if constraints.min_price else None
    relaxed_max_price = (constraints.max_price * 1.15) if constraints.max_price else None
    relaxed_area = (constraints.min_area * 0.8) if constraints.min_area else None

    try:
        results = search_apartments(
            vector=vector,
            min_price=relaxed_min_price,
            max_price=relaxed_max_price,
            min_area=relaxed_area,
            top_k=3,
        )
        if results:
            logger.info(f"[Stage2] Relaxed Qdrant search found {len(results)} listings.")
            return results
    except Exception:
        pass

    # 3. Fallback: Nếu Qdrant chưa có dữ liệu và NestJS gửi listings_source từ Postgres → lọc trực tiếp
    if listings_source:
        logger.info(f"[Stage2] Qdrant 0 hits — falling back to filtering {len(listings_source)} PostgreSQL listings.")
        local_results = _filter_local_listings(
            listings=listings_source,
            min_price=constraints.min_price,
            max_price=constraints.max_price,
            min_area=constraints.min_area,
            preferred_district=constraints.preferred_district,
            top_k=3,
        )
        if local_results:
            logger.info(f"[Stage2] Local PostgreSQL fallback found {len(local_results)} listings.")
            return local_results

        # Try relaxed on local listings
        local_relaxed = _filter_local_listings(
            listings=listings_source,
            min_price=relaxed_min_price,
            max_price=relaxed_max_price,
            min_area=relaxed_area,
            preferred_district=None,
            top_k=3,
        )
        if local_relaxed:
            logger.info(f"[Stage2] Local relaxed PostgreSQL fallback found {len(local_relaxed)} listings.")
            return local_relaxed

    return []


# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — RAG Synthesis
# ─────────────────────────────────────────────────────────────────────────────

def _stage3_rag_synthesis(
    payload: SearchQueryInput,
    constraints: QueryIntentConstraints,
    listings: list[dict],
    client: instructor.Instructor,
) -> SearchResponseOutput:
    """
    Gọi Gemini với SYSTEM_INSTRUCTION + context rút gọn → SearchResponseOutput.
    Lịch sử giới hạn 3 turns. Listing context chỉ gồm các trường thiết yếu.
    """
    history_text = _format_history(payload, max_turns=_MAX_HISTORY_TURNS)
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Build listing context — chỉ các trường thiết yếu, không gửi full description
    if listings:
        listing_items = []
        for i, lst in enumerate(listings, 1):
            amenities_str = ", ".join(lst.get("amenities", [])[:5])  # tối đa 5 tiện ích
            listing_items.append(
                f"[{i}] ID:{lst.get('listing_id', '')} | {lst.get('title', '')} | "
                f"{lst.get('area', 0)}m² | {lst.get('pricePerMonth', 0):,.0f}VND/tháng | "
                f"Tiện ích: {amenities_str or 'N/A'}"
            )
        listings_section = "\n\nCĂN HỘ GỢI Ý:\n" + "\n".join(listing_items)
    else:
        listings_section = "\n\nKHÔNG TÌM THẤY căn hộ khớp trong database."

    booking_context = ""
    if constraints.is_booking_request and constraints.booking_listing_id:
        booking_context = (
            f"\n\nĐẶT LỊCH: listing={constraints.booking_listing_id}, "
            f"ngày={constraints.booking_date}, giờ={constraints.booking_time}. "
            f"Giờ hợp lệ: 8h00–20h00."
        )

    user_prompt = (
        f"Thời gian: {current_time}\n"
        + (f"Lịch sử:\n{history_text}\n\n" if history_text else "")
        + f"Khách hỏi: {payload.query}"
        + listings_section
        + booking_context
    )

    response = client.chat.completions.create(
        model=MODEL_NAME,
        response_model=SearchResponseOutput,
        messages=[
            {"role": "system", "content": SYSTEM_INSTRUCTION},
            {"role": "user", "content": user_prompt},
        ],
        max_retries=2,
    )

    logger.info(
        f"[Stage3] RAG synthesis done — "
        f"next_action={response.next_action}, "
        f"recommendations={len(response.recommendations)}"
    )
    return response


# ─────────────────────────────────────────────────────────────────────────────
# Booking Event Emitter
# ─────────────────────────────────────────────────────────────────────────────

def _emit_booking_event(tenant_id: str, result: SearchResponseOutput) -> None:
    """Phát sự kiện `appointment.requested` lên Redis Stream nếu cần."""
    if result.next_action != "EMIT_BOOKING_EVENT":
        return

    booking = result.booking_details or {}
    event_payload = {
        "tenant_id": tenant_id,
        "listing_id": booking.get("listing_id", ""),
        "date": booking.get("date", ""),
        "time": booking.get("time", ""),
        "bot_response_snippet": result.bot_response[:200],
    }
    success = emit_event("appointment.requested", event_payload)
    if success:
        logger.info(
            f"[Booking] Emitted appointment.requested for tenant={tenant_id}, "
            f"listing={booking.get('listing_id')}"
        )
    else:
        logger.error(f"[Booking] Failed to emit appointment.requested for tenant={tenant_id}")


# ─────────────────────────────────────────────────────────────────────────────
# Public Entry Point
# ─────────────────────────────────────────────────────────────────────────────

def run_broker_agent(payload: SearchQueryInput) -> SearchResponseOutput:
    """
    Điểm vào chính của Agent 2. Điều phối toàn bộ 3-stage pipeline.

    Args:
        payload: SearchQueryInput từ NestJS.

    Returns:
        SearchResponseOutput với bot_response, recommendations, next_action.

    Raises:
        Exception: Bất kỳ lỗi nghiêm trọng nào từ Gemini/Qdrant.
    """
    t0 = time.time()
    client = _build_instructor_client()

    logger.info(
        f"[BrokerAgent] Bắt đầu xử lý — tenant_id={payload.tenant_id}, "
        f"query='{payload.query[:80]}', "
        f"history={len(payload.conversation_history)} turns, "
        f"has_audio={bool(payload.audio_url)}"
    )

    # ── Stage 1: Intent Analysis ──────────────────────────────────────────────
    constraints = _stage1_extract_intent(payload, client)

    # ── Stage 2: Qdrant Search ────────────────────────────────────────────────
    listings: list[dict] = []

    if constraints.is_greeting:
        logger.info("[BrokerAgent] is_greeting=True — skipping search, generating contextual response via Stage 3.")
        listings = []
    elif constraints.needs_clarification:
        logger.info("[BrokerAgent] needs_clarification=True — skipping search, asking clarification via Stage 3.")
        listings = []
    elif not constraints.is_booking_request:
        listings = _stage2_search(constraints, payload.listings)
    elif constraints.booking_listing_id:
        # Fetch the specific listing being booked from Qdrant
        lst = get_apartment_by_id(constraints.booking_listing_id)
        if lst:
            listings = [lst]

    # ── Stage 3: RAG Synthesis ────────────────────────────────────────────────
    result = _stage3_rag_synthesis(payload, constraints, listings, client)

    # ── Booking Event ─────────────────────────────────────────────────────────
    _emit_booking_event(payload.tenant_id, result)

    elapsed = time.time() - t0
    logger.info(
        f"[BrokerAgent] Hoàn tất trong {elapsed:.2f}s — "
        f"next_action={result.next_action}, "
        f"listings_found={len(listings)}, "
        f"recommendations={len(result.recommendations)}"
    )

    return result
