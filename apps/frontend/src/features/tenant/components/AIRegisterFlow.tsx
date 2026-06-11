import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, ChevronRight, CheckCircle2,
  MapPin, Home, Calendar, User, Mail, Phone,
  BedDouble, DollarSign, Search, Bot,
} from "lucide-react";
import { getAllWardsInProvince } from "@/data/vietnam-admin";
import {
  ALL_PROVINCES, ROOM_TYPES, AMENITIES, PRICE_MARKS,
  type PersonalInfo, isPersonalInfoValid,
} from "@features/tenant/components/TenantRegisterData";
import PersonalInfoStep from "@features/tenant/components/PersonalInfoStep";
import RegisterDoneScreen from "@features/tenant/components/RegisterDoneScreen";

interface AIRegisterFlowProps {
  onBack: () => void;
}

export default function AIRegisterFlow({ onBack }: AIRegisterFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [attempted, setAttempted] = useState(false);
  const [done, setDone] = useState(false);
  const [wardSearch, setWardSearch] = useState("");

  const [needs, setNeeds] = useState({
    city: "TP. Hồ Chí Minh", wards: [] as string[],
    roomTypes: [] as string[], budgetMin: 5, budgetMax: 20,
    moveInDate: "", amenities: [] as string[],
  });
  const [info, setInfo] = useState<PersonalInfo>({ fullName: "", phone: "", email: "", password: "", confirmPassword: "" });

  const allWards = useMemo(() => getAllWardsInProvince(needs.city), [needs.city]);
  const filteredWards = useMemo(
    () => wardSearch.trim() ? allWards.filter((w) => w.name.toLowerCase().includes(wardSearch.toLowerCase())) : allWards,
    [allWards, wardSearch]
  );

  const toggle = <K extends "wards" | "roomTypes" | "amenities">(key: K, val: string) => {
    setNeeds((f) => ({
      ...f, [key]: (f[key] as string[]).includes(val)
        ? (f[key] as string[]).filter((x) => x !== val)
        : [...(f[key] as string[]), val],
    }));
  };

  const canNext = () => {
    if (step === 1) return needs.roomTypes.length > 0;
    if (step === 2) return !!isPersonalInfoValid(info);
    return true;
  };

  const handleNext = () => {
    if (!canNext()) { setAttempted(true); return; }
    if (step < 3) { setStep((s) => (s + 1) as 1 | 2 | 3); setAttempted(false); }
    else {
      try { localStorage.setItem("nv-tenant-user", JSON.stringify({ name: info.fullName, email: info.email })); } catch {}
      setDone(true);
    }
  };

  if (done) return <RegisterDoneScreen mode="ai" info={info} />;

  const stepLabels = ["Nhu cầu tìm nhà", "Thông tin cá nhân", "Hoàn tất"];

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-white/40 hover:text-white/70 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Bot size={14} className="text-white" />
          </div>
          <span className="text-white font-bold" style={{ fontSize: "0.95rem" }}>Tìm nhà với AI Super Broker</span>
        </div>
      </div>

      <div className="flex items-center gap-0 mb-8">
        {stepLabels.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const active = step === n; const completed = step > n;
          return (
            <div key={n} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${completed ? "bg-emerald-500" : active ? "bg-gradient-to-br from-emerald-500 to-cyan-500" : "bg-white/10"}`} style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                  {completed ? <CheckCircle2 size={15} className="text-white" /> : <span className="text-white">{n}</span>}
                </div>
                <span className={`mt-1.5 text-center ${active ? "text-white" : "text-white/40"}`} style={{ fontSize: "0.65rem", fontWeight: active ? 600 : 400, whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px mx-2 mb-5 transition-colors ${completed ? "bg-emerald-500/50" : "bg-white/10"}`} />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} transition={{ duration: 0.22 }}>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-white/70 mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Tỉnh / Thành phố</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 z-10" />
                  <select value={needs.city} onChange={(e) => { setNeeds((f) => ({ ...f, city: e.target.value, wards: [] })); setWardSearch(""); }}
                    className="w-full bg-white/5 border border-white/15 rounded-xl py-3 pl-9 pr-4 text-white outline-none focus:border-cyan-500/50 transition-colors cursor-pointer appearance-none"
                    style={{ fontSize: "0.875rem", colorScheme: "dark" }}>
                    {ALL_PROVINCES.map((p) => <option key={p} value={p} className="bg-[#0A0F1E]">{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Phường / Xã <span className="text-white/30 font-normal">(có thể chọn nhiều)</span>
                </label>
                {needs.wards.length > 0 && <p className="text-emerald-400 mb-1.5" style={{ fontSize: "0.72rem" }}>Đã chọn: {needs.wards.length} phường/xã</p>}
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="text" placeholder={`Tìm phường/xã thuộc ${needs.city}...`} value={wardSearch}
                    onChange={(e) => setWardSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl py-2.5 pl-9 pr-4 text-white placeholder-white/25 outline-none focus:border-cyan-500/50 transition-colors"
                    style={{ fontSize: "0.85rem" }} />
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                  {filteredWards.length === 0 ? (
                    <span className="text-white/30" style={{ fontSize: "0.8rem" }}>{wardSearch ? "Không tìm thấy" : "Tỉnh này chưa có dữ liệu phường/xã"}</span>
                  ) : filteredWards.map((w) => (
                    <button key={w.name} onClick={() => toggle("wards", w.name)}
                      className={`px-3 py-1.5 rounded-full border transition-all ${needs.wards.includes(w.name) ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-white/5 border-white/15 text-white/50 hover:border-white/30"}`}
                      style={{ fontSize: "0.78rem" }}>{w.name}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Loại phòng <span className="text-red-400">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_TYPES.map((r) => (
                    <button key={r} onClick={() => toggle("roomTypes", r)}
                      className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${needs.roomTypes.includes(r) ? "bg-violet-500/20 border-violet-500 text-violet-400" : "bg-white/5 border-white/15 text-white/60 hover:border-white/30"}`}
                      style={{ fontSize: "0.85rem" }}>
                      <BedDouble size={13} />{r}
                    </button>
                  ))}
                </div>
                {attempted && needs.roomTypes.length === 0 && <p className="mt-1.5 text-red-400" style={{ fontSize: "0.75rem" }}>Vui lòng chọn ít nhất một loại phòng</p>}
              </div>

              <div>
                <label className="block text-white/70 mb-3" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Ngân sách: <span className="text-cyan-400">{needs.budgetMin}M – {needs.budgetMax}M ₫/tháng</span>
                </label>
                <div className="px-2 space-y-3">
                  {(["budgetMin", "budgetMax"] as const).map((key) => (
                    <div key={key}>
                      <p className="text-white/40 mb-1" style={{ fontSize: "0.72rem" }}>{key === "budgetMin" ? "Tối thiểu" : "Tối đa"}</p>
                      <input type="range" min={3} max={50} step={1} value={needs[key]}
                        onChange={(e) => setNeeds((f) => ({
                          ...f,
                          [key]: key === "budgetMin"
                            ? Math.min(+e.target.value, f.budgetMax - 1)
                            : Math.max(+e.target.value, f.budgetMin + 1)
                        }))}
                        className="w-full accent-cyan-500" />
                    </div>
                  ))}
                  <div className="flex justify-between">
                    {PRICE_MARKS.map((m) => <span key={m} className="text-white/30" style={{ fontSize: "0.62rem" }}>{m}M</span>)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Dự kiến dọn vào</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="date" value={needs.moveInDate} onChange={(e) => setNeeds((f) => ({ ...f, moveInDate: e.target.value }))}
                    className="w-full bg-white/5 border border-white/15 rounded-xl py-3 pl-9 pr-4 text-white/80 outline-none focus:border-cyan-500/50 transition-colors"
                    style={{ fontSize: "0.875rem", colorScheme: "dark" }} />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Tiện ích ưu tiên</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((a) => (
                    <button key={a} onClick={() => toggle("amenities", a)}
                      className={`px-3 py-1.5 rounded-full border transition-all ${needs.amenities.includes(a) ? "bg-amber-500/20 border-amber-500 text-amber-400" : "bg-white/5 border-white/15 text-white/50 hover:border-white/30"}`}
                      style={{ fontSize: "0.8rem" }}>{a}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <PersonalInfoStep info={info} onChange={(u) => setInfo((p) => ({ ...p, ...u }))} attempted={attempted} />
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <p className="text-white font-semibold mb-3" style={{ fontSize: "0.95rem" }}>Xác nhận thông tin</p>
                {[
                  { icon: MapPin, label: "Tỉnh / Thành phố", val: needs.city },
                  { icon: MapPin, label: "Phường / Xã", val: needs.wards.length > 0 ? needs.wards.join(", ") : "Tất cả" },
                  { icon: Home, label: "Loại phòng", val: needs.roomTypes.join(", ") || "—" },
                  { icon: DollarSign, label: "Ngân sách", val: `${needs.budgetMin}M – ${needs.budgetMax}M ₫/tháng` },
                  { icon: User, label: "Họ tên", val: info.fullName },
                  { icon: Mail, label: "Email", val: info.email },
                  { icon: Phone, label: "Điện thoại", val: info.phone },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon size={14} className="text-white/30 mt-0.5 flex-shrink-0" />
                    <div><span className="text-white/50" style={{ fontSize: "0.75rem" }}>{label}</span><p className="text-white" style={{ fontSize: "0.875rem" }}>{val}</p></div>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-emerald-400" style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
                  🤖 AI Super Broker sẽ phân tích nhu cầu và gửi danh sách căn hộ phù hợp nhất qua email trong vòng 5 phút.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <button onClick={() => step > 1 ? setStep((s) => (s - 1) as 1 | 2 | 3) : onBack()}
          className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
          style={{ fontSize: "0.875rem" }}>
          <ChevronLeft size={16} />{step > 1 ? "Quay lại" : "Chọn lại"}
        </button>
        <button onClick={handleNext}
          className={`flex items-center gap-2 px-7 py-3 rounded-full font-semibold transition-all shadow-lg shadow-emerald-500/20 ${
            canNext() ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90" : "bg-white/10 text-white/40 cursor-not-allowed"
          }`}
          style={{ fontSize: "0.9rem" }}>
          {step === 3 ? "Hoàn tất đăng ký" : "Tiếp theo"}<ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
