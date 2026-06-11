// ============================================================
// Agent 2 — Super Broker AI
// Nhiệm vụ: Tìm kiếm & Tư vấn thuê nhà bằng RAG + Semantic
// Giai đoạn: Lead Generation
// ============================================================
// TODO (team): Thay mock responses bằng gọi API thực:
//   POST /api/agents/super-broker/chat
//   Body: { message: string; sessionId: string; userId: string }
//   Response: { reply: string; listings?: Listing[]; slots?: CalendarSlot[] }
// ============================================================

export const superBrokerConfig = {
  id:    "broker" as const,
  icon:  "🤖",
  name:  "Super Broker AI",
  sub:   "Tìm & tư vấn thuê nhà · RAG + Semantic Search",
  color: "#22D3EE",
} as const;

export const superBrokerQuickPrompts = [
  "Tìm studio dưới 8tr/tháng ở Q.1",
  "So sánh Quận 7 và Bình Thạnh",
  "Hướng dẫn ký hợp đồng thuê nhà",
  "Phí dịch vụ thường bao gồm gì?",
];

export const superBrokerGreeting =
  "Xin chào! Tôi là **Super Broker AI** 🤖\n\n" +
  "Tôi tìm căn hộ phù hợp nhất bằng RAG + Semantic Search. Hãy cho tôi biết:\n" +
  "• 📍 Khu vực bạn muốn ở?\n" +
  "• 💰 Ngân sách hàng tháng?\n" +
  "• 🏠 Cần mấy phòng ngủ?";

// ─── Mock responses (xoá khi có API thực) ───────────────────
const MOCK: Record<string, string> = {
  studio:
    "📍 Tìm được 3 studio dưới 8tr/tháng ở Quận 1:\n\n" +
    "• Studio hiện đại — 7.9tr, 25m², full nội thất, tầng 12\n" +
    "• Studio cozy — 7.5tr, 22m², gần Bến Thành\n" +
    "• Studio view city — 7.2tr, 20m², ban công rộng\n\n" +
    "Bạn muốn đặt lịch xem căn nào không?",

  compare:
    "📊 So sánh Quận 7 vs Bình Thạnh:\n\n" +
    "🏙️ Quận 7: 7–15tr/tháng · gần RMIT, Lotte Mart · yên tĩnh\n" +
    "🌆 Bình Thạnh: 5–10tr/tháng · gần Metro số 1 · năng động\n\n" +
    "Làm việc ở trung tâm → Bình Thạnh tiện hơn.\n" +
    "Cần không gian yên tĩnh → Quận 7 phù hợp.",

  contract:
    "📋 Hướng dẫn ký hợp đồng:\n\n" +
    "1. Kiểm tra CMND + sổ hồng của chủ nhà\n" +
    "2. Xác nhận giá thuê, ngày bắt đầu/kết thúc\n" +
    "3. Đọc kỹ điều khoản phạt cọc, sửa chữa\n" +
    "4. Chụp ảnh tình trạng phòng trước khi vào\n" +
    "5. Ký hợp đồng điện tử qua NestaVietAI 🔒",

  default:
    "Tôi đang phân tích yêu cầu của bạn bằng RAG + Semantic Search...\n\n" +
    "Bạn có thể cho tôi biết thêm:\n" +
    "• Khu vực mong muốn (quận/huyện)?\n" +
    "• Ngân sách tối đa mỗi tháng?\n" +
    "• Nhu cầu đặc biệt (thú cưng, chỗ để xe, hướng ban công)?",
};

// ─── Main reply function ─────────────────────────────────────
// TODO (team): Thay toàn bộ hàm này bằng:
//   export async function superBrokerReply(message: string, sessionId: string): Promise<string> {
//     const res = await fetch(`${API_BASE}/agents/super-broker/chat`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
//       body: JSON.stringify({ message, sessionId }),
//     });
//     const data = await res.json();
//     return data.reply;
//   }
export function superBrokerReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("studio") || m.includes("8tr") || m.includes("quận 1")) return MOCK.studio;
  if (m.includes("so sánh") || m.includes("quận 7") || m.includes("bình thạnh")) return MOCK.compare;
  if (m.includes("hợp đồng") || m.includes("ký")) return MOCK.contract;
  return MOCK.default;
}
