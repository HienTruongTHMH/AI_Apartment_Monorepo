// ============================================================
// Agent 1 — Listing Verifier (Web)
// Nhiệm vụ: Kiểm duyệt & Chuẩn hóa dữ liệu tin đăng
// Giai đoạn: Onboarding tài sản — Đầu vào
// ============================================================
// File gốc: src/services/listingVerifier.ts (Gemini 2.5-Flash API)
// File này là lớp adapter — re-export types và bổ sung mock helpers
// để web UI có thể dùng nhất quán với mobile agents.
// ============================================================
// TODO (team): Khi có backend Python + LangGraph:
//   Thay endpoint Gemini trực tiếp bằng:
//   POST /api/agents/listing-verifier/verify
//   (backend gọi Gemini hoặc GPT-4o Vision internally)
// ============================================================

// Re-export từ file gốc để không phá vỡ các import hiện tại
export {
  verifyListing,
  buildRawText,
  checkAgentHealth,
  type VerifyListingData,
  type VerifyResult,
} from "../listingVerifier";

// ─── Supplementary types ────────────────────────────────────
export type VerifyVerdict  = "approved" | "draft" | "rejected";
export type ImageStatus    = "ok" | "warn" | "fail";

export interface ImageReport {
  index:    number;
  filename: string;
  status:   ImageStatus;
  tags:     string[];         // ["phòng khách", "góc rộng"]
  reason?:  string;           // lý do warn/fail
}

export interface ListingQualityReport {
  seoScore:      number;       // 0–100
  titleScore:    number;
  descScore:     number;
  imageReport:   ImageReport[];
  missingFields: string[];
  suggestions:   string[];
  verdict:       VerifyVerdict;
  aiVerified:    boolean;
}

// ─── SEO score helper (mock — logic thực chạy ở backend NLP) ─
// TODO (team): Xoá hàm này khi backend trả về seoScore trong response
export function calcSeoScore(title: string, description: string): number {
  let score = 0;
  if (title.length >= 30 && title.length <= 80) score += 20;
  if (/\d+m²/.test(title))  score += 15;                      // diện tích
  if (/quận|huyện|tp\./i.test(title))  score += 15;           // địa danh
  if (description.split(/\s+/).length >= 100) score += 20;     // độ dài
  if (/wifi|internet/i.test(description)) score += 5;
  if (/nội thất|bếp|wc|toilet/i.test(description)) score += 10;
  if (/giá|triệu|tháng/i.test(description)) score += 5;
  if (/thú cưng|pet/i.test(description)) score += 5;
  if (/sdt|điện thoại|liên hệ/i.test(description)) score += 5;
  return Math.min(score, 100);
}

// ─── Auto-tag helper (mock — Vision AI thực chạy ở backend) ──
// TODO (team): Xoá hàm này khi backend trả về tags trong imageReport
export function mockAutoTag(filename: string): string[] {
  const f = filename.toLowerCase();
  if (f.includes("living") || f.includes("phong"))  return ["phòng khách", "không gian chung"];
  if (f.includes("bed") || f.includes("ngu"))        return ["phòng ngủ"];
  if (f.includes("kitchen") || f.includes("bep"))    return ["bếp", "nhà bếp"];
  if (f.includes("bath") || f.includes("wc"))        return ["phòng tắm", "WC"];
  if (f.includes("balcony") || f.includes("ban"))    return ["ban công", "view"];
  return ["không gian"];
}
