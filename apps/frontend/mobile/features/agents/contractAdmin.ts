// ============================================================
// Agent 4 — Contract & Admin
// Nhiệm vụ: Pháp lý & Kế toán Tự động
// Giai đoạn: Billing & Operations — Thu hồi công nợ
// ============================================================
// TODO (team): Thay mock responses bằng gọi API thực:
//
//   GET  /api/contracts/:userId/current
//   Response: { contractId, room, startDate, endDate, price, status }
//
//   POST /api/payments/vietqr
//   Body: { contractId, month, year }
//   Response: { qrData: string, amount: number, bankAccount: string, ref: string }
//
//   GET  /api/invoices/:userId?month=5&year=2025
//   Response: { items: InvoiceItem[], total: number }
// ============================================================

export const contractAdminConfig = {
  id:    "contract" as const,
  icon:  "📋",
  name:  "Contract & Admin",
  sub:   "Hợp đồng, hóa đơn & VietQR",
  color: "#A78BFA",
} as const;

export const contractAdminQuickPrompts = [
  "Xem hợp đồng hiện tại của tôi",
  "Tạo VietQR thanh toán tháng này",
  "Hóa đơn điện nước tháng này",
  "Hợp đồng sắp hết hạn bao giờ?",
];

export const contractAdminGreeting =
  "Xin chào! Tôi là **Contract & Admin** 📋\n\n" +
  "Tôi quản lý hợp đồng, hóa đơn và thanh toán tự động. Tôi có thể giúp:\n" +
  "• 📄 Xem & ký hợp đồng điện tử\n" +
  "• 💳 Tạo VietQR thanh toán tức thì\n" +
  "• 📊 Tra cứu lịch sử hóa đơn";

// ─── Mock responses (xoá khi có API thực) ───────────────────
const MOCK: Record<string, string> = {
  hopdong:
    "📄 **Hợp đồng hiện tại của bạn:**\n\n" +
    "• Mã HĐ: HD-2025-001\n" +
    "• Phòng: 12A, Tòa Central Tower\n" +
    "• Thời hạn: 01/01/2025 – 31/12/2025\n" +
    "• Giá thuê: 8.500.000đ/tháng\n" +
    "• Trạng thái: Đang hiệu lực ✅\n\n" +
    "Bạn muốn gia hạn hay xem toàn bộ điều khoản?",

  vietqr:
    "💳 **VietQR Thanh toán Tháng 5/2025:**\n\n" +
    "• Tiền thuê: 8.500.000đ\n" +
    "• Phí quản lý (5%): 425.000đ\n" +
    "• Điện/nước: 320.000đ\n" +
    "• **Tổng cộng: 9.245.000đ**\n\n" +
    "Bank: Vietcombank · STK: 1234 5678 9012\n" +
    "Nội dung: HD2025001 T5/2025\n\n" +
    "QR code đã sẵn sàng để quét!",

  hoadon:
    "🧾 **Hóa đơn Tháng 5/2025:**\n\n" +
    "• Điện: 120 số × 3.500đ = 420.000đ\n" +
    "• Nước: 8m³ × 15.000đ = 120.000đ\n" +
    "• Internet: 200.000đ\n" +
    "• Phí gửi xe: 150.000đ\n" +
    "• **Phụ phí tổng: 890.000đ**\n\n" +
    "Hóa đơn chính thức gửi qua email trước ngày 5 mỗi tháng.",

  hethan:
    "📅 **Thông tin gia hạn hợp đồng:**\n\n" +
    "• Hết hạn: 31/12/2025\n" +
    "• Còn lại: **238 ngày**\n" +
    "• Giá gia hạn dự kiến: +3–5% theo CPI\n\n" +
    "Tôi sẽ gửi nhắc nhở trước 60 ngày.\n" +
    "Bạn muốn đặt lịch thảo luận gia hạn với chủ nhà không?",

  default:
    "Tôi có thể giúp bạn với:\n" +
    "• 📄 Xem & ký hợp đồng điện tử\n" +
    "• 💳 Tạo VietQR thanh toán\n" +
    "• 🧾 Tra cứu hóa đơn điện/nước\n" +
    "• 📅 Gia hạn hợp đồng\n" +
    "• 📊 Báo cáo lịch sử thanh toán\n\n" +
    "Bạn cần hỗ trợ vấn đề nào?",
};

// ─── Main reply function ─────────────────────────────────────
// TODO (team): Thay bằng async function gọi API thực
export function contractAdminReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("hợp đồng") || m.includes("xem hợp"))                    return MOCK.hopdong;
  if (m.includes("vietqr") || m.includes("thanh toán") || m.includes("tháng")) return MOCK.vietqr;
  if (m.includes("hóa đơn") || m.includes("điện") || m.includes("nước"))  return MOCK.hoadon;
  if (m.includes("hết hạn") || m.includes("gia hạn") || m.includes("bao giờ")) return MOCK.hethan;
  return MOCK.default;
}
