import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText, ChevronLeft, CheckCircle2, Clock, AlertCircle,
  Download, Eye, PenLine, Shield, Lock, Zap, ChevronDown,
  Building2, Calendar, DollarSign, User, Search, Filter,
  Plus, X, Sparkles, Mail, Phone,
} from "lucide-react";

type ContractRecord = {
  id: string; tenant: string; email?: string; phone?: string;
  unit: string; property: string; start: string; end: string;
  rent: number; deposit: number; status: string; signed: string | null; payDay: number;
};

const INITIAL_CONTRACTS: ContractRecord[] = [
  { id: "HD-2025-001", tenant: "Nguyễn Văn An",   email: "an.nguyen@email.com",  phone: "0901 234 567", unit: "VGP-SC-1204", property: "Vinhomes Grand Park",   start: "01/01/2025", end: "31/12/2025", rent: 10500000, deposit: 21000000, status: "active",  signed: "28/12/2024", payDay: 5  },
  { id: "HD-2025-002", tenant: "Lê Thị Hương",    email: "huong.le@email.com",   phone: "0912 345 678", unit: "VGP-803",     property: "Vinhomes Grand Park",   start: "01/02/2025", end: "31/01/2026", rent: 10500000, deposit: 21000000, status: "active",  signed: "28/01/2025", payDay: 1  },
  { id: "HD-2025-003", tenant: "Võ Thị Kim Ngân", email: "ngan.vo@email.com",    phone: "0923 456 789", unit: "TR-1502",     property: "Tropic Garden",         start: "15/03/2025", end: "14/03/2026", rent: 13500000, deposit: 27000000, status: "pending", signed: null,          payDay: 15 },
  { id: "HD-2024-018", tenant: "Bùi Thanh Tùng",  email: "tung.bui@email.com",   phone: "0934 567 890", unit: "MCP-401",     property: "Masteri Centre Point",  start: "01/06/2024", end: "31/05/2025", rent: 17000000, deposit: 34000000, status: "expired", signed: "29/05/2024",  payDay: 1  },
  { id: "HD-2025-004", tenant: "Hoàng Thị Mai",   email: "mai.hoang@email.com",  phone: "0945 678 901", unit: "EH-PH-02",   property: "The Estella Heights",   start: "01/04/2025", end: "31/03/2026", rent: 26000000, deposit: 52000000, status: "pending", signed: null,          payDay: 1  },
];

const PROPERTIES = ["Vinhomes Grand Park", "Masteri Centre Point", "The Estella Heights", "Eco Green Saigon", "Tropic Garden", "Sunwah Pearl", "Gateway Thảo Điền"];

const FEATURES = [
  { icon: PenLine,  title: "Ký kết điện tử",     desc: "Ký hợp đồng ngay trên nền tảng — hợp lệ pháp lý theo Nghị định 130/2018/NĐ-CP.", color: "#22d3ee" },
  { icon: Shield,   title: "Xác thực danh tính",  desc: "Tích hợp eKYC qua CCCD gắn chip — xác minh hai phía trước khi ký.",               color: "#10b981" },
  { icon: Lock,     title: "Lưu trữ bảo mật",     desc: "AES-256 mã hóa, lưu trên MinIO private cloud — không bên thứ ba nào truy cập.",   color: "#a78bfa" },
  { icon: Zap,      title: "Tự động nhắc hạn",    desc: "Email + push notification trước 30, 15, 7 ngày hết hạn hợp đồng.",               color: "#f59e0b" },
];

const statusMeta: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  active:  { label: "Đang hiệu lực", color: "#10b981", bg: "#10b98118", icon: CheckCircle2 },
  pending: { label: "Chờ ký",        color: "#f59e0b", bg: "#f59e0b18", icon: Clock        },
  expired: { label: "Hết hạn",       color: "#6b7280", bg: "#6b728018", icon: AlertCircle  },
};

function addMonths(dateStr: string, months: number): string {
  const [d, m, y] = dateStr.split("/").map(Number);
  const dt = new Date(y, m - 1 + months, d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
}

function ContractCard({ c, index }: { c: ContractRecord; index: number }) {
  const [open, setOpen] = useState(false);
  const meta = statusMeta[c.status];
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-2xl border border-white/8 overflow-hidden"
      style={{ background: "rgba(15,24,41,0.8)" }}
    >
      <div className="p-5 flex items-center gap-4 cursor-pointer hover:bg-white/3 transition-colors" onClick={() => setOpen(!open)}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
          <FileText size={22} style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-white font-semibold" style={{ fontSize: "0.88rem" }}>{c.tenant}</p>
            <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: meta.bg, color: meta.color, fontSize: "0.6rem" }}>
              {meta.label.toUpperCase()}
            </span>
          </div>
          <p className="text-white/45" style={{ fontSize: "0.75rem" }}>{c.id} · {c.property} · Căn {c.unit}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>{(c.rent / 1e6).toFixed(1)}M<span className="text-white/35 font-normal" style={{ fontSize: "0.72rem" }}>/tháng</span></p>
          <p className="text-white/35" style={{ fontSize: "0.68rem" }}>{c.start} → {c.end}</p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-white/30" />
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/8"
          >
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { icon: DollarSign, label: "Tiền cọc",        value: `${(c.deposit / 1e6).toFixed(0)}M VND`  },
                { icon: Calendar,   label: "Ngày thanh toán",  value: `Ngày ${c.payDay} hàng tháng`           },
                { icon: User,       label: "Ký kết lúc",       value: c.signed ?? "Chưa ký"                   },
                { icon: Building2,  label: "Bất động sản",     value: c.property                              },
              ].map((d) => (
                <div key={d.label} className="bg-white/5 rounded-xl p-3">
                  <d.icon size={13} className="text-white/35 mb-1" />
                  <p className="text-white/45" style={{ fontSize: "0.65rem" }}>{d.label}</p>
                  <p className="text-white font-semibold" style={{ fontSize: "0.78rem" }}>{d.value}</p>
                </div>
              ))}
            </div>
            {(c.email || c.phone) && (
              <div className="px-5 pb-4 flex gap-4">
                {c.email && <span className="flex items-center gap-1.5 text-white/40" style={{ fontSize: "0.72rem" }}><Mail size={11} />{c.email}</span>}
                {c.phone && <span className="flex items-center gap-1.5 text-white/40" style={{ fontSize: "0.72rem" }}><Phone size={11} />{c.phone}</span>}
              </div>
            )}
            <div className="px-5 pb-5 flex gap-3">
              {c.status === "pending" ? (
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(135deg,#10b981,#22d3ee)", fontSize: "0.82rem" }}>
                  <PenLine size={15} />Ký hợp đồng ngay
                </button>
              ) : (
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/12 text-white/65 hover:text-white hover:border-white/25 transition-all" style={{ fontSize: "0.82rem" }}>
                  <Download size={14} />Tải PDF
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/12 text-white/65 hover:text-white hover:border-white/25 transition-all" style={{ fontSize: "0.82rem" }}>
                <Eye size={14} />Xem chi tiết
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Contract Generator Modal ──────────────────────────────────────────────
const DURATION_OPTIONS = [
  { value: "6",  label: "6 tháng" },
  { value: "12", label: "12 tháng" },
  { value: "24", label: "24 tháng" },
];

function ContractGenerator({ onClose, onAdd }: { onClose: () => void; onAdd: (c: ContractRecord) => void }) {
  const [form, setForm] = useState({
    tenant: "", email: "", phone: "", property: PROPERTIES[0],
    unit: "", startDate: "", duration: "12", rent: "",
  });
  const [step, setStep] = useState<"form" | "preview" | "done">("form");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleGenerate = () => {
    if (!form.tenant.trim()) { setError("Vui lòng nhập tên khách thuê"); return; }
    if (!form.unit.trim()) { setError("Vui lòng nhập số căn"); return; }
    if (!form.startDate) { setError("Vui lòng chọn ngày bắt đầu"); return; }
    if (!form.rent || isNaN(Number(form.rent)) || Number(form.rent) <= 0) { setError("Vui lòng nhập tiền thuê hợp lệ"); return; }
    setError("");
    setStep("preview");
  };

  const handleConfirm = () => {
    const [y, m, d] = form.startDate.split("-");
    const startFormatted = `${d}/${m}/${y}`;
    const endFormatted = addMonths(startFormatted, Number(form.duration));
    const rent = Number(form.rent) * 1000000;
    const newId = `HD-2025-${String(Math.floor(Math.random() * 900) + 100)}`;
    onAdd({
      id: newId,
      tenant: form.tenant,
      email: form.email || undefined,
      phone: form.phone || undefined,
      unit: form.unit,
      property: form.property,
      start: startFormatted,
      end: endFormatted,
      rent,
      deposit: rent * 2,
      status: "pending",
      signed: null,
      payDay: 5,
    });
    setStep("done");
  };

  const rentNum = Number(form.rent) || 0;
  const depositNum = rentNum * 2;
  const [y, m, d] = form.startDate ? form.startDate.split("-") : ["", "", ""];
  const startFormatted = form.startDate ? `${d}/${m}/${y}` : "";
  const endFormatted = startFormatted ? addMonths(startFormatted, Number(form.duration)) : "";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-lg rounded-3xl border border-white/12 overflow-hidden"
        style={{ background: "#0b1120", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8" style={{ background: "rgba(16,185,129,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Sparkles size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold" style={{ fontSize: "0.92rem" }}>Tạo hợp đồng điện tử</p>
              <p className="text-white/40" style={{ fontSize: "0.7rem" }}>AI tự động điền điều khoản theo mẫu pháp lý</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step: Form */}
            {step === "form" && (
              <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Tenant */}
                  <div>
                    <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.78rem" }}>Họ tên khách thuê *</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-500/40 transition-colors">
                      <User size={14} className="text-white/30" />
                      <input value={form.tenant} onChange={(e) => set("tenant", e.target.value)} placeholder="Nguyễn Văn A"
                        className="flex-1 bg-transparent text-white placeholder-white/25 outline-none" style={{ fontSize: "0.85rem" }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.78rem" }}>Email</label>
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                        <Mail size={13} className="text-white/30" />
                        <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@..."
                          className="flex-1 bg-transparent text-white placeholder-white/25 outline-none" style={{ fontSize: "0.82rem" }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.78rem" }}>Số điện thoại</label>
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                        <Phone size={13} className="text-white/30" />
                        <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="09xx..."
                          className="flex-1 bg-transparent text-white placeholder-white/25 outline-none" style={{ fontSize: "0.82rem" }} />
                      </div>
                    </div>
                  </div>
                  {/* Property & Unit */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.78rem" }}>Tòa nhà *</label>
                      <select value={form.property} onChange={(e) => set("property", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors"
                        style={{ fontSize: "0.82rem" }}>
                        {PROPERTIES.map((p) => <option key={p} value={p} style={{ background: "#0b1120" }}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.78rem" }}>Số căn *</label>
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                        <Building2 size={13} className="text-white/30" />
                        <input value={form.unit} onChange={(e) => set("unit", e.target.value)} placeholder="VD: A-1205"
                          className="flex-1 bg-transparent text-white placeholder-white/25 outline-none" style={{ fontSize: "0.82rem" }} />
                      </div>
                    </div>
                  </div>
                  {/* Start + Duration */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.78rem" }}>Ngày bắt đầu *</label>
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                        <Calendar size={13} className="text-white/30" />
                        <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)}
                          className="flex-1 bg-transparent text-white outline-none" style={{ fontSize: "0.82rem", colorScheme: "dark" }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.78rem" }}>Thời hạn *</label>
                      <div className="flex gap-2">
                        {DURATION_OPTIONS.map((opt) => (
                          <button key={opt.value} onClick={() => set("duration", opt.value)}
                            className="flex-1 py-2.5 rounded-xl border text-center transition-all"
                            style={{ fontSize: "0.78rem", borderColor: form.duration === opt.value ? "#10b981" : "rgba(255,255,255,0.1)", background: form.duration === opt.value ? "#10b98118" : "transparent", color: form.duration === opt.value ? "#10b981" : "rgba(255,255,255,0.5)" }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Rent */}
                  <div>
                    <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.78rem" }}>Tiền thuê (triệu VND/tháng) *</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-500/40 transition-colors">
                      <DollarSign size={14} className="text-white/30" />
                      <input type="number" value={form.rent} onChange={(e) => set("rent", e.target.value)} placeholder="10.5"
                        className="flex-1 bg-transparent text-white placeholder-white/25 outline-none" style={{ fontSize: "0.85rem" }} />
                      <span className="text-white/35" style={{ fontSize: "0.78rem" }}>triệu/tháng</span>
                    </div>
                    {rentNum > 0 && (
                      <p className="mt-1 text-white/40" style={{ fontSize: "0.7rem" }}>Tiền cọc: {rentNum * 2} triệu VND (2 tháng)</p>
                    )}
                  </div>
                </div>

                {error && <p className="text-red-400 flex items-center gap-1.5" style={{ fontSize: "0.78rem" }}><AlertCircle size={13} />{error}</p>}

                <button onClick={handleGenerate}
                  className="w-full py-3.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#10b981,#22d3ee)", fontSize: "0.9rem" }}>
                  <Sparkles size={16} />AI Tạo hợp đồng
                </button>
              </motion.div>
            )}

            {/* Step: Preview */}
            {step === "preview" && (
              <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-5 mb-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={15} className="text-emerald-400" />
                    <p className="text-emerald-400 font-semibold" style={{ fontSize: "0.82rem" }}>AI đã tạo hợp đồng — vui lòng xác nhận</p>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: "Khách thuê",    value: form.tenant },
                      { label: "Bất động sản",  value: `${form.property} · Căn ${form.unit}` },
                      { label: "Thời hạn",      value: `${startFormatted} → ${endFormatted} (${form.duration} tháng)` },
                      { label: "Tiền thuê",     value: `${rentNum.toLocaleString("vi-VN")} triệu VND/tháng` },
                      { label: "Tiền cọc",      value: `${depositNum.toLocaleString("vi-VN")} triệu VND` },
                      { label: "Ngày thanh toán", value: "Ngày 5 hàng tháng" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-white/5">
                        <span className="text-white/45" style={{ fontSize: "0.78rem" }}>{row.label}</span>
                        <span className="text-white font-medium" style={{ fontSize: "0.82rem" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 mb-5 flex gap-2.5">
                  <AlertCircle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-300" style={{ fontSize: "0.75rem", lineHeight: 1.6 }}>
                    Hợp đồng sẽ ở trạng thái "Chờ ký". Email mời ký sẽ được gửi đến khách thuê sau khi xác nhận.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep("form")}
                    className="flex-1 py-3 rounded-xl border border-white/12 text-white/65 hover:text-white hover:border-white/25 transition-all" style={{ fontSize: "0.85rem" }}>
                    Chỉnh sửa
                  </button>
                  <button onClick={handleConfirm}
                    className="flex-1 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg,#10b981,#22d3ee)", fontSize: "0.85rem" }}>
                    <CheckCircle2 size={15} />Xác nhận tạo HĐ
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step: Done */}
            {step === "done" && (
              <motion.div key="done" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <p className="text-white font-bold mb-2" style={{ fontSize: "1.1rem" }}>Hợp đồng đã được tạo!</p>
                <p className="text-white/50 mb-6" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Email mời ký đã gửi đến khách thuê.<br />
                  Trạng thái: <span className="text-amber-400 font-semibold">Chờ ký</span>
                </p>
                <button onClick={onClose}
                  className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg,#10b981,#22d3ee)", fontSize: "0.88rem" }}>
                  Xong
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ContractsPage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);
  const [contracts, setContracts] = useState<ContractRecord[]>(INITIAL_CONTRACTS);

  const filtered = contracts.filter((c) =>
    (filterStatus === "all" || c.status === filterStatus) &&
    (c.tenant.toLowerCase().includes(search.toLowerCase()) ||
     c.property.toLowerCase().includes(search.toLowerCase()) ||
     c.id.toLowerCase().includes(search.toLowerCase()))
  );

  const addContract = (c: ContractRecord) => {
    setContracts((prev) => [c, ...prev]);
    setShowGenerator(false);
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #070e1c 0%, #0a0f1e 50%, #07101c 100%)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(148,163,184,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 30% 20%, rgba(16,185,129,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 70% 80%, rgba(34,211,238,0.04) 0%, transparent 55%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontSize: "0.82rem" }}>
          <ChevronLeft size={16} />Trang chủ
        </button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 mb-6">
            <FileText size={13} className="text-emerald-400" />
            <span className="text-emerald-400 font-semibold" style={{ fontSize: "0.75rem" }}>Hợp đồng điện tử</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-white mb-4" style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, lineHeight: 1.15 }}>
                Ký hợp đồng thuê nhà<br />
                <span style={{ background: "linear-gradient(90deg,#10b981,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>an toàn & hợp pháp</span>
              </h1>
              <p className="text-white/50 max-w-xl" style={{ fontSize: "1rem", lineHeight: 1.75 }}>
                Hệ thống hợp đồng điện tử tích hợp eKYC — ký số ngay trên app, lưu trữ bảo mật AES-256, tự động nhắc hạn và hợp lệ theo pháp luật Việt Nam.
              </p>
            </div>
            <button
              onClick={() => setShowGenerator(true)}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#10b981,#22d3ee)", fontSize: "0.85rem" }}>
              <Plus size={16} />Tạo hợp đồng mới
            </button>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.07 }}
              className="rounded-2xl p-4 border border-white/8" style={{ background: "rgba(15,24,41,0.7)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: f.color + "18" }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <p className="text-white font-semibold mb-1" style={{ fontSize: "0.82rem" }}>{f.title}</p>
              <p className="text-white/40" style={{ fontSize: "0.7rem", lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="grid grid-cols-3 gap-4 mb-10 rounded-2xl p-5 border border-emerald-500/12"
          style={{ background: "rgba(16,185,129,0.05)" }}>
          {[
            { value: `${contracts.length}`, label: "Hợp đồng trong hệ thống" },
            { value: "100%", label: "Hợp lệ pháp lý" },
            { value: "<2 phút", label: "Thời gian tạo HĐ" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-emerald-400 font-bold mb-1" style={{ fontSize: "1.6rem" }}>{s.value}</p>
              <p className="text-white/45" style={{ fontSize: "0.75rem" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Contract list */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="text-white font-bold" style={{ fontSize: "1.1rem" }}>Danh sách hợp đồng</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 min-w-[180px]">
                <Search size={14} className="text-white/35" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm hợp đồng..."
                  className="flex-1 bg-transparent outline-none text-white placeholder-white/25" style={{ fontSize: "0.8rem" }} />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-white/35" />
                {[{ v: "all", l: "Tất cả" }, { v: "active", l: "Hiệu lực" }, { v: "pending", l: "Chờ ký" }, { v: "expired", l: "Hết hạn" }].map((f) => (
                  <button key={f.v} onClick={() => setFilterStatus(f.v)}
                    className="px-3 py-1.5 rounded-xl border transition-all"
                    style={{ fontSize: "0.75rem", borderColor: filterStatus === f.v ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)", background: filterStatus === f.v ? "rgba(16,185,129,0.1)" : "transparent", color: filterStatus === f.v ? "#10b981" : "rgba(255,255,255,0.4)" }}>
                    {f.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {filtered.map((c, i) => <ContractCard key={c.id} c={c} index={i} />)}
            {filtered.length === 0 && (
              <div className="py-16 text-center text-white/30 rounded-2xl border border-white/8" style={{ background: "rgba(15,24,41,0.4)" }}>
                <FileText size={32} className="mx-auto mb-3 opacity-30" />
                <p style={{ fontSize: "0.88rem" }}>Không tìm thấy hợp đồng phù hợp</p>
                <button onClick={() => setShowGenerator(true)} className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/8 transition-all" style={{ fontSize: "0.8rem" }}>
                  <Plus size={14} />Tạo hợp đồng mới
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl p-8 border border-emerald-500/15 text-center"
          style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.08),rgba(34,211,238,0.05))" }}>
          <p className="text-white font-bold mb-2" style={{ fontSize: "1.2rem" }}>Sẵn sàng ký hợp đồng?</p>
          <p className="text-white/45 mb-5" style={{ fontSize: "0.88rem" }}>Đăng ký tài khoản, tìm căn hộ và ký ngay trong 2 phút.</p>
          <button onClick={() => navigate("/tenant/register")} className="px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(135deg,#10b981,#22d3ee)", fontSize: "0.9rem" }}>
            Bắt đầu ngay
          </button>
        </motion.div>
      </div>

      {/* Generator Modal */}
      <AnimatePresence>
        {showGenerator && (
          <ContractGenerator
            onClose={() => setShowGenerator(false)}
            onAdd={addContract}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
