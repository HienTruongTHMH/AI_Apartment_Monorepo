import { Shield, Zap, Bot, MessageSquare, BarChart3, Lock, Eye, Key, Database, Activity, Search, Home, ArrowRight, FileText } from "lucide-react";
import { LISTINGS as REAL_LISTINGS } from "@features/listing";

// ─── Images ──────────────────────────────────────────────────────────────────
export const IMG_APT_1 = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=75&fit=crop";
export const IMG_APT_2 = "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=75&fit=crop";
export const IMG_APT_3 = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=75&fit=crop";
export const IMG_APT_4 = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=75&fit=crop";
export const IMG_APT_5 = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=75&fit=crop";
export const IMG_APT_6 = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=75&fit=crop";
export const IMG_APT_7 = "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&q=75&fit=crop";
export const IMG_APT_8 = "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&q=75&fit=crop";

export const LISTINGS = [
  { id: 1, img: IMG_APT_1, name: "Vinhomes Grand Park",   district: "TP. Thủ Đức",  priceFrom: 8.5, priceTo: 15, available: 4, area: "45–85 m²",   rating: 4.9, badge: "Mới nhất",      badgeHex: "#10b981", amenities: ["Hồ bơi","Gym","Bãi xe"] },
  { id: 2, img: IMG_APT_2, name: "Masteri Centre Point",  district: "TP. Thủ Đức",  priceFrom: 12,  priceTo: 22, available: 2, area: "60–120 m²",  rating: 4.8, badge: "Cao cấp",       badgeHex: "#8b5cf6", amenities: ["Sky Bar","Hồ bơi","Concierge"] },
  { id: 3, img: IMG_APT_3, name: "The Estella Heights",   district: "TP.HCM",        priceFrom: 18,  priceTo: 35, available: 1, area: "85–150 m²",  rating: 4.7, badge: "Sang trọng",   badgeHex: "#f59e0b", amenities: ["Concierge","Gym","Spa"] },
  { id: 4, img: IMG_APT_4, name: "Eco Green Saigon",      district: "TP.HCM",        priceFrom: 7,   priceTo: 13, available: 6, area: "40–75 m²",   rating: 4.6, badge: "Còn nhiều",    badgeHex: "#06b6d4", amenities: ["Cây xanh","Gym","Bãi xe"] },
  { id: 5, img: IMG_APT_5, name: "Sunwah Pearl",          district: "Bình Thạnh",    priceFrom: 14,  priceTo: 28, available: 3, area: "60–110 m²",  rating: 4.8, badge: "Hot Deal",     badgeHex: "#ef4444", amenities: ["Sky Pool","Gym","Business Ctr"] },
  { id: 6, img: IMG_APT_6, name: "Gateway Thảo Điền",    district: "TP. Thủ Đức",   priceFrom: 11,  priceTo: 20, available: 5, area: "50–95 m²",   rating: 4.6, badge: "View sông",   badgeHex: "#3b82f6", amenities: ["Hồ bơi","Gym","Bãi xe"] },
  { id: 7, img: IMG_APT_7, name: "Riviera Point",         district: "Quận 7",        priceFrom: 15,  priceTo: 30, available: 2, area: "70–130 m²",  rating: 4.7, badge: "Cao cấp",     badgeHex: "#8b5cf6", amenities: ["Hồ bơi","Concierge","Spa"] },
  { id: 8, img: IMG_APT_8, name: "Botanica Premier",      district: "Tân Bình",      priceFrom: 9,   priceTo: 17, available: 7, area: "45–80 m²",   rating: 4.5, badge: "Còn nhiều",   badgeHex: "#06b6d4", amenities: ["Cây xanh","Hồ bơi","Gym"] },
];

// ─── Real listings — mapped to card format ───────────────────────────────────
const BADGE_COLORS = ["#22d3ee","#10b981","#8b5cf6","#f59e0b","#ef4444","#3b82f6"];
export const FEATURED_REAL = REAL_LISTINGS
  .filter(l => l.priceNum > 0)
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 24)
  .map((l, i) => ({
    id:        -(i + 1),
    img:       l.image,
    name:      l.title.length > 45 ? l.title.slice(0, 44) + "…" : l.title,
    district:  l.district,
    priceFrom: Math.max(1, Math.round(l.priceNum / 1_000_000)),
    priceTo:   Math.round(l.priceNum / 1_000_000) + Math.max(1, Math.round(l.priceNum / 5_000_000)),
    available: 1 + (Math.abs(parseInt(l.id, 10) || i) % 5),
    area:      l.area,
    rating:    l.rating,
    badge:     l.tags[0] ?? l.type,
    badgeHex:  BADGE_COLORS[i % BADGE_COLORS.length],
    amenities: l.amenities.slice(0, 3),
    province:  l.province,
    sourceUrl: l.sourceUrl,
  }));

export const AGENTS = [
  { id: 1, name: "Listing Verifier", icon: Shield,       g: "from-blue-500 to-cyan-400",    desc: "Kiểm duyệt NLP + Vision AI, sinh SEO copy tự động" },
  { id: 2, name: "Super Broker",     icon: MessageSquare, g: "from-emerald-500 to-teal-400", desc: "Tư vấn conversational search 24/7, RAG + chốt lịch hẹn" },
  { id: 3, name: "Smart Concierge",  icon: Zap,           g: "from-violet-500 to-purple-400",desc: "Triage sự cố, dispatch kỹ thuật, theo dõi SLA" },
  { id: 4, name: "Contract & Admin", icon: BarChart3,     g: "from-orange-500 to-amber-400", desc: "Hóa đơn VietQR, reconcile thanh toán, báo cáo dòng tiền" },
];
export const AGENT_COLORS  = ["#3b82f6","#10b981","#8b5cf6","#f59e0b"];
export const AGENT_METRICS = [
  { val: "234",   label: "Listings duyệt hôm nay", sub: "12 bị từ chối tự động" },
  { val: "1,204", label: "Phiên tư vấn AI",        sub: "Avg. reply: 1.2s" },
  { val: "89",    label: "Tickets xử lý",          sub: "SLA đạt: 97.8%" },
  { val: "156",   label: "Hóa đơn xuất",           sub: "0 sai sót tính toán" },
];
export const AGENT_LOGS = [
  { agent: "Listing Verifier", msg: "Duyệt xong #L-2204 — NLP OK, 4/4 ảnh đạt chuẩn → Đã đăng lên sàn",              color: "#3b82f6" },
  { agent: "Super Broker",     msg: "Tư vấn khách 2PN Q7 <12M — RAG gợi ý 3 lựa chọn, chốt lịch hẹn Thứ 7",           color: "#10b981" },
  { agent: "Smart Concierge",  msg: "Ticket T-089: Điều hoà hỏng T8 — Gán kỹ thuật viên Minh, SLA còn 2h45p",           color: "#8b5cf6" },
  { agent: "Contract Agent",   msg: "Xuất 156 hóa đơn T5 — VietQR đính kèm, gửi email xong 100%",                      color: "#f59e0b" },
  { agent: "Listing Verifier", msg: "Phát hiện watermark #IMG-0392 — Từ chối tự động, yêu cầu chủ nhà chụp lại",       color: "#3b82f6" },
  { agent: "Super Broker",     msg: "Khách VIP hỏi 3PN Thảo Điền — Kết nối chủ nhà, tour ảo 8h sáng mai",              color: "#10b981" },
  { agent: "Smart Concierge",  msg: "Ticket T-090 đóng — Xử lý trong 2h47p, cư dân đánh giá 5⭐",                       color: "#8b5cf6" },
  { agent: "Contract Agent",   msg: "Webhook: P.1204 thanh toán 11.5M ₫ — Gạch nợ & gửi biên nhận tự động",             color: "#f59e0b" },
];

export const SECURITY_FEATURES = [
  { icon: Lock,     title: "TLS 1.3 & HTTPS",       desc: "Toàn bộ dữ liệu mã hóa end-to-end. A+ SSL Rating.",                  color: "#ef4444", tag: "A+ Rating"  },
  { icon: Shield,   title: "OWASP Top 10",           desc: "Phòng chống SQLi, XSS, CSRF, IDOR theo chuẩn OWASP 2021.",            color: "#f97316", tag: "Compliant"  },
  { icon: Eye,      title: "WAF & DDoS Protection",  desc: "Web Application Firewall, rate limiting & bot mitigation tự động.",   color: "#eab308", tag: "Always-on"  },
  { icon: Key,      title: "Zero-Trust Auth",         desc: "JWT + rotating refresh token, bcrypt, brute-force lockout.",          color: "#22d3ee", tag: "Secure"     },
  { icon: Database, title: "Encryption at Rest",      desc: "AES-256 mã hóa dữ liệu nhạy cảm tại tầng DB — CCCD, hợp đồng.",    color: "#a78bfa", tag: "AES-256"    },
  { icon: Activity, title: "SIEM Monitoring 24/7",   desc: "Giám sát real-time, anomaly detection, cảnh báo tức thì.",            color: "#34d399", tag: "24/7"       },
];

export const MARQUEE_ITEMS = [
  { text: "Dữ liệu thị trường thực tế",  dot: "#22d3ee" },
  { text: "4.9 ★ App Store",           dot: "#fbbf24" },
  { text: "AI Agents 24/7",            dot: "#a78bfa" },
  { text: "98% Khách hài lòng",        dot: "#34d399" },
  { text: "3,200+ Giao dịch / tháng", dot: "#22d3ee" },
  { text: "4.8 ★ Google Play",         dot: "#fbbf24" },
  { text: "TLS 1.3 Bảo mật",          dot: "#ef4444" },
  { text: "VietQR Tích hợp",          dot: "#10b981" },
  { text: "Hợp đồng điện tử",         dot: "#8b5cf6" },
  { text: "Phản hồi trong 1.2s",      dot: "#22d3ee" },
  { text: "34 Tỉnh thành phủ sóng",   dot: "#a78bfa" },
  { text: "Expo SDK 53 · React Native",dot: "#3b82f6" },
];

export const DISTRICTS_FILTER = ["Tất cả quận", "TP. Thủ Đức", "Quận 7", "Bình Thạnh", "Tân Bình", "Quận 1", "Quận 3"];

export const TOUR_STEPS = [
  { title: "Tìm kiếm bằng AI", desc: "Nhắn tin tự nhiên — AI Super Broker hiểu ngữ cảnh và lọc căn hộ phù hợp trong giây lát.", icon: Search },
  { title: "4 AI Agents · 24/7", desc: "Mỗi agent chuyên một nghiệp vụ: duyệt tin, tư vấn, quản lý sự cố, xuất hóa đơn.", icon: Bot },
  { title: "Căn hộ đã xác thực", desc: "Listing Verifier AI kiểm tra hình ảnh, giá và thông tin trước khi đăng lên sàn.", icon: Shield },
  { title: "Đăng ký miễn phí", desc: "Không cần thẻ tín dụng. Trải nghiệm đầy đủ tính năng PropTech ngay hôm nay.", icon: ArrowRight },
];

// ─── Animation variants ───────────────────────────────────────────────────────
export const bentoContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
export const bentoCardVariants = {
  hidden:   { opacity: 0, y: 60, scale: 0.94 },
  visible:  { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20 } },
};
export const bentoAICardVariants = {
  hidden:   { opacity: 0, x: -30, y: 40, scale: 0.94 },
  visible:  { opacity: 1, x: 0, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20 } },
};
export const securityContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
};
export const securityCardVariants = {
  hidden:   { opacity: 0, y: 32, scale: 0.95 },
  visible:  { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 130, damping: 22 } },
};

// ─── Re-export real listings count ────────────────────────────────────────────
export { REAL_LISTINGS };

// Suppress unused import warnings for icon-only exports used in SECURITY_FEATURES
void FileText;
