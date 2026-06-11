import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2, ChevronLeft, ChevronRight, CheckCircle2,
  Shield, AlertTriangle, Mail, ArrowRight,
} from "lucide-react";
import {
  type Section, type LandlordFormData,
  initialFormData,
} from "@features/landlord/components/LandlordRegisterTypes";
import LandlordSection1Identity from "@features/landlord/components/LandlordSection1Identity";
import LandlordSection2Building from "@features/landlord/components/LandlordSection2Building";
import LandlordSection3Legal from "@features/landlord/components/LandlordSection3Legal";
import LandlordSection4Services from "@features/landlord/components/LandlordSection4Services";

// SECTIONS constant lives in LandlordRegisterTypes, re-export needed here
const SECTIONS_LIST = [
  { label: "Xác minh danh tính", icon: Shield },
  { label: "Thông tin tòa nhà", icon: Building2 },
  { label: "Pháp lý & Ngân hàng", icon: Shield },
  { label: "Dịch vụ & Xác nhận", icon: CheckCircle2 },
];

export function LandlordRegister() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>(1);
  const [form, setForm] = useState<LandlordFormData>(initialFormData);
  const [done, setDone] = useState(false);
  const [wardSearch, setWardSearch] = useState("");
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem("nv-theme");
      if (t === "light") document.documentElement.setAttribute("data-theme", "light");
      else document.documentElement.removeAttribute("data-theme");
    } catch {}
  }, []);

  const set = (key: keyof LandlordFormData, val: string) => setForm((f) => ({ ...f, [key]: val }));
  const handleCityChange = (city: string) => {
    setForm((f) => ({ ...f, city, district: "", ward: "" }));
    setWardSearch("");
  };
  const toggleArr = (key: "unitTypes" | "services", val: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }));

  const sec1Errors = useMemo(() => {
    const e: string[] = [];
    if (!form.fullName.trim()) e.push("Họ và tên");
    if (!form.idNumber.trim()) e.push("Số CCCD / CMND");
    if (!form.phone.trim()) e.push("Số điện thoại");
    if (!form.email.trim()) e.push("Email");
    if (form.password.length < 8) e.push(`Mật khẩu cần ≥ 8 ký tự (hiện ${form.password.length})`);
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword)
      e.push("Mật khẩu xác nhận không khớp");
    return e;
  }, [form.fullName, form.idNumber, form.phone, form.email, form.password, form.confirmPassword]);

  const canNext = () => {
    if (section === 1) return sec1Errors.length === 0;
    if (section === 2)
      return !!(form.buildingName && form.buildingType && form.address && form.ward &&
        form.city && form.floors && form.totalUnits);
    if (section === 3) return !!form.propertyDoc;
    return true;
  };

  const handleNext = () => {
    if (!canNext()) { setAttempted(true); return; }
    if (section < 4) { setSection((s) => (s + 1) as Section); setAttempted(false); }
    else {
      try { localStorage.setItem("nv-landlord-user", JSON.stringify({ name: form.fullName, email: form.email, buildingName: form.buildingName, totalUnits: form.totalUnits })); } catch {}
      setDone(true);
    }
  };

  if (done) {
    const tempPass = form.email
      ? btoa(form.email.split("@")[0] + "Mgr25").replace(/[^A-Za-z0-9]/g, "").slice(0, 10)
      : "MgrNv2025A";
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: "var(--nv-bg)" }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-violet-500/30">
              <CheckCircle2 size={40} className="text-white" />
            </div>
            <h2 className="text-white mb-2" style={{ fontSize: "1.8rem", fontWeight: 800 }}>Hồ sơ đã gửi!</h2>
            <p className="text-white/55" style={{ fontSize: "0.92rem", lineHeight: 1.7 }}>
              Đội xác minh sẽ kiểm tra và kích hoạt tài khoản trong{" "}
              <strong className="text-violet-400">1–2 ngày làm việc</strong> qua email{" "}
              <strong className="text-white">{form.email}</strong>
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 p-5 mb-5" style={{ background: "rgba(15,24,41,0.8)" }}>
            <p className="text-white font-semibold mb-4" style={{ fontSize: "0.85rem" }}>Quy trình xác minh</p>
            <div className="space-y-3">
              {[
                { label: "Xác minh CCCD/CMND", done: true },
                { label: "Kiểm tra giấy tờ sở hữu tài sản", done: true },
                { label: "Kích hoạt tài khoản quản lý", done: false },
                { label: "Gửi thông tin đăng nhập qua email", done: false },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-violet-500/20" : "bg-white/5 border border-white/10"}`}>
                    {s.done ? <CheckCircle2 size={13} className="text-violet-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                  </div>
                  <span className={s.done ? "text-white/80" : "text-white/35"} style={{ fontSize: "0.82rem" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden mb-6" style={{ background: "rgba(15,24,41,0.9)" }}>
            <div className="px-5 py-3.5 border-b border-white/8 flex items-center gap-3" style={{ background: "rgba(139,92,246,0.06)" }}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Mail size={15} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold" style={{ fontSize: "0.82rem" }}>NestaVietAI · noreply@nestaviet.vn</p>
                <p className="text-white/40" style={{ fontSize: "0.7rem" }}>Gửi đến: {form.email} (sau khi xác minh)</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-white font-bold mb-3" style={{ fontSize: "0.88rem" }}>Tài khoản quản lý đã được kích hoạt</p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                  <span className="text-white/50" style={{ fontSize: "0.78rem" }}>Email đăng nhập</span>
                  <span className="text-violet-400 font-mono font-semibold" style={{ fontSize: "0.78rem" }}>{form.email}</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                  <span className="text-white/50" style={{ fontSize: "0.78rem" }}>Mật khẩu tạm thời</span>
                  <span className="text-violet-300 font-mono font-bold" style={{ fontSize: "0.82rem" }}>{tempPass}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => navigate("/landlord/login")}
              className="flex items-center gap-2 justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
              style={{ fontSize: "0.9rem" }}>
              Đến trang đăng nhập <ArrowRight size={17} />
            </button>
            <button onClick={() => navigate("/")} className="text-white/35 hover:text-white/60 transition-colors text-center" style={{ fontSize: "0.82rem" }}>
              Về trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "var(--nv-bg)" }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(139,92,246,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
            <Building2 size={15} className="text-white" />
          </div>
          <span style={{ fontSize: "1rem", fontWeight: 800 }}>
            NestaViet<span className="text-violet-400">AI</span>
            <span className="text-white/40 font-normal ml-2" style={{ fontSize: "0.8rem" }}>· Cổng Chủ Nhà</span>
          </span>
        </button>
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-white/40 hover:text-white/60 transition-colors" style={{ fontSize: "0.875rem" }}>
          <ChevronLeft size={16} />Trang chủ
        </button>
      </header>

      <div className="relative z-10 bg-amber-500/10 border-b border-amber-500/20 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
          <p className="text-amber-400/90" style={{ fontSize: "0.78rem" }}>
            Khu vực dành riêng cho chủ nhà. Mọi thông tin được mã hóa và bảo mật theo tiêu chuẩn SSL/TLS. Hồ sơ sẽ được xác minh thủ công trước khi kích hoạt.
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-3">
            <Shield size={13} className="text-violet-400" />
            <span className="text-violet-400" style={{ fontSize: "0.72rem", fontWeight: 700 }}>ĐĂNG KÝ CỔNG CHỦ NHÀ</span>
          </div>
          <h1 className="text-white mb-2" style={{ fontSize: "1.8rem", fontWeight: 800 }}>Đăng ký Cổng Chủ Nhà</h1>
          <p className="text-white/50" style={{ fontSize: "0.9rem" }}>
            Quản lý toàn bộ tòa nhà, hợp đồng và dòng tiền trong một nền tảng thống nhất
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-10">
          {SECTIONS_LIST.map(({ label, icon: Icon }, i) => {
            const n = (i + 1) as Section;
            const active = section === n;
            const completed = section > n;
            return (
              <div key={n} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                active ? "bg-violet-500/15 border-violet-500/40" : completed ? "bg-white/5 border-emerald-500/30" : "bg-white/3 border-white/8"
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${completed ? "bg-emerald-500" : active ? "bg-violet-500" : "bg-white/10"}`}>
                  {completed ? <CheckCircle2 size={14} className="text-white" /> : <Icon size={13} className={active ? "text-white" : "text-white/40"} />}
                </div>
                <span className={active ? "text-violet-300" : completed ? "text-emerald-400" : "text-white/30"}
                  style={{ fontSize: "0.62rem", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={section} initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} transition={{ duration: 0.22 }}>
            {section === 1 && (
              <LandlordSection1Identity form={form} set={set} attempted={attempted} errors={sec1Errors} />
            )}
            {section === 2 && (
              <LandlordSection2Building
                form={form} set={set} toggleArr={toggleArr}
                onCityChange={handleCityChange}
                wardSearch={wardSearch} setWardSearch={setWardSearch}
              />
            )}
            {section === 3 && (
              <LandlordSection3Legal form={form} set={set} />
            )}
            {section === 4 && (
              <LandlordSection4Services form={form} toggleArr={toggleArr} />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => section > 1 ? setSection((s) => (s - 1) as Section) : navigate("/")}
            className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
            style={{ fontSize: "0.875rem" }}>
            <ChevronLeft size={16} />{section > 1 ? "Quay lại" : "Trang chủ"}
          </button>
          <div className="flex items-center gap-2 text-white/30" style={{ fontSize: "0.75rem" }}>{section}/4</div>
          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-7 py-3 rounded-full font-semibold transition-all shadow-lg shadow-violet-500/20 ${
              canNext()
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90"
                : "bg-gradient-to-r from-violet-500/40 to-purple-600/40 text-white/60 cursor-not-allowed"
            }`}
            style={{ fontSize: "0.9rem" }}>
            {section === 4 ? "Gửi hồ sơ đăng ký" : "Tiếp theo"}<ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
