// ============================================================
// Agent 1 — Listing Verifier
// Nhiệm vụ: Kiểm duyệt & Chuẩn hóa dữ liệu tin đăng
// Giai đoạn: Onboarding tài sản — Đầu vào
// ============================================================
// TODO (team): Thay mock responses bằng gọi API thực:
//
//   POST /api/agents/listing-verifier/verify
//   Body: { rawText: string; images?: string[] }   (images: base64 hoặc URL)
//   Response: {
//     title: string;          // tiêu đề chuẩn hóa SEO
//     description: string;    // mô tả chuẩn hóa
//     extracted: {
//       area: string; price: string; bedrooms: number;
//       furnished: boolean; petFriendly: boolean;
//     };
//     imageReport: Array<{ index: number; status: "ok"|"warn"|"fail"; reason: string }>;
//     seoScore: number;       // 0–100
//     verdict: "approved" | "draft";
//   }
//
//   GET /api/agents/listing-verifier/health
//   Response: { online: boolean; model: string }
// ============================================================

export const listingVerifierConfig = {
  id:    "verifier" as const,
  icon:  "🔍",
  name:  "Listing Verifier",
  sub:   "Kiểm duyệt tin đăng · NLP + Vision AI",
  color: "#F59E0B",
} as const;

export const listingVerifierQuickPrompts = [
  "Kiểm tra tiêu đề tin đăng của tôi",
  "Ảnh tin đăng có đạt chuẩn không?",
  "Tối ưu mô tả SEO cho tin đăng",
  "Tin đăng sẽ được duyệt bao lâu?",
];

export const listingVerifierGreeting =
  "Xin chào! Tôi là **Listing Verifier** 🔍\n\n" +
  "Tôi kiểm duyệt tin đăng bằng NLP & Vision AI. Tôi có thể:\n" +
  "• ✍️ Chuẩn hóa tiêu đề & mô tả tối ưu SEO\n" +
  "• 🖼️ Đánh giá chất lượng và tính xác thực của ảnh\n" +
  "• ✅ Cấp nhãn \"AI Verified\" cho tin đủ chuẩn";

// ─── Mock responses (xoá khi có API thực) ───────────────────
const MOCK: Record<string, string> = {
  tieude:
    "✍️ **Phân tích tiêu đề tin đăng:**\n\n" +
    "Vấn đề phát hiện:\n" +
    "• Thiếu diện tích cụ thể\n" +
    "• Thiếu từ khóa khu vực (tên quận)\n" +
    "• Không đề cập tiện ích nổi bật\n\n" +
    "✅ Gợi ý tiêu đề tối ưu:\n" +
    "\"Studio 25m² Full Nội Thất, Ban Công View Thành Phố — Quận 1, 7.9tr/tháng\"\n\n" +
    "SEO score: 87/100 (+42 so với tiêu đề gốc)",

  anh:
    "🖼️ **Kết quả kiểm tra Vision AI:**\n\n" +
    "• Ảnh 1 (Phòng khách): ✅ Đạt — độ sáng tốt, góc chụp chuẩn\n" +
    "• Ảnh 2 (Phòng ngủ): ✅ Đạt — hiển thị đầy đủ nội thất\n" +
    "• Ảnh 3 (Bếp): ⚠️ Cần cải thiện — góc chụp quá tối\n" +
    "• Ảnh 4 (WC): ❌ Không đạt — phát hiện watermark đối thủ\n\n" +
    "Yêu cầu: Thay ảnh 3 và 4 để đạt nhãn AI Verified.",

  seo:
    "🔍 **Phân tích SEO mô tả:**\n\n" +
    "✅ Điểm mạnh:\n" +
    "• Đề cập đầy đủ tiện ích (máy lạnh, tủ lạnh, máy giặt)\n" +
    "• Từ khóa khu vực rõ ràng\n\n" +
    "⚠️ Cần bổ sung:\n" +
    "• Thêm từ khóa: \"gần trường\", \"gần bệnh viện\", \"đường metro\"\n" +
    "• Độ dài: 180 từ (tối ưu 250–350 từ)\n" +
    "• Bổ sung chính sách: thú cưng, khách ở cùng\n\n" +
    "SEO Score: 72/100",

  duyet:
    "⏱️ **Thời gian duyệt tin đăng:**\n\n" +
    "• Tin thường (không AI Verified): 2–4 giờ\n" +
    "• Tin AI Verified: **15–30 phút** ⚡\n\n" +
    "Quy trình AI Verified:\n" +
    "1. NLP chuẩn hóa nội dung (~2 phút)\n" +
    "2. Vision AI kiểm tra ảnh (~5 phút)\n" +
    "3. Auto-publish lên sàn (~1 phút)\n\n" +
    "Bạn muốn nâng cấp tin đăng lên AI Verified không?",

  default:
    "Tôi có thể kiểm duyệt tin đăng của bạn:\n" +
    "• ✍️ Phân tích & tối ưu tiêu đề SEO\n" +
    "• 🖼️ Đánh giá chất lượng ảnh (Vision AI)\n" +
    "• 📝 Chuẩn hóa mô tả, trích xuất thực thể\n" +
    "• ✅ Cấp nhãn \"AI Verified\" khi đạt chuẩn\n\n" +
    "Bạn muốn bắt đầu kiểm tra phần nào?",
};

// ─── Main reply function ─────────────────────────────────────
// TODO (team): Thay bằng async function gọi API thực
export function listingVerifierReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("tiêu đề") || m.includes("tên tin"))           return MOCK.tieude;
  if (m.includes("ảnh") || m.includes("hình") || m.includes("chuẩn")) return MOCK.anh;
  if (m.includes("seo") || m.includes("mô tả") || m.includes("tối ưu")) return MOCK.seo;
  if (m.includes("duyệt") || m.includes("bao lâu") || m.includes("thời gian")) return MOCK.duyet;
  return MOCK.default;
}
