import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  DollarSign, ChevronLeft, CheckCircle2, Clock, AlertCircle,
  CreditCard, Smartphone, QrCode, Shield, Zap, RefreshCw,
  ArrowUpRight, Bell, Download, ChevronDown,
  Receipt, Copy, Check,
} from "lucide-react";

const PAYMENTS = [
  { id: "PAY-2025-041", date: "05/04/2025", desc: "Tiền thuê T4 — VGP-SC-1204", amount: 10500000, method: "VietQR",  status: "success", ref: "VQR2025040500123" },
  { id: "PAY-2025-038", date: "05/03/2025", desc: "Tiền thuê T3 — VGP-SC-1204", amount: 10500000, method: "Momo",    status: "success", ref: "MOMO202503052811" },
  { id: "PAY-2025-035", date: "05/02/2025", desc: "Tiền thuê T2 — VGP-SC-1204", amount: 10500000, method: "Banking", status: "success", ref: "MB202502051204" },
  { id: "PAY-2025-042", date: "15/04/2025", desc: "Tiền thuê T4 — TR-1502",     amount: 13500000, method: "VietQR",  status: "pending", ref: "VQR2025041500456" },
  { id: "PAY-2025-040", date: "01/04/2025", desc: "Tiền thuê T4 — EH-PH-02",   amount: 26000000, method: "Banking", status: "failed",  ref: "MB202504011800" },
  { id: "PAY-2025-039", date: "01/04/2025", desc: "Phí dịch vụ Q1 — VGP-803",  amount: 850000,  method: "Momo",    status: "success", ref: "MOMO202504010912" },
];

const METHODS = [
  { id: "vietqr",  name: "VietQR",          icon: QrCode,     color: "#10b981", desc: "Quét mã QR — thanh toán ngay qua mọi app ngân hàng", fee: "0đ" },
  { id: "momo",    name: "MoMo",            icon: Smartphone, color: "#e91e8c", desc: "Ví điện tử MoMo — xác nhận bằng sinh trắc học",      fee: "0đ" },
  { id: "banking", name: "Internet Banking", icon: CreditCard, color: "#3b82f6", desc: "Chuyển khoản qua tất cả ngân hàng Việt Nam",         fee: "0đ" },
  { id: "zalopay", name: "ZaloPay",          icon: Smartphone, color: "#0078ff", desc: "Ví ZaloPay — thanh toán trong 1 chạm",               fee: "0đ" },
];

const FEATURES = [
  { icon: Shield,    title: "Bảo mật PCI-DSS",   desc: "Tuân thủ chuẩn PCI-DSS Level 1 — chuẩn bảo mật cao nhất cho thanh toán trực tuyến.", color: "#22d3ee" },
  { icon: Zap,       title: "Xác nhận tức thì",  desc: "Nhận biên lai điện tử và cập nhật trạng thái trong vòng 5 giây sau khi thanh toán.",   color: "#10b981" },
  { icon: Bell,      title: "Nhắc tự động",       desc: "Push notification + email trước 3 ngày đến hạn — không bao giờ trả muộn.",             color: "#f59e0b" },
  { icon: RefreshCw, title: "Lịch sử đầy đủ",    desc: "Toàn bộ lịch sử giao dịch, biên lai PDF có thể tải xuống mọi lúc.",                   color: "#a78bfa" },
];

const statusMeta: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  success: { label: "Thành công", color: "#10b981", bg: "#10b98118", icon: CheckCircle2 },
  pending: { label: "Đang xử lý", color: "#f59e0b", bg: "#f59e0b18", icon: Clock       },
  failed:  { label: "Thất bại",   color: "#ef4444", bg: "#ef444418", icon: AlertCircle },
};

const methodColor: Record<string, string> = { VietQR: "#10b981", Momo: "#e91e8c", Banking: "#3b82f6", ZaloPay: "#0078ff" };

// Invoice config for T5/2025
const INVOICE = {
  month: "T5/2025",
  unit: "VGP-SC-1204",
  property: "Vinhomes Grand Park",
  dueDate: "05/05/2025",
  baseRent: 10500000,
  serviceRate: 0.05,
  vatRate: 0.10,
};

// Mock QR SVG component
function MockQRCode({ size = 180, color = "#111827" }: { size?: number; color?: string }) {
  const cells = 21;
  const m = Math.floor(size / cells);

  const isFinderFilled = (r: number, c: number) => {
    const inTopLeft = r < 7 && c < 7;
    const inTopRight = r < 7 && c >= 14;
    const inBotLeft = r >= 14 && c < 7;
    if (inTopLeft || inTopRight || inBotLeft) {
      const lr = inBotLeft ? r - 14 : r;
      const lc = inTopRight ? c - 14 : c;
      if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
      if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
      return false;
    }
    return false;
  };

  const isFilled = (r: number, c: number): boolean => {
    if (r < 7 && c < 7) return isFinderFilled(r, c);
    if (r < 7 && c >= 14) return isFinderFilled(r, c);
    if (r >= 14 && c < 7) return isFinderFilled(r, c);
    // Separators
    if ((r === 7 || r === 13) && c < 9) return false;
    if ((c === 7 || c === 13) && r < 9) return false;
    // Timing
    if (r === 6 && c >= 8 && c <= 12) return c % 2 === 0;
    if (c === 6 && r >= 8 && r <= 12) return r % 2 === 0;
    // Alignment pattern (version 2)
    if (r >= 16 && r <= 20 && c >= 16 && c <= 20) {
      const ar = r - 16, ac = c - 16;
      if (ar === 0 || ar === 4 || ac === 0 || ac === 4) return true;
      if (ar === 2 && ac === 2) return true;
      return false;
    }
    // Data area — deterministic pattern
    const seed = (r * 31 + c * 17 + r * c * 3) % 11;
    return seed < 5;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {Array.from({ length: cells }, (_, r) =>
        Array.from({ length: cells }, (_, c) =>
          isFilled(r, c) ? (
            <rect key={`${r}-${c}`} x={c * m} y={r * m} width={m} height={m} fill={color} />
          ) : null
        )
      )}
    </svg>
  );
}

export function PaymentsPage() {
  const navigate = useNavigate();
  const [activeMethod, setActiveMethod] = useState("vietqr");
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalPaid    = PAYMENTS.filter((p) => p.status === "success").reduce((s, p) => s + p.amount, 0);
  const totalPending = PAYMENTS.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  const serviceFee = Math.round(INVOICE.baseRent * INVOICE.serviceRate);
  const vatAmount  = Math.round((INVOICE.baseRent + serviceFee) * INVOICE.vatRate);
  const totalDue   = INVOICE.baseRent + serviceFee + vatAmount;

  const handleCopy = () => {
    navigator.clipboard.writeText("9704060123456789").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #070e1c 0%, #0a0f1e 50%, #07101c 100%)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(148,163,184,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 20% 20%, rgba(59,130,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(16,185,129,0.05) 0%, transparent 55%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontSize: "0.82rem" }}>
          <ChevronLeft size={16} />Trang chủ
        </button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/8 mb-6">
            <DollarSign size={13} className="text-blue-400" />
            <span className="text-blue-400 font-semibold" style={{ fontSize: "0.75rem" }}>Thanh toán online</span>
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, lineHeight: 1.15 }}>
            Thanh toán tiền thuê<br />
            <span style={{ background: "linear-gradient(90deg,#3b82f6,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>nhanh chóng & an toàn</span>
          </h1>
          <p className="text-white/50 max-w-xl" style={{ fontSize: "1rem", lineHeight: 1.75 }}>
            Hỗ trợ VietQR, MoMo, ZaloPay và Internet Banking — không phí giao dịch, xác nhận tức thì, biên lai tự động gửi email.
          </p>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Đã thanh toán", value: `${(totalPaid / 1e6).toFixed(1)}M`,    change: "+3 giao dịch",  up: true,  color: "#10b981", icon: ArrowUpRight },
            { label: "Đang xử lý",   value: `${(totalPending / 1e6).toFixed(1)}M`, change: "1 giao dịch",   up: false, color: "#f59e0b", icon: Clock       },
            { label: "Tiết kiệm phí",value: "0đ",                                  change: "100% miễn phí", up: true,  color: "#22d3ee", icon: CheckCircle2 },
          ].map((k, i) => (
            <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(15,24,41,0.8)" }}>
              <div className="flex items-center justify-between mb-3">
                <DollarSign size={16} className="text-white/35" />
                <k.icon size={14} style={{ color: k.color }} />
              </div>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: k.color }}>{k.value}</p>
              <p className="text-white/70 font-semibold" style={{ fontSize: "0.78rem" }}>{k.label}</p>
              <p className="text-white/35" style={{ fontSize: "0.65rem" }}>{k.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Invoice + Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* Invoice */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(15,24,41,0.8)" }}>
            <div className="px-5 py-4 border-b border-white/8 flex items-center gap-3" style={{ background: "rgba(59,130,246,0.06)" }}>
              <Receipt size={16} className="text-blue-400" />
              <div className="flex-1">
                <p className="text-white font-bold" style={{ fontSize: "0.88rem" }}>Hóa đơn {INVOICE.month}</p>
                <p className="text-white/40" style={{ fontSize: "0.7rem" }}>{INVOICE.property} · Căn {INVOICE.unit} · Hạn: {INVOICE.dueDate}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold" style={{ fontSize: "0.65rem" }}>Chưa thanh toán</span>
            </div>
            <div className="p-5">
              <div className="space-y-3 mb-4">
                {[
                  { label: "Tiền thuê cơ bản",    amount: INVOICE.baseRent,  color: "text-white"      },
                  { label: `Phí quản lý (${INVOICE.serviceRate * 100}%)`, amount: serviceFee, color: "text-white/70" },
                  { label: `VAT (${INVOICE.vatRate * 100}%)`,             amount: vatAmount,  color: "text-white/70" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-white/50" style={{ fontSize: "0.82rem" }}>{row.label}</span>
                    <span className={row.color} style={{ fontSize: "0.85rem" }}>{fmt(row.amount)}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-white font-bold" style={{ fontSize: "0.9rem" }}>Tổng thanh toán</span>
                  <span className="text-blue-400 font-bold" style={{ fontSize: "1.1rem" }}>{fmt(totalDue)}</span>
                </div>
              </div>
              <div className="bg-white/4 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-white/40" style={{ fontSize: "0.65rem" }}>Số tài khoản nhận</p>
                  <p className="text-white font-mono font-semibold" style={{ fontSize: "0.82rem" }}>9704 0601 2345 6789</p>
                  <p className="text-white/40" style={{ fontSize: "0.65rem" }}>Vietcombank · Nguyễn Thu Lan</p>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-white/60 hover:text-white transition-all" style={{ fontSize: "0.72rem" }}>
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copied ? "Đã sao chép" : "Sao chép"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Payment method + QR */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
            className="rounded-2xl border border-white/8" style={{ background: "rgba(15,24,41,0.8)" }}>
            <div className="p-5">
              <h2 className="text-white font-bold mb-4" style={{ fontSize: "0.95rem" }}>Phương thức thanh toán</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {METHODS.map((m) => (
                  <button key={m.id} onClick={() => { setActiveMethod(m.id); setShowQR(false); }}
                    className="rounded-xl p-3 border text-left transition-all"
                    style={{ borderColor: activeMethod === m.id ? m.color + "50" : "rgba(255,255,255,0.08)", background: activeMethod === m.id ? m.color + "10" : "rgba(255,255,255,0.03)" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: m.color + "18" }}>
                      <m.icon size={16} style={{ color: m.color }} />
                    </div>
                    <p className="text-white font-semibold" style={{ fontSize: "0.78rem" }}>{m.name}</p>
                    <p className="text-emerald-400" style={{ fontSize: "0.62rem" }}>Phí: {m.fee}</p>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeMethod === "vietqr" && (
                  <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {showQR ? (
                      <div className="flex flex-col items-center py-2">
                        <div className="w-44 h-44 rounded-2xl overflow-hidden mb-3 shadow-lg">
                          <MockQRCode size={176} color="#111827" />
                        </div>
                        <p className="text-white font-bold mb-0.5" style={{ fontSize: "0.88rem" }}>{fmt(totalDue)}</p>
                        <p className="text-white/50 text-center mb-1" style={{ fontSize: "0.72rem" }}>Quét mã bằng app ngân hàng</p>
                        <p className="text-white/30 text-center" style={{ fontSize: "0.65rem" }}>Mã hết hạn sau 15 phút · {INVOICE.month} · Căn {INVOICE.unit}</p>
                      </div>
                    ) : (
                      <button onClick={() => setShowQR(true)}
                        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{ background: "linear-gradient(135deg,#10b981,#22d3ee)", fontSize: "0.9rem" }}>
                        <QrCode size={18} />Tạo mã QR · {fmt(totalDue)}
                      </button>
                    )}
                  </motion.div>
                )}
                {activeMethod !== "vietqr" && (
                  <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <button className="w-full py-3.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
                      style={{ background: `linear-gradient(135deg,${methodColor[METHODS.find((m) => m.id === activeMethod)?.name ?? ""] ?? "#3b82f6"},${methodColor[METHODS.find((m) => m.id === activeMethod)?.name ?? ""] ?? "#3b82f6"}99)`, fontSize: "0.9rem" }}>
                      Thanh toán {fmt(totalDue)} qua {METHODS.find((m) => m.id === activeMethod)?.name}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.07 }}
              className="rounded-2xl p-4 border border-white/8" style={{ background: "rgba(15,24,41,0.7)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: f.color + "18" }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <p className="text-white font-semibold mb-1" style={{ fontSize: "0.82rem" }}>{f.title}</p>
              <p className="text-white/40" style={{ fontSize: "0.7rem", lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Transaction history */}
        <div>
          <h2 className="text-white font-bold mb-4" style={{ fontSize: "1.1rem" }}>Lịch sử giao dịch</h2>
          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(15,24,41,0.8)" }}>
            <div className="divide-y divide-white/5">
              {PAYMENTS.map((p, i) => {
                const meta = statusMeta[p.status];
                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="px-5 py-4 flex items-center gap-4 hover:bg-white/3 transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                      <meta.icon size={18} style={{ color: meta.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold" style={{ fontSize: "0.82rem" }}>{p.desc}</p>
                      <p className="text-white/40" style={{ fontSize: "0.7rem" }}>{p.date} · {p.method} · {p.ref}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-bold" style={{ fontSize: "0.88rem" }}>{(p.amount / 1e6).toFixed(2)}M</p>
                      <span className="px-2 py-0.5 rounded-full font-semibold" style={{ background: meta.bg, color: meta.color, fontSize: "0.6rem" }}>{meta.label}</span>
                    </div>
                    <button className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 text-white/35 hover:text-white/70 transition-colors">
                      <Download size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between px-1">
            <p className="text-white/35" style={{ fontSize: "0.72rem" }}>{PAYMENTS.length} giao dịch gần nhất</p>
            <button className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors" style={{ fontSize: "0.78rem" }}>
              Xem tất cả <ChevronDown size={13} className="rotate-[-90deg]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
