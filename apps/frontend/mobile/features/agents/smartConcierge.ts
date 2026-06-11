// ============================================================
// Agent 3 — Smart Concierge
// Nhiệm vụ: Vận hành & Điều phối SLA sự cố 24/7
// Giai đoạn: Tenant Care — Hậu mãi & Lưu trú
// ============================================================
// TODO (team): Thay mock responses bằng gọi API thực:
//   POST /api/agents/smart-concierge/ticket
//   Body: { message: string; unitId: string; priority?: "urgent"|"normal"|"low" }
//   Response: { ticketId: string; assignee: string; eta: string; reply: string }
//
//   GET /api/agents/smart-concierge/tickets?userId=xxx
//   Response: { tickets: Ticket[] }
// ============================================================

export const smartConciergeConfig = {
  id:    "concierge" as const,
  icon:  "🛠️",
  name:  "Smart Concierge",
  sub:   "Báo sự cố & hỗ trợ vận hành · SLA 24/7",
  color: "#34D399",
} as const;

export const smartConciergeQuickPrompts = [
  "Máy lạnh phòng tôi bị hỏng",
  "Thang máy không hoạt động",
  "Vòi nước rò rỉ phòng tắm",
  "Tra cứu trạng thái ticket của tôi",
];

export const smartConciergeGreeting =
  "Xin chào! Tôi là **Smart Concierge** 🛠️\n\n" +
  "Tôi xử lý sự cố & hỗ trợ vận hành 24/7. Để phân loại nhanh, bạn hãy cho biết:\n" +
  "• 📌 Sự cố xảy ra ở đâu (phòng, tầng)?\n" +
  "• ⚡ Mức độ: khẩn cấp hay bình thường?\n" +
  "• 📷 Có thể mô tả chi tiết vấn đề?";

// ─── Mock responses (xoá khi có API thực) ───────────────────
const MOCK: Record<string, string> = {
  mayclanh:
    "🔧 **Ticket T-00X đã được tạo** — Mức độ: Thường\n\n" +
    "Tôi đã phân công đội kỹ thuật:\n" +
    "• Kỹ thuật viên: Nguyễn Văn A\n" +
    "• ETA: trong vòng 4 giờ\n" +
    "• Trạng thái: Đang tiếp nhận ⏳\n\n" +
    "Bạn sẽ nhận thông báo khi kỹ thuật viên xác nhận.",

  thangmay:
    "⚡ **Ticket T-00X đã được tạo** — Mức độ: Khẩn cấp\n\n" +
    "Thang máy hỏng ảnh hưởng nhiều cư dân. Tôi đã:\n" +
    "• Cảnh báo Ban Quản lý ngay lập tức\n" +
    "• Liên hệ đội kỹ thuật khẩn\n" +
    "• ETA: 30–60 phút\n\n" +
    "Xin lỗi vì bất tiện này.",

  voiruoc:
    "🚿 **Ticket T-00X đã được tạo** — Mức độ: Trung bình\n\n" +
    "• Kỹ thuật viên: Trần Văn B\n" +
    "• ETA: trong vòng 8 giờ\n" +
    "• Gợi ý tạm thời: Tắt van chính trong phòng tắm\n\n" +
    "Bạn cần hỗ trợ gì thêm không?",

  ticket:
    "📋 **Danh sách ticket của bạn:**\n\n" +
    "• T-001: Máy lạnh — Đang xử lý ⏳ (ETA: 2h nữa)\n" +
    "• T-002: Bóng đèn hành lang — Đã giải quyết ✅\n" +
    "• T-003: Vòi nước — Chờ kỹ thuật viên 🕐\n\n" +
    "Bạn muốn xem chi tiết ticket nào?",

  default:
    "Tôi đã ghi nhận vấn đề của bạn.\n\n" +
    "Để xử lý nhanh nhất, vui lòng cho biết:\n" +
    "• Sự cố xảy ra ở vị trí cụ thể nào?\n" +
    "• Đây có phải sự cố khẩn cấp không?\n" +
    "• Bạn có thể chụp ảnh đính kèm không?\n\n" +
    "Tôi sẽ tạo ticket và phân công kỹ thuật viên phù hợp.",
};

// ─── Main reply function ─────────────────────────────────────
// TODO (team): Thay bằng async function gọi API thực
export function smartConciergeReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("máy lạnh") || m.includes("điều hòa")) return MOCK.mayclanh;
  if (m.includes("thang máy") || m.includes("thang"))    return MOCK.thangmay;
  if (m.includes("vòi") || m.includes("nước rò"))        return MOCK.voiruoc;
  if (m.includes("ticket") || m.includes("tra cứu") || m.includes("trạng thái")) return MOCK.ticket;
  return MOCK.default;
}
