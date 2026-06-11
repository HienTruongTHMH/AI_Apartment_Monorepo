import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Receipt, Banknote } from "lucide-react";

interface InvoiceItem {
  label: string;
  amount: string;
}

interface Invoice {
  id: string;
  month: string;
  items: InvoiceItem[];
  total: string;
  status: "paid" | "unpaid";
  due: string;
}

const INVOICES: Invoice[] = [
  {
    id: "INV-0425", month: "Tháng 4/2025",
    items: [{ label: "Tiền thuê", amount: "11,500,000" }, { label: "Điện", amount: "680,000" }, { label: "Nước", amount: "120,000" }, { label: "Phí dịch vụ", amount: "200,000" }],
    total: "12,500,000", status: "unpaid", due: "25/04/2025",
  },
  {
    id: "INV-0325", month: "Tháng 3/2025",
    items: [{ label: "Tiền thuê", amount: "11,500,000" }, { label: "Điện", amount: "720,000" }, { label: "Nước", amount: "130,000" }, { label: "Phí dịch vụ", amount: "200,000" }],
    total: "12,550,000", status: "paid", due: "25/03/2025",
  },
];

export default function InvoicesTab() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedInvoice = INVOICES.find((i) => i.id === selected);

  return (
    <div className="flex-1 overflow-hidden flex bg-gray-50">
      {/* Invoice list */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.05rem" }}>Hóa đơn</h2>
          <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Contract & Admin Agent</p>
        </div>
        {/* Summary */}
        <div className="mx-4 mt-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow">
          <p className="text-emerald-100" style={{ fontSize: "0.72rem" }}>Tháng 4/2025 - Cần thanh toán</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>12.500.000 ₫</p>
          <p className="text-emerald-100" style={{ fontSize: "0.68rem" }}>Hạn: 25/04/2025</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {INVOICES.map((inv) => (
            <motion.div key={inv.id} whileHover={{ x: 2 }} onClick={() => setSelected(inv.id)}
              className={`rounded-2xl p-4 border cursor-pointer transition-all ${selected === inv.id ? "border-emerald-300 bg-emerald-50" : "border-gray-100 bg-white shadow-sm hover:border-gray-200"}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <FileText size={13} className="text-gray-400" />
                  <span className="text-gray-500" style={{ fontSize: "0.72rem" }}>{inv.id}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full ${inv.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`} style={{ fontSize: "0.62rem", fontWeight: 600 }}>
                  {inv.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
              <p className="text-gray-900 font-semibold" style={{ fontSize: "0.875rem" }}>{inv.month}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>Hạn: {inv.due}</p>
                <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>{inv.total} ₫</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Invoice detail */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedInvoice ? (
            <motion.div key={selectedInvoice.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900 font-bold" style={{ fontSize: "1.2rem" }}>{selectedInvoice.month}</h3>
                  <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>{selectedInvoice.id}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full font-semibold ${selectedInvoice.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`} style={{ fontSize: "0.8rem" }}>
                  {selectedInvoice.status === "paid" ? "✓ Đã thanh toán" : "⚠ Chưa thanh toán"}
                </span>
              </div>

              {/* Line items */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
                <div className="px-5 py-4 border-b border-gray-50">
                  <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Chi tiết hóa đơn</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {selectedInvoice.items.map((item) => (
                    <div key={item.label} className="flex justify-between px-5 py-3.5">
                      <span className="text-gray-600" style={{ fontSize: "0.875rem" }}>{item.label}</span>
                      <span className="text-gray-900 font-semibold" style={{ fontSize: "0.875rem" }}>{item.amount} ₫</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-5 py-4 bg-gray-50">
                    <span className="text-gray-900 font-bold" style={{ fontSize: "0.95rem" }}>Tổng cộng</span>
                    <span className="text-emerald-600 font-bold" style={{ fontSize: "1.05rem" }}>{selectedInvoice.total} ₫</span>
                  </div>
                </div>
              </div>

              {/* VietQR payment */}
              {selectedInvoice.status === "unpaid" && (
                <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
                  <p className="text-gray-700 font-bold mb-4" style={{ fontSize: "0.95rem" }}>Quét mã VietQR để thanh toán</p>
                  <div className="w-44 h-44 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 border-2 border-gray-100 shadow-inner">
                    <svg width="120" height="120" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="white" />
                      <rect x="0" y="0" width="30" height="30" fill="#1a1a1a" /><rect x="5" y="5" width="20" height="20" fill="white" /><rect x="9" y="9" width="12" height="12" fill="#1a1a1a" />
                      <rect x="70" y="0" width="30" height="30" fill="#1a1a1a" /><rect x="75" y="5" width="20" height="20" fill="white" /><rect x="79" y="9" width="12" height="12" fill="#1a1a1a" />
                      <rect x="0" y="70" width="30" height="30" fill="#1a1a1a" /><rect x="5" y="75" width="20" height="20" fill="white" /><rect x="9" y="79" width="12" height="12" fill="#1a1a1a" />
                      {[35, 45, 55, 65].map((x) => [35, 45, 55, 65].map((y) => Math.sin(x * y) > 0 && (
                        <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#1a1a1a" />
                      )))}
                    </svg>
                  </div>
                  <p className="text-gray-600 font-semibold" style={{ fontSize: "0.85rem" }}>MB Bank — 0123 4567 8901</p>
                  <p className="text-gray-400 mb-1" style={{ fontSize: "0.75rem" }}>NestaViet PropTech JSC</p>
                  <div className="bg-emerald-50 rounded-xl p-2.5 mb-4">
                    <p className="text-emerald-700" style={{ fontSize: "0.78rem" }}>Nội dung: {selectedInvoice.id} THANH TOAN</p>
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl shadow-md"
                    style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                    <Banknote className="inline mr-2" size={18} />
                    Xác nhận đã chuyển khoản
                  </motion.button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center h-full text-center p-12">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Receipt size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-semibold" style={{ fontSize: "0.95rem" }}>Chọn hóa đơn để xem chi tiết</p>
              <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>Thông tin và mã QR thanh toán sẽ hiển thị ở đây</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
