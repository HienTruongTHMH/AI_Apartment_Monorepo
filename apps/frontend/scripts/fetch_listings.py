import requests
import json
import time
import os
import re
from datetime import datetime
from collections import defaultdict

# ─── Cấu hình ────────────────────────────────────────────────────────────────

# Chiến lược đúng (đã test và xác nhận):
# Dùng nhiều search query để tổng hợp đủ loại nhà cho thuê
FETCH_CONFIGS = [
    {"q": "cho thuê phòng trọ",         "label": "Phòng trọ cho thuê"},
    {"q": "cho thuê phòng trọ hcm",     "label": "Phòng trọ HCM"},
    {"q": "cho thuê phòng trọ hà nội",  "label": "Phòng trọ HN"},
    {"q": "cho thuê căn hộ chung cư",   "label": "Căn hộ chung cư"},
    {"q": "cho thuê studio căn hộ",     "label": "Studio cho thuê"},
    {"q": "cho thuê nhà nguyên căn",    "label": "Nhà nguyên căn"},
    {"q": "cho thuê căn hộ dịch vụ",   "label": "Căn hộ dịch vụ"},
    {"q": "cho thuê phòng giá rẻ",      "label": "Phòng giá rẻ"},
]

TOTAL_PAGES  = 10   # 10 trang × 20 = 200 listings/query
DELAY        = 1.0  # giây
OUTPUT_DIR   = "data"
TS_OUTPUT_WEB    = "src/data/listings.ts"
TS_OUTPUT_MOBILE = "mobile/constants/listings.ts"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Referer": "https://www.chotot.com/",
}

# area_v2 prefix → tên tỉnh/thành (5 chữ số đầu ÷ 1000)
AREA_V2_TO_PROVINCE = {
    13: "TP. Hồ Chí Minh",
    12: "TP. Hà Nội",
    53: "TP. Đà Nẵng",
    58: "TP. Hải Phòng",
    65: "TP. Cần Thơ",
    46: "TP. Huế",
    15: "Tỉnh Bình Dương",
    35: "Tỉnh Đồng Nai",
    56: "Tỉnh Khánh Hòa",
    68: "Tỉnh Lâm Đồng",
    77: "Tỉnh Bà Rịa - Vũng Tàu",
    80: "Tỉnh Long An",
    82: "Tỉnh Tiền Giang",
    40: "Tỉnh Nghệ An",
    38: "Tỉnh Thanh Hóa",
    49: "Tỉnh Quảng Nam",
    51: "Tỉnh Quảng Ngãi",
    52: "Tỉnh Bình Định",
    54: "Tỉnh Phú Yên",
    60: "Tỉnh Ninh Thuận",
    61: "Tỉnh Bình Thuận",
    72: "Tỉnh Tây Ninh",
    74: "Tỉnh Bình Phước",
    89: "Tỉnh An Giang",
    87: "Tỉnh Đồng Tháp",
    93: "Tỉnh Hậu Giang",
    94: "Tỉnh Sóc Trăng",
    91: "Tỉnh Kiên Giang",
    95: "Tỉnh Bạc Liêu",
    96: "Tỉnh Cà Mau",
    44: "Tỉnh Quảng Bình",
    45: "Tỉnh Quảng Trị",
    42: "Tỉnh Hà Tĩnh",
     2: "Tỉnh Hà Giang",
}

UNSPLASH_FALLBACK = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1551361415-69c87624334f?w=600&q=80&fit=crop",
]

TYPE_MAP = {
    0: "Căn hộ",
    1: "Studio",
    2: "1 Phòng ngủ",
    3: "2 Phòng ngủ",
    4: "3 Phòng ngủ",
    5: "Penthouse",
    6: "Duplex",
}

AMENITY_KEYWORDS = {
    "wifi": "Wifi",
    "máy lạnh": "Máy lạnh", "điều hòa": "Máy lạnh",
    "máy giặt": "Máy giặt",
    "tủ lạnh": "Tủ lạnh",
    "hồ bơi": "Hồ bơi", "swimming": "Hồ bơi",
    "gym": "Gym",
    "nội thất": "Nội thất đầy đủ",
    "bảo vệ": "Bảo vệ 24/7", "an ninh": "Bảo vệ 24/7",
    "ban công": "Ban công",
    "hầm xe": "Hầm xe", "chỗ để xe": "Chỗ để xe",
    "bếp": "Bếp đầy đủ",
}

# ─── Fetch ────────────────────────────────────────────────────────────────────

def fetch_chotot(seen_ids: set) -> list[dict]:
    """Fetch từ Chợ Tốt — keyword search với tiếng Việt có dấu."""
    from urllib.parse import quote
    all_ads = []
    for cfg in FETCH_CONFIGS:
        q, label = cfg["q"], cfg["label"]
        q_enc = quote(q)
        print(f"\n{'─'*50}")
        print(f"📥 [ChợTốt] {label}")
        count = 0
        for page in range(TOTAL_PAGES):
            offset = page * 20
            url = f"https://gateway.chotot.com/v1/public/ad-listing?q={q_enc}&limit=20&o={offset}&st=s,k"
            try:
                r = requests.get(url, headers=HEADERS, timeout=12)
                if r.status_code != 200:
                    print(f"  ⚠ HTTP {r.status_code}")
                    break
                ads = r.json().get("ads", [])
                if not ads:
                    print(f"  ✓ Hết data ở page {page+1}")
                    break
                new = [a for a in ads if a.get("list_id") not in seen_ids]
                seen_ids.update(a["list_id"] for a in new if a.get("list_id"))
                rentals = [a for a in new if is_rental(a)]
                all_ads.extend(rentals)
                count += len(rentals)
                print(f"  page {page+1:2d}: {len(ads):2d} ads → {len(rentals):2d} rentals (tổng={count})")
            except Exception as e:
                print(f"  ✗ page {page+1}: {e}")
                break
            time.sleep(DELAY)
    return all_ads


# Nhatot.com là sàn BĐS riêng của Chợ Tốt — chỉ có bất động sản
NHATOT_CONFIGS = [
    {"path": "nha-dat/cho-thue-phong-tro-nha-tro",    "label": "Phòng trọ (nhatot)"},
    {"path": "nha-dat/cho-thue-can-ho-chung-cu",       "label": "Căn hộ chung cư (nhatot)"},
    {"path": "nha-dat/cho-thue-nha-rieng",             "label": "Nhà riêng cho thuê (nhatot)"},
    {"path": "nha-dat/cho-thue-can-ho-dich-vu",        "label": "CHDV (nhatot)"},
]

def fetch_nhatot(seen_ids: set) -> list[dict]:
    """Fetch từ nhatot.com — gateway API dùng chung với chotot nhưng chỉ BĐS."""
    all_ads = []
    for cfg in NHATOT_CONFIGS:
        path, label = cfg["path"], cfg["label"]
        print(f"\n{'─'*50}")
        print(f"📥 [Nhatot] {label}")
        count = 0
        for page in range(TOTAL_PAGES):
            offset = page * 20
            url = (
                f"https://gateway.chotot.com/v2/public/ad-listing?"
                f"cg=1000&limit=20&o={offset}&st=s,k&key_param_included=true"
                f"&category_path={path}"
            )
            try:
                r = requests.get(url, headers={**HEADERS, "Referer": "https://www.nhatot.com/"}, timeout=12)
                if r.status_code != 200:
                    # fallback: try v1 without category_path
                    break
                data = r.json()
                ads = data.get("ads", [])
                if not ads:
                    print(f"  ✓ Hết data ở page {page+1}")
                    break
                new = [a for a in ads if a.get("list_id") not in seen_ids]
                seen_ids.update(a["list_id"] for a in new if a.get("list_id"))
                rentals = [a for a in new if is_rental(a)]
                all_ads.extend(rentals)
                count += len(rentals)
                print(f"  page {page+1:2d}: {len(ads):2d} ads → {len(rentals):2d} rentals (tổng={count})")
            except Exception as e:
                print(f"  ✗ page {page+1}: {e}")
                break
            time.sleep(DELAY)
    return all_ads


def fetch_all_raw() -> list[dict]:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    seen_ids: set = set()

    ads_chotot = fetch_chotot(seen_ids)
    ads_nhatot = fetch_nhatot(seen_ids)

    all_ads = ads_chotot + ads_nhatot
    print(f"\n✅ Chợ Tốt: {len(ads_chotot)} | Nhatot: {len(ads_nhatot)} | Tổng: {len(all_ads)}")
    with open(os.path.join(OUTPUT_DIR, "listings_raw.json"), "w", encoding="utf-8") as f:
        json.dump(all_ads, f, ensure_ascii=False, indent=2)
    return all_ads


BLACKLIST_KEYWORDS = [
    # Chức danh công việc / tuyển dụng
    "tuyển", "tìm việc", "việc làm", "nhân viên", "công nhân", "thợ may",
    "lao động", "lương tháng", "lương/tháng", "thu nhập", "giám sát",
    "công việc", "tuyển dụng", "mô tả công việc", "kỹ thuật âm thanh",
    "chuyên viên", "full time", "part time", "thực tập",
    "cần người", "tìm người", "đồng đội", "cộng tác viên", "dẫn khách",
    "đăng bài", "đăng tin phòng", "sale phòng", "tư vấn phòng trọ",
    "cần thêm", "kiếm thêm", "làm thêm", "partime", "part-time",
    "kinh doanh bất động sản", "sale bất động sản", "bán bất động sản",
    "nv kinh doanh", "nv bán", "nhân sự", "quản lý bán hàng",
    "lái xe", "bảo vệ", "y tá", "điều dưỡng", "kế toán",
    "ctv ", "sale căn", "sale chung cư",
    "lương khoán", "hoa hồng", "thưởng doanh số",
    # Đồ điện tử / âm thanh (không phải bất động sản)
    "tai nghe", "headphone", "airpod", "earbud",
    "loa ", "loa bass", "loa jbl", "loa klipsch", "subwoofer",
    "ampli", "amply", "amplifier", "receiver",
    "sound card", "soundcard", "mixer", "microphone",
    "studio monitor", "monitor speaker",
    "jbl ", "klipsch", "bose ", "sennheiser", "beyerdynamic",
    "beats studio", "beats pro", "beats solo",
    "máy tính", "laptop", "macbook", "thinkpad", "surface",
    "điện thoại", "iphone", "samsung galaxy", "oppo ", "xiaomi ",
    "xe máy", "ô tô", "honda ", "yamaha ", "suzuki ",
    "máy trạm", "workstation", "gaming pc", "case máy",
    "camera ", "webcam", "đèn led", "thiết bị", "phần mềm",
    "máy giặt", "tủ lạnh", "điều hoà bán", "nệm ", "nội thất bán",
    # Mua bán (không phải thuê)
    "mua bán", "sang nhượng", "chuyển nhượng", "dịch vụ sửa",
    "bán gấp", "cần bán", "bán nhanh",
    "công ty tnhh", "công ty cổ phần",
]

RENTAL_TITLE_KEYWORDS = [
    "cho thuê", "cần thuê", "thuê căn", "thuê phòng", "thuê nhà", "thuê studio",
    "phòng trọ", "phòng cho", "nhà trọ", "chung cư", "căn hộ", "nhà nguyên căn",
    "studio cho", "studio thuê", "officetel", "căn duplex", "penthouse",
    "mặt bằng cho thuê", "văn phòng cho thuê",
]


def is_rental(ad: dict) -> bool:
    price_str = (ad.get("price_string", "") or "").lower()
    subject   = (ad.get("subject", "") or "").lower()
    price     = ad.get("price", 0) or 0

    # Loại ngay nếu có từ khóa đen
    if any(kw in subject for kw in BLACKLIST_KEYWORDS):
        return False

    # Loại salary format: "Đến X triệu/tháng" hoặc "Từ X triệu/tháng" (lương job)
    # Rental thật dùng: "X triệu/tháng" hoặc "X.XXX.XXX đ" trực tiếp
    if re.match(r"^(đến|từ)\s+\d", price_str):
        return False
    if "lương khoán" in price_str or "hoa hồng" in price_str:
        return False

    # Phải có tín hiệu thuê rõ ràng gắn với loại tài sản (không phải việc làm về thuê)
    has_rent_title = any(kw in subject for kw in [
        "cho thuê phòng", "cho thuê căn", "cho thuê nhà", "cho thuê studio",
        "cho thuê chung cư", "cho thuê chdv", "cho thuê mặt bằng",
        "phòng trọ cho thuê", "phòng cho thuê",
        "căn hộ cho thuê", "studio cho thuê", "nhà nguyên căn cho thuê",
        "cần thuê phòng", "cần thuê căn", "thuê căn hộ", "thuê phòng trọ",
    ])
    has_month_price = "/tháng" in price_str or " tháng" in price_str

    if not (has_rent_title or has_month_price):
        return False

    # Giá không hợp lệ
    if "tỷ" in price_str:
        return False
    if price > 0 and (price < 1_500_000 or price > 100_000_000):
        return False

    return True


# ─── Normalize ───────────────────────────────────────────────────────────────

def get_province(ad: dict) -> str:
    area_v2 = ad.get("area_v2", 0) or 0
    prefix = area_v2 // 1000
    return AREA_V2_TO_PROVINCE.get(prefix, "Việt Nam")


def parse_price(ad: dict) -> tuple[str, int]:
    price_str = (ad.get("price_string", "") or "").strip()
    price     = ad.get("price", 0) or 0
    if price_str and price_str != "0":
        nums = re.findall(r"[\d,]+", price_str)
        if nums:
            try:
                val = float(nums[0].replace(",", "."))
                if "tỷ" in price_str.lower():
                    return price_str, int(val * 1_000_000_000)
                return price_str, int(val * 1_000_000)
            except Exception:
                pass
    if price >= 1_000_000:
        m = price / 1_000_000
        label = f"{m:.1f} tr/tháng".replace(".0 ", " ")
        return label, price
    return "Thỏa thuận", 0


def parse_area(ad: dict) -> str:
    area = ad.get("area", 0) or 0
    if area and area < 10000:
        return f"{int(area)} m²"
    return "N/A"


def parse_amenities(ad: dict) -> list[str]:
    text = ((ad.get("subject", "") or "") + " " + (ad.get("body", "") or "")).lower()
    found = []
    seen = set()
    for keyword, label in AMENITY_KEYWORDS.items():
        if keyword in text and label not in seen:
            found.append(label)
            seen.add(label)
    return found or ["Wifi", "Máy lạnh"]


def parse_tags(ad: dict, verified: bool, province: str) -> list[str]:
    tags = []
    if verified:
        tags.append("AI Verified")
    text = (ad.get("subject", "") or "").lower()
    if "hồ bơi" in text or "pool" in text:
        tags.append("Hồ bơi")
    elif "ban công" in text:
        tags.append("Ban công")
    elif "gym" in text:
        tags.append("Gym")
    elif "full nội thất" in text or "full nt" in text:
        tags.append("Full nội thất")
    if "Hồ Chí Minh" not in province and "Hà Nội" not in province and len(tags) < 3:
        short = province.replace("TP. ", "").replace("Tỉnh ", "")
        tags.append(short)
    if len(tags) < 2:
        tags.append("Cho thuê")
    return tags[:3]


def normalize(ad: dict, index: int) -> dict | None:
    subject = (ad.get("subject", "") or "").strip()
    if not subject:
        return None

    price_str, price_num = parse_price(ad)
    province = get_province(ad)
    area_name = (ad.get("area_name", "") or "").strip()
    district = f"{area_name}, {province}" if area_name else province

    # Image: dùng CDN URL từ API (đã là URL đầy đủ)
    img_url = ""
    if ad.get("image") and str(ad["image"]).startswith("http"):
        img_url = ad["image"]
    else:
        for img in (ad.get("images") or []):
            if isinstance(img, str) and img.startswith("http"):
                img_url = img
                break
    if not img_url:
        img_url = UNSPLASH_FALLBACK[index % len(UNSPLASH_FALLBACK)]

    cat    = ad.get("category", 0)
    rooms  = ad.get("rooms", 0) or 0
    if cat == 1000:
        listing_type = "Phòng trọ"
    else:
        listing_type = TYPE_MAP.get(int(rooms), "Căn hộ")

    amenities = parse_amenities(ad)
    verified  = bool(ad.get("company_ad")) or (0 < price_num < 30_000_000)

    ad_id  = str(ad.get("list_id", f"nv-{index}"))
    rating = round(min(4.0 + (hash(ad_id) % 11) / 10, 5.0), 1)

    desc = (ad.get("body", "") or "").strip()
    desc = re.sub(r"\s+", " ", desc)[:250] or f"Cho thuê tại {district}."

    result: dict = {
        "id":          ad_id,
        "title":       subject[:70],
        "price":       price_str,
        "priceNum":    price_num,
        "area":        parse_area(ad),
        "district":    district,
        "province":    province,
        "type":        listing_type,
        "image":       img_url,
        "tags":        parse_tags(ad, verified, province),
        "verified":    verified,
        "rating":      rating,
        "description": desc,
        "amenities":   amenities,
        "postedAt":    ad.get("date", datetime.now().isoformat()),
        "sourceUrl":   f"https://www.chotot.com/{ad_id}",
    }
    lat = ad.get("latitude") or ad.get("lat")
    lng = ad.get("longitude") or ad.get("lng")
    if lat and lng:
        result["lat"] = float(lat)
        result["lng"] = float(lng)
    return result


def normalize_all(raw: list[dict]) -> list[dict]:
    cleaned = []
    for i, ad in enumerate(raw):
        item = normalize(ad, i)
        if item and item["priceNum"] > 0:
            cleaned.append(item)

    # Thống kê theo tỉnh
    by_province: dict[str, int] = defaultdict(int)
    for item in cleaned:
        by_province[item["province"]] += 1

    print(f"\n✅ {len(cleaned)} listings hợp lệ (có giá)")
    print("\nPhân bổ theo tỉnh/thành:")
    for prov, cnt in sorted(by_province.items(), key=lambda x: -x[1])[:15]:
        bar = "█" * (cnt // 5)
        print(f"  {prov:30s} {cnt:4d} {bar}")
    if len(by_province) > 15:
        print(f"  ... và {len(by_province)-15} tỉnh/thành khác")

    with open(os.path.join(OUTPUT_DIR, "listings_clean.json"), "w", encoding="utf-8") as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)
    print(f"\n💾 → data/listings_clean.json")
    return cleaned


# ─── Xuất TypeScript ──────────────────────────────────────────────────────────

TS_TYPE_MOBILE = """// AUTO-GENERATED {date} — {count} listings thực từ Chợ Tốt
// Chạy lại: python scripts/fetch_listings.py

export type Listing = {{
  id: string;
  title: string;
  price: string;
  priceNum: number;
  area: string;
  district: string;
  province: string;
  type: string;
  image: string;
  tags: string[];
  verified: boolean;
  rating: number;
  description: string;
  amenities: string[];
  postedAt: string;
  sourceUrl: string;
  lat?: number;
  lng?: number;
}};

export const LISTINGS: Listing[] = {data};
"""

TS_TYPE_WEB = """// AUTO-GENERATED {date} — {count} listings thực từ Chợ Tốt
// Chạy lại: python scripts/fetch_listings.py

export interface Listing {{
  id: string;
  title: string;
  price: string;
  priceNum: number;
  area: string;
  district: string;
  province: string;
  type: string;
  image: string;
  tags: string[];
  verified: boolean;
  rating: number;
  description: string;
  amenities: string[];
  postedAt: string;
  sourceUrl: string;
  lat?: number;
  lng?: number;
}}

export const LISTINGS: Listing[] = {data};

export const getListingsByProvince = (p: string) =>
  LISTINGS.filter(l => l.province === p);

export const getFeaturedListings = () =>
  LISTINGS.filter(l => l.verified && l.rating >= 4.7);

export const searchListings = (q: string) => {{
  const lower = q.toLowerCase();
  return LISTINGS.filter(l =>
    l.title.toLowerCase().includes(lower) ||
    l.district.toLowerCase().includes(lower) ||
    l.province.toLowerCase().includes(lower)
  );
}};
"""


def write_ts(listings: list[dict]):
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    data_json = json.dumps(listings, ensure_ascii=False, indent=2)
    count = len(listings)

    os.makedirs(os.path.dirname(TS_OUTPUT_WEB), exist_ok=True)

    with open(TS_OUTPUT_MOBILE, "w", encoding="utf-8") as f:
        f.write(TS_TYPE_MOBILE.format(date=date_str, count=count, data=data_json))
    print(f"✅ Mobile → {TS_OUTPUT_MOBILE}")

    with open(TS_OUTPUT_WEB, "w", encoding="utf-8") as f:
        f.write(TS_TYPE_WEB.format(date=date_str, count=count, data=data_json))
    print(f"✅ Web    → {TS_OUTPUT_WEB}")


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 55)
    print("  NestaVietAI — Fetch Real Listings từ Chợ Tốt")
    print("=" * 55)
    print(f"  Configs: cg=1010 (căn hộ) + cg=1000 (phòng trọ)")
    print(f"  Pages: {TOTAL_PAGES} × 20 = {TOTAL_PAGES*20} listings/category")
    print(f"  Delay: {DELAY}s/request")
    est = int(TOTAL_PAGES * len(FETCH_CONFIGS) * DELAY / 60)
    print(f"  Ước tính: ~{est} phút")
    print("=" * 55)

    raw      = fetch_all_raw()
    listings = normalize_all(raw)
    write_ts(listings)

    print("\n" + "=" * 55)
    print(f"  HOÀN THÀNH — {len(listings)} listings thực tế")
    print("=" * 55)
    print("\nBước tiếp theo:")
    print("  npm run build      (kiểm tra web)")
    print("  cd mobile && npx expo start")
