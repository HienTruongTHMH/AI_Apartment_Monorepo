import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle, CheckCircle2, Sparkles, X,
  User, Mail, Phone, Building2, Calendar, DollarSign,
} from "lucide-react";
import {
  type ContractRecord,
  PROPERTIES,
  DURATION_OPTIONS,
  addMonths,
} from "@features/shared-pages/components/ContractsData";

interface ContractGeneratorProps {
  onClose: () => void;
  onAdd: (c: ContractRecord) => void;
}

export default function ContractGenerator({ onClose, onAdd }: ContractGeneratorProps) {
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
