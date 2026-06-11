"""
NestaVietAI — Generate realistic Vietnamese rental listing data
Produces authentic listings based on real market data (apartment names, prices, districts)
"""
import json, random, hashlib
from datetime import datetime, timedelta

# ─── Dữ liệu thực tế thị trường ──────────────────────────────────────────────

HCM_LISTINGS = [
    # (title, district, price_monthly_vnd, area_m2, type, tags_extra)
    # Quận 1 - cao cấp
    ("Cho thuê căn hộ Vinhomes Golden River 2PN view sông",         "Quận 1, TP. Hồ Chí Minh",    18_000_000, 75, "2 Phòng ngủ",  ["Hồ bơi","Sky Bar"]),
    ("Cho thuê studio Landmark 81 full nội thất cao cấp",            "Quận Bình Thạnh, TP. Hồ Chí Minh", 12_000_000, 38, "Studio",  ["Gym","Hồ bơi"]),
    ("Cho thuê căn hộ The Metropole Thủ Thiêm 1PN ban công đẹp",    "TP. Thủ Đức, TP. Hồ Chí Minh", 15_000_000, 52, "1 Phòng ngủ", ["Hồ bơi","Concierge"]),
    ("Cho thuê căn hộ Masteri An Phú 2PN nội thất đầy đủ",          "TP. Thủ Đức, TP. Hồ Chí Minh", 14_000_000, 65, "2 Phòng ngủ", ["Gym","Hồ bơi","Bãi xe"]),
    ("Cho thuê penthouse Sunwah Pearl tầng cao view panorama",       "Quận Bình Thạnh, TP. Hồ Chí Minh", 45_000_000, 180, "Penthouse", ["Sky Pool","Gym","Concierge"]),
    # Quận 7 - tầm trung cao cấp
    ("Cho thuê căn hộ Phú Mỹ Hưng Midtown 2PN full NT",             "Quận 7, TP. Hồ Chí Minh",     16_000_000, 72, "2 Phòng ngủ", ["Hồ bơi","Gym","Bảo vệ 24/7"]),
    ("Cho thuê căn hộ Riviera Point quận 7 view hồ bơi",            "Quận 7, TP. Hồ Chí Minh",     13_000_000, 58, "1 Phòng ngủ", ["Hồ bơi","Gym","Bãi xe"]),
    ("Cho thuê căn hộ The Sun Avenue 1PN tầng 20 view đẹp",         "Quận 2 (cũ), TP. Hồ Chí Minh", 11_000_000, 48, "1 Phòng ngủ", ["Hồ bơi","Gym"]),
    ("Cho thuê căn hộ SC VivoCity 3PN sát Phú Mỹ Hưng",            "Quận 7, TP. Hồ Chí Minh",     20_000_000, 95, "3 Phòng ngủ", ["Hồ bơi","Gym","Siêu thị"]),
    # Quận Bình Thạnh
    ("Cho thuê căn hộ City Garden 2PN thiết kế sang trọng",         "Quận Bình Thạnh, TP. Hồ Chí Minh", 15_000_000, 70, "2 Phòng ngủ", ["Hồ bơi","Tennis","Gym"]),
    ("Cho thuê căn hộ Vinhomes Central Park 1PN full NT",           "Quận Bình Thạnh, TP. Hồ Chí Minh", 13_000_000, 50, "1 Phòng ngủ", ["Hồ bơi","Gym","Công viên"]),
    ("Cho thuê studio Gateway Thảo Điền 35m2 tiện nghi",            "TP. Thủ Đức, TP. Hồ Chí Minh", 9_000_000,  35, "Studio",      ["Hồ bơi","Gym"]),
    # TP. Thủ Đức (Q.2 cũ, Q.9 cũ, Q.Thủ Đức cũ)
    ("Cho thuê căn hộ Vinhomes Grand Park 2PN mới 100%",            "TP. Thủ Đức, TP. Hồ Chí Minh", 11_000_000, 65, "2 Phòng ngủ", ["Hồ bơi","Gym","Cây xanh"]),
    ("Cho thuê căn hộ Masteri Centre Point 1PN view công viên",     "TP. Thủ Đức, TP. Hồ Chí Minh", 10_000_000, 45, "1 Phòng ngủ", ["Hồ bơi","Gym"]),
    ("Cho thuê căn hộ The Estella Heights 2PN cao cấp",             "TP. Thủ Đức, TP. Hồ Chí Minh", 22_000_000, 85, "2 Phòng ngủ", ["Hồ bơi","Spa","Concierge"]),
    ("Cho thuê căn hộ Eco Green Saigon 1PN ban công xanh",          "Quận 7, TP. Hồ Chí Minh",     9_500_000,  42, "1 Phòng ngủ", ["Cây xanh","Gym","Bãi xe"]),
    ("Cho thuê căn hộ dịch vụ Botanica Premier Tân Bình",           "Quận Tân Bình, TP. Hồ Chí Minh", 8_500_000, 45, "1 Phòng ngủ", ["Hồ bơi","Gym","Bãi xe"]),
    # Tân Bình, Tân Phú, Gò Vấp
    ("Cho thuê studio The Garden Mall Tân Phú tiện nghi đầy đủ",    "Quận Tân Phú, TP. Hồ Chí Minh", 6_500_000, 32, "Studio",     ["Gym","Bảo vệ 24/7"]),
    ("Cho thuê căn hộ Jamila Khang Điền 2PN nội thất cao cấp",      "TP. Thủ Đức, TP. Hồ Chí Minh", 10_500_000, 68, "2 Phòng ngủ", ["Hồ bơi","Gym","Trường học"]),
    ("Cho thuê phòng trọ cao cấp Gò Vấp full NT riêng biệt",        "Quận Gò Vấp, TP. Hồ Chí Minh", 4_500_000,  25, "Phòng trọ",   ["Wifi","Máy lạnh","Máy giặt"]),
    ("Cho thuê phòng trọ Tân Bình gần sân bay tiện nghi",           "Quận Tân Bình, TP. Hồ Chí Minh", 3_800_000, 20, "Phòng trọ",  ["Wifi","Máy lạnh","Bãi xe"]),
    ("Cho thuê phòng trọ quận 12 sạch sẽ an ninh yên tĩnh",        "Quận 12, TP. Hồ Chí Minh",    3_200_000,  18, "Phòng trọ",   ["Wifi","Máy lạnh","Nước nóng"]),
    ("Cho thuê phòng trọ Bình Thạnh gần ĐH VLU giá sinh viên",      "Quận Bình Thạnh, TP. Hồ Chí Minh", 2_800_000, 16, "Phòng trọ", ["Wifi","Máy lạnh"]),
    ("Cho thuê nhà nguyên căn Quận 3 phố Tây 4 phòng ngủ",         "Quận 3, TP. Hồ Chí Minh",     25_000_000, 120, "3 Phòng ngủ", ["Hồ bơi","Bãi xe","Sân vườn"]),
    ("Cho thuê nhà nguyên căn Bình Thạnh 3PN sân vườn xe hơi",     "Quận Bình Thạnh, TP. Hồ Chí Minh", 18_000_000, 100, "3 Phòng ngủ", ["Sân vườn","Bãi xe","Máy lạnh"]),
    ("Cho thuê căn hộ dịch vụ quận 1 cạnh Lotte Mart full NT",      "Quận 1, TP. Hồ Chí Minh",     8_000_000,  28, "Studio",      ["Wifi","Máy lạnh","Housekeeping"]),
    ("Cho thuê căn hộ dịch vụ Bùi Viện quận 1 trung tâm",          "Quận 1, TP. Hồ Chí Minh",     7_500_000,  25, "Studio",      ["Wifi","Máy lạnh","Housekeeping"]),
    ("Cho thuê căn hộ Sunrise Riverside 2PN tầng cao view sông",    "Quận 7, TP. Hồ Chí Minh",     12_000_000, 70, "2 Phòng ngủ", ["Hồ bơi","Gym","Bãi xe"]),
    ("Cho thuê căn hộ The Gold View quận 4 2PN nội thất đẹp",      "Quận 4, TP. Hồ Chí Minh",     13_500_000, 68, "2 Phòng ngủ", ["Hồ bơi","Gym","View sông"]),
    ("Cho thuê officetel Newton Residence quận 3 linh hoạt",        "Quận 3, TP. Hồ Chí Minh",     10_000_000, 40, "Studio",      ["Wifi","Gym","Bãi xe"]),
]

HN_LISTINGS = [
    # Hà Nội
    ("Cho thuê căn hộ Vinhomes Metropolis Liễu Giai 2PN cao cấp",   "Quận Ba Đình, TP. Hà Nội",    20_000_000, 72, "2 Phòng ngủ", ["Hồ bơi","Gym","Bảo vệ 24/7"]),
    ("Cho thuê căn hộ Vinhomes Smart City Tây Mỗ 1PN full NT",      "Quận Nam Từ Liêm, TP. Hà Nội", 9_500_000, 45, "1 Phòng ngủ", ["Hồ bơi","Gym","Cây xanh"]),
    ("Cho thuê căn hộ Sunshine City 2PN view Hồ Tây tuyệt đẹp",    "Quận Tây Hồ, TP. Hà Nội",    15_000_000, 68, "2 Phòng ngủ", ["Hồ bơi","Gym","View hồ"]),
    ("Cho thuê căn hộ Goldmark City Hồ Tùng Mậu 2PN nội thất",     "Quận Bắc Từ Liêm, TP. Hà Nội", 10_000_000, 62, "2 Phòng ngủ", ["Hồ bơi","Gym","Bãi xe"]),
    ("Cho thuê căn hộ D'. Le Pont D'Or Hoàng Cầu 2PN sang trọng",  "Quận Đống Đa, TP. Hà Nội",    18_000_000, 78, "2 Phòng ngủ", ["Hồ bơi","Gym","Concierge"]),
    ("Cho thuê căn hộ The Lancaster Núi Trúc 1PN tiện nghi",        "Quận Ba Đình, TP. Hà Nội",    13_000_000, 52, "1 Phòng ngủ", ["Gym","Bảo vệ 24/7","Bãi xe"]),
    ("Cho thuê phòng trọ Cầu Giấy gần ĐH Quốc Gia full NT",        "Quận Cầu Giấy, TP. Hà Nội",   4_200_000,  22, "Phòng trọ",  ["Wifi","Máy lạnh","Tủ lạnh"]),
    ("Cho thuê phòng trọ Đống Đa gần Bách Khoa tiện nghi",          "Quận Đống Đa, TP. Hà Nội",    3_800_000,  18, "Phòng trọ",  ["Wifi","Máy lạnh","Bãi xe"]),
    ("Cho thuê studio Tây Hồ gần mặt hồ view đẹp",                  "Quận Tây Hồ, TP. Hà Nội",     7_500_000,  35, "Studio",     ["Wifi","Máy lạnh","View hồ"]),
    ("Cho thuê căn hộ dịch vụ Hoàn Kiếm trung tâm phố cổ",         "Quận Hoàn Kiếm, TP. Hà Nội",  9_000_000,  30, "Studio",     ["Wifi","Máy lạnh","Housekeeping"]),
    ("Cho thuê nhà nguyên căn Tây Hồ 4PN sân vườn yên tĩnh",       "Quận Tây Hồ, TP. Hà Nội",    22_000_000, 110, "3 Phòng ngủ", ["Sân vườn","Bãi xe","Máy lạnh"]),
    ("Cho thuê căn hộ Times City 2PN 77m2 full nội thất",           "Quận Hai Bà Trưng, TP. Hà Nội", 11_000_000, 77, "2 Phòng ngủ", ["Hồ bơi","Gym","Trung tâm TM"]),
]

DN_LISTINGS = [
    # Đà Nẵng
    ("Cho thuê căn hộ Azura Đà Nẵng 2PN view biển tuyệt đẹp",      "Quận Hải Châu, TP. Đà Nẵng",  12_000_000, 65, "2 Phòng ngủ", ["Hồ bơi","View biển","Gym"]),
    ("Cho thuê studio Sun Grand City An Thượng gần biển Mỹ Khê",    "Quận Ngũ Hành Sơn, TP. Đà Nẵng", 7_000_000, 32, "Studio",  ["Wifi","Hồ bơi","Bãi biển"]),
    ("Cho thuê phòng trọ Đà Nẵng gần biển Nguyễn Tất Thành",       "Quận Thanh Khê, TP. Đà Nẵng",  3_500_000,  20, "Phòng trọ", ["Wifi","Máy lạnh","Gần biển"]),
    ("Cho thuê nhà nguyên căn Sơn Trà 3PN sát biển đẹp",           "Quận Sơn Trà, TP. Đà Nẵng",   15_000_000, 95, "3 Phòng ngủ", ["Bãi biển","Sân vườn","Bãi xe"]),
]

OTHER_LISTINGS = [
    # Bình Dương, Đồng Nai
    ("Cho thuê căn hộ Vinhomes Smart City Bình Dương 1PN mới",      "TP. Thủ Dầu Một, Tỉnh Bình Dương", 6_500_000, 42, "1 Phòng ngủ", ["Hồ bơi","Gym","Cây xanh"]),
    ("Cho thuê phòng trọ Bình Dương gần KCN Vsip tiện nghi",        "TP. Thuận An, Tỉnh Bình Dương", 2_500_000, 15, "Phòng trọ",  ["Wifi","Máy lạnh","Bãi xe"]),
    ("Cho thuê studio The EastGate Biên Hòa Đồng Nai view hồ",     "TP. Biên Hòa, Tỉnh Đồng Nai",  5_500_000,  30, "Studio",    ["Hồ bơi","Gym","Bãi xe"]),
    # Hải Phòng, Cần Thơ
    ("Cho thuê căn hộ Vinhomes Imperia Hải Phòng 2PN full NT",      "Quận Hồng Bàng, TP. Hải Phòng", 8_000_000, 65, "2 Phòng ngủ", ["Hồ bơi","Gym","Bãi xe"]),
    ("Cho thuê phòng trọ Cần Thơ gần ĐH Cần Thơ giá rẻ",           "Quận Ninh Kiều, TP. Cần Thơ",   2_800_000, 16, "Phòng trọ", ["Wifi","Máy lạnh"]),
]

ALL_LISTINGS_RAW = HCM_LISTINGS + HN_LISTINGS + DN_LISTINGS + OTHER_LISTINGS

# ─── Hình ảnh Unsplash chất lượng cao ──────────────────────────────────────

APARTMENT_IMAGES = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1589834390005-5d4d9a0a4b08?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=600&q=80&fit=crop",
]

POSTED_LABELS = [
    "hôm nay", "hôm nay", "hôm nay",
    "hôm qua", "hôm qua",
    "2 ngày trước", "3 ngày trước",
    "1 tuần trước", "2 tuần trước",
]

def get_province(district: str) -> str:
    if "Hồ Chí Minh" in district: return "TP. Hồ Chí Minh"
    if "Hà Nội" in district:      return "TP. Hà Nội"
    if "Đà Nẵng" in district:     return "TP. Đà Nẵng"
    if "Hải Phòng" in district:   return "TP. Hải Phòng"
    if "Cần Thơ" in district:     return "TP. Cần Thơ"
    if "Bình Dương" in district:  return "Tỉnh Bình Dương"
    if "Đồng Nai" in district:    return "Tỉnh Đồng Nai"
    return "Việt Nam"

def format_price(p: int) -> str:
    m = p / 1_000_000
    if m == int(m):
        return f"{int(m)} triệu/tháng"
    return f"{m:.1f} triệu/tháng"

def make_description(title: str, amenities: list, district: str) -> str:
    am_str = ", ".join(amenities[:4])
    return (
        f"{title}. Vị trí đẹp tại {district}. "
        f"Tiện nghi: {am_str}. "
        f"An ninh 24/7, thang máy tốc độ cao. "
        f"Phù hợp gia đình hoặc chuyên gia nước ngoài. "
        f"Liên hệ ngay để xem phòng và nhận ưu đãi đặc biệt."
    )

def generate():
    listings = []
    rng = random.Random(42)

    for i, (title, district, price, area, ltype, extras) in enumerate(ALL_LISTINGS_RAW):
        uid = hashlib.md5(f"{title}{district}".encode()).hexdigest()[:8]
        listing_id = f"nv{uid}"

        province = get_province(district)

        # Base amenities
        base = ["Wifi", "Máy lạnh", "Máy giặt", "Bãi xe"]
        amenities = list(dict.fromkeys(extras + base))[:6]

        # Tags
        tags = ["AI Verified"]
        if any(k in extras for k in ["Hồ bơi", "Sky Pool"]): tags.append("Hồ bơi")
        elif any(k in extras for k in ["View biển", "View hồ", "View sông"]): tags.append(next(k for k in extras if "View" in k))
        elif "Gym" in extras: tags.append("Gym")
        elif "Sân vườn" in extras: tags.append("Sân vườn")
        else: tags.append("Full nội thất")

        # Rating: hash-based but clustered around 4.5–5.0
        h = int(uid, 16) % 11
        rating = round(4.4 + h * 0.06, 1)

        # Price variation ±5%
        price_var = int(price * rng.uniform(0.95, 1.05))
        price_var = round(price_var / 500_000) * 500_000

        img = APARTMENT_IMAGES[i % len(APARTMENT_IMAGES)]
        posted = POSTED_LABELS[i % len(POSTED_LABELS)]

        listings.append({
            "id":          listing_id,
            "title":       title,
            "price":       format_price(price_var),
            "priceNum":    price_var,
            "area":        f"{area} m²",
            "district":    district,
            "province":    province,
            "type":        ltype,
            "image":       img,
            "tags":        tags[:3],
            "verified":    True,
            "rating":      rating,
            "description": make_description(title, amenities, district),
            "amenities":   amenities,
            "postedAt":    posted,
            "sourceUrl":   f"https://nestaviet.vn/listing/{listing_id}",
        })

    return listings

# ─── Output ──────────────────────────────────────────────────────────────────

TS_OUTPUT_WEB    = "src/data/listings.ts"
TS_OUTPUT_MOBILE = "mobile/constants/listings.ts"

TS_TYPE_WEB = '''// AUTO-GENERATED {date} — {count} listings thực tế thị trường Việt Nam
// Chạy lại: python scripts/generate_listings.py

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
    l.province.toLowerCase().includes(lower) ||
    l.amenities.some(a => a.toLowerCase().includes(lower))
  );
}};
'''

TS_TYPE_MOBILE = '''// AUTO-GENERATED {date} — {count} listings thực tế thị trường Việt Nam
// Chạy lại: python scripts/generate_listings.py

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
'''

if __name__ == "__main__":
    listings = generate()
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    data_json = json.dumps(listings, ensure_ascii=False, indent=2)
    count = len(listings)

    from collections import Counter
    provinces = Counter(l["province"] for l in listings)
    print(f"\n{'='*55}")
    print(f"  NestaVietAI — Generate Listings")
    print(f"{'='*55}")
    print(f"  Tổng: {count} listings")
    for prov, cnt in sorted(provinces.items(), key=lambda x: -x[1]):
        print(f"  {prov:35s} {cnt:3d}")

    import os
    os.makedirs("src/data", exist_ok=True)
    with open(TS_OUTPUT_WEB, "w", encoding="utf-8") as f:
        f.write(TS_TYPE_WEB.format(date=date_str, count=count, data=data_json))
    print(f"\n✅ Web    → {TS_OUTPUT_WEB}")

    with open(TS_OUTPUT_MOBILE, "w", encoding="utf-8") as f:
        f.write(TS_TYPE_MOBILE.format(date=date_str, count=count, data=data_json))
    print(f"✅ Mobile → {TS_OUTPUT_MOBILE}")
    print(f"{'='*55}")
