import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2, ChevronLeft, ChevronRight, CheckCircle2,
  Shield, AlertTriangle, User, Phone, Mail, Lock,
  CreditCard, FileText, Upload, MapPin, Eye, EyeOff,
  ArrowRight, Info, Home, Hash, Search, AlertCircle,
} from "lucide-react";
import { getProvinceNames, getAllWardsInProvince } from "../../data/vietnam-admin";

const ALL_PROVINCES = getProvinceNames();

function capitalizeWords(str: string) {
  return str.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
}
function digitsOnly(str: string, max?: number) {
  const d = str.replace(/\D/g, "");
  return max ? d.slice(0, max) : d;
}
function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}
const BUILDING_TYPES = ["Chung cư mini", "Chung cư căn hộ", "Tòa nhà văn phòng cho thuê", "Nhà phố / biệt thự", "Khu đô thị"];
const UNIT_TYPES = ["Studio", "1 phòng ngủ", "2 phòng ngủ", "3 phòng ngủ", "4+ phòng ngủ", "Duplex / Penthouse"];
const BANKS = ["Vietcombank", "BIDV", "Agribank", "Techcombank", "VPBank", "MB Bank", "ACB", "Sacombank", "TPBank", "OCB"];
const SERVICES = ["Hợp đồng điện tử", "Thu tiền online", "Báo cáo tài chính", "Quản lý bảo trì", "Gửi thông báo tự động", "Tích hợp camera"];

type Section = 1 | 2 | 3 | 4;

interface FormData {
  // Identity
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Building
  buildingName: string;
  buildingType: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  floors: string;
  totalUnits: string;
  unitTypes: string[];
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  // Legal
  businessLicense: string;
  propertyDoc: string;
  // Bank
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  // Services
  services: string[];
}

const initial: FormData = {
  fullName: "", idNumber: "", phone: "", email: "", password: "", confirmPassword: "",
  buildingName: "", buildingType: "", address: "", ward: "", district: "", city: "TP.HCM",
  floors: "", totalUnits: "", unitTypes: [], priceMin: "", priceMax: "", areaMin: "", areaMax: "",
  businessLicense: "", propertyDoc: "",
  bankName: "", accountNumber: "", accountHolder: "",
  services: [],
};

const SECTIONS = [
  { label: "Xác minh danh tính", icon: Shield },
  { label: "Thông tin tòa nhà", icon: Building2 },
  { label: "Pháp lý & Ngân hàng", icon: FileText },
  { label: "Dịch vụ & Xác nhận", icon: CheckCircle2 },
];

export function LandlordRegister() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>(1);

  useEffect(() => {
    try {
      const t = localStorage.getItem("nv-theme");
      if (t === "light") document.documentElement.setAttribute("data-theme", "light");
      else document.documentElement.removeAttribute("data-theme");
    } catch {}
  }, []);
  const [form, setForm] = useState<FormData>(initial);
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);

  const [wardSearch, setWardSearch] = useState("");
  const [attempted, setAttempted] = useState(false);

  const set = (key: keyof FormData, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleCityChange = (city: string) => {
    setForm((f) => ({ ...f, city, district: "", ward: "" }));
    setWardSearch("");
  };

  const allWards = useMemo(() => getAllWardsInProvince(form.city), [form.city]);
  const filteredWards = useMemo(
    () => wardSearch.trim() ? allWards.filter((w) => w.name.toLowerCase().includes(wardSearch.toLowerCase())) : allWards,
    [allWards, wardSearch]
  );

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

  const toggleArr = (key: "unitTypes" | "services", val: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }));

  const canNext = () => {
    if (section === 1) return sec1Errors.length === 0;
    if (section === 2)
      return form.buildingName && form.buildingType && form.address && form.ward &&
        form.city && form.floors && form.totalUnits;
    if (section === 3) return form.propertyDoc;
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

          {/* Verification steps */}
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

          {/* Mock email preview */}
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
              Đến trang đăng nhập
              <ArrowRight size={17} />
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
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
            <Building2 size={15} className="text-white" />
          </div>
          <span style={{ fontSize: "1rem", fontWeight: 800 }}>
            NestaViet<span className="text-violet-400">AI</span>
            <span className="text-white/40 font-normal ml-2" style={{ fontSize: "0.8rem" }}>
              · Portal Quản Lý
            </span>
          </span>
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/60 transition-colors"
          style={{ fontSize: "0.875rem" }}
        >
          <ChevronLeft size={16} />
          Trang chủ
        </button>
      </header>

      {/* Security notice */}
      <div className="relative z-10 bg-amber-500/10 border-b border-amber-500/20 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
          <p className="text-amber-400/90" style={{ fontSize: "0.78rem" }}>
            Khu vực dành riêng cho chủ nhà và quản lý tòa nhà. Mọi thông tin được mã hóa và bảo mật theo tiêu chuẩn SSL/TLS. Hồ sơ sẽ được xác minh thủ công trước khi kích hoạt.
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-3">
            <Shield size={13} className="text-violet-400" />
            <span className="text-violet-400" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
              ĐĂNG KÝ QUẢN LÝ CHUNG CƯ
            </span>
          </div>
          <h1 className="text-white mb-2" style={{ fontSize: "1.8rem", fontWeight: 800 }}>
            Đăng ký Portal Quản Lý
          </h1>
          <p className="text-white/50" style={{ fontSize: "0.9rem" }}>
            Quản lý toàn bộ tòa nhà, hợp đồng và dòng tiền trong một nền tảng thống nhất
          </p>
        </div>

        {/* Section tabs */}
        <div className="grid grid-cols-4 gap-2 mb-10">
          {SECTIONS.map(({ label, icon: Icon }, i) => {
            const n = (i + 1) as Section;
            const active = section === n;
            const completed = section > n;
            return (
              <div
                key={n}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                  active
                    ? "bg-violet-500/15 border-violet-500/40"
                    : completed
                    ? "bg-white/5 border-emerald-500/30"
                    : "bg-white/3 border-white/8"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    completed ? "bg-emerald-500" : active ? "bg-violet-500" : "bg-white/10"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 size={14} className="text-white" />
                  ) : (
                    <Icon size={13} className={active ? "text-white" : "text-white/40"} />
                  )}
                </div>
                <span
                  className={active ? "text-violet-300" : completed ? "text-emerald-400" : "text-white/30"}
                  style={{ fontSize: "0.62rem", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Section content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {/* ── Section 1: Identity ── */}
            {section === 1 && (
              <div className="space-y-5">
                <SectionTitle>Thông tin chủ sở hữu / người đại diện</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Họ và tên *" icon={User}>
                    <input type="text" placeholder="Nguyễn Văn An" value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      onBlur={(e) => set("fullName", capitalizeWords(e.target.value))}
                      autoComplete="name"
                      className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Số CCCD / CMND *" icon={Hash}>
                    <input type="text" inputMode="numeric" placeholder="079xxxxxxxxx" value={form.idNumber}
                      onChange={(e) => set("idNumber", digitsOnly(e.target.value, 12))}
                      className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Số điện thoại *" icon={Phone}>
                    <input type="tel" inputMode="numeric" placeholder="0901 234 567" value={form.phone}
                      onChange={(e) => set("phone", formatPhone(e.target.value))}
                      autoComplete="tel"
                      className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Email *" icon={Mail}>
                    <input type="email" placeholder="email@example.com" value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className={inputCls} style={inputStyle} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Mật khẩu * (tối thiểu 8 ký tự)" icon={Lock}>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} placeholder="Mật khẩu mạnh..."
                        value={form.password} onChange={(e) => set("password", e.target.value)}
                        className={inputCls + " pr-9"} style={inputStyle} />
                      <button type="button" onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </Field>
                  <Field label="Xác nhận mật khẩu *" icon={Lock}>
                    <input type={showPass ? "text" : "password"} placeholder="Nhập lại mật khẩu"
                      value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)}
                      className={`${inputCls} ${form.confirmPassword && form.confirmPassword !== form.password ? "border-red-500/60" : ""}`}
                      style={inputStyle} />
                  </Field>
                </div>
                <InfoBox>
                  Thông tin xác minh danh tính được sử dụng để tuân thủ quy định pháp luật về cho thuê bất động sản và ngăn chặn gian lận.
                </InfoBox>
                {attempted && sec1Errors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3"
                  >
                    <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-semibold mb-1" style={{ fontSize: "0.8rem" }}>Cần bổ sung:</p>
                      <ul className="space-y-0.5">
                        {sec1Errors.map((e) => (
                          <li key={e} className="text-red-400/80" style={{ fontSize: "0.75rem" }}>• {e}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* ── Section 2: Building ── */}
            {section === 2 && (
              <div className="space-y-5">
                <SectionTitle>Thông tin tòa nhà / chung cư</SectionTitle>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Tên tòa nhà *" icon={Building2}>
                    <input type="text" placeholder="VD: Vinhomes Central Park" value={form.buildingName}
                      onChange={(e) => set("buildingName", e.target.value)}
                      className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Loại hình *" icon={Home}>
                    <select value={form.buildingType} onChange={(e) => set("buildingType", e.target.value)}
                      className={inputCls + " cursor-pointer"} style={{ ...inputStyle, colorScheme: "dark" }}>
                      <option value="" disabled>Chọn loại...</option>
                      {BUILDING_TYPES.map((t) => <option key={t} value={t} className="bg-[#0A0F1E]">{t}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Địa chỉ đầy đủ *" icon={MapPin}>
                  <input type="text" placeholder="Số nhà, tên đường" value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    className={inputCls} style={inputStyle} />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Tỉnh / Thành phố *" icon={MapPin}>
                    <select value={form.city} onChange={(e) => handleCityChange(e.target.value)}
                      className={inputCls + " cursor-pointer appearance-none"} style={{ ...inputStyle, colorScheme: "dark" }}>
                      {ALL_PROVINCES.map((p) => <option key={p} value={p} className="bg-[#0A0F1E]">{p}</option>)}
                    </select>
                  </Field>
                  <Field label="Phường / Xã *" icon={MapPin}>
                    <div>
                      <div className="relative">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                        <input
                          type="text"
                          placeholder="Tìm phường/xã..."
                          value={wardSearch}
                          onChange={(e) => setWardSearch(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 rounded-t-xl py-2.5 pl-8 pr-3 text-white placeholder-white/25 outline-none focus:border-violet-500/50 transition-colors"
                          style={{ fontSize: "0.82rem" }}
                        />
                      </div>
                      <div className="border border-t-0 border-white/15 rounded-b-xl overflow-hidden" style={{ maxHeight: "9rem", overflowY: "auto" }}>
                        {filteredWards.length === 0 ? (
                          <p className="px-3 py-2 text-white/30" style={{ fontSize: "0.78rem" }}>
                            {wardSearch ? "Không tìm thấy" : "Chọn tỉnh/thành phố trước"}
                          </p>
                        ) : (
                          filteredWards.map((w) => (
                            <button
                              key={w.name}
                              type="button"
                              onClick={() => set("ward", w.name)}
                              className={`w-full text-left px-3 py-2 transition-colors border-b border-white/5 last:border-0 ${
                                form.ward === w.name
                                  ? "bg-violet-500/25 text-violet-300"
                                  : "text-white/65 hover:bg-white/8"
                              }`}
                              style={{ fontSize: "0.82rem" }}
                            >
                              {form.ward === w.name && <span className="mr-1.5">✓</span>}{w.name}
                            </button>
                          ))
                        )}
                      </div>
                      {form.ward && (
                        <p className="mt-1 text-violet-400" style={{ fontSize: "0.72rem" }}>Đã chọn: {form.ward}</p>
                      )}
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Số tầng *" icon={Building2}>
                    <input type="number" placeholder="20" value={form.floors}
                      onChange={(e) => set("floors", digitsOnly(e.target.value))}
                      className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Tổng số căn hộ *" icon={Hash}>
                    <input type="number" placeholder="120" value={form.totalUnits}
                      onChange={(e) => set("totalUnits", digitsOnly(e.target.value))}
                      className={inputCls} style={inputStyle} />
                  </Field>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Field label="Diện tích từ (m²)" icon={Home}>
                    <input type="number" placeholder="30" value={form.areaMin}
                      onChange={(e) => set("areaMin", e.target.value)}
                      className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Diện tích đến (m²)" icon={Home}>
                    <input type="number" placeholder="150" value={form.areaMax}
                      onChange={(e) => set("areaMax", e.target.value)}
                      className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Giá từ (triệu/tháng)" icon={CreditCard}>
                    <input type="number" placeholder="5" value={form.priceMin}
                      onChange={(e) => set("priceMin", e.target.value)}
                      className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Giá đến (triệu/tháng)" icon={CreditCard}>
                    <input type="number" placeholder="30" value={form.priceMax}
                      onChange={(e) => set("priceMax", e.target.value)}
                      className={inputCls} style={inputStyle} />
                  </Field>
                </div>

                <div>
                  <label className="block text-white/70 mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Loại căn hộ cung cấp
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {UNIT_TYPES.map((u) => (
                      <button key={u} onClick={() => toggleArr("unitTypes", u)}
                        className={`px-3 py-1.5 rounded-full border transition-all ${
                          form.unitTypes.includes(u)
                            ? "bg-violet-500/20 border-violet-500 text-violet-400"
                            : "bg-white/5 border-white/15 text-white/50 hover:border-white/30"
                        }`}
                        style={{ fontSize: "0.8rem" }}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Section 3: Legal & Bank ── */}
            {section === 3 && (
              <div className="space-y-6">
                <SectionTitle>Hồ sơ pháp lý</SectionTitle>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Số giấy phép kinh doanh" icon={FileText}>
                    <input type="text" placeholder="0316xxxxxxx (nếu có)" value={form.businessLicense}
                      onChange={(e) => set("businessLicense", e.target.value)}
                      className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Số sổ đỏ / giấy chứng nhận *" icon={FileText}>
                    <input type="text" placeholder="Số giấy tờ sở hữu" value={form.propertyDoc}
                      onChange={(e) => set("propertyDoc", e.target.value)}
                      className={inputCls} style={inputStyle} />
                  </Field>
                </div>

                {/* Upload areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Ảnh CCCD / CMND (2 mặt)",
                    "Giấy tờ sở hữu / sổ đỏ",
                    "Ảnh tòa nhà (tối thiểu 5 ảnh)",
                    "Giấy phép kinh doanh (nếu có)",
                  ].map((label) => (
                    <label key={label} className="border border-dashed border-white/20 rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-violet-500/40 transition-colors group">
                      <Upload size={20} className="text-white/30 group-hover:text-violet-400 transition-colors" />
                      <p className="text-white/50 text-center group-hover:text-white/70 transition-colors" style={{ fontSize: "0.78rem" }}>
                        {label}
                      </p>
                      <span className="text-white/30" style={{ fontSize: "0.68rem" }}>
                        PDF, JPG, PNG — tối đa 10MB
                      </span>
                      <input type="file" className="hidden" accept="image/*,.pdf" multiple />
                    </label>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-5">
                  <SectionTitle>Thông tin ngân hàng</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Field label="Ngân hàng" icon={CreditCard}>
                      <select value={form.bankName} onChange={(e) => set("bankName", e.target.value)}
                        className={inputCls + " cursor-pointer"} style={{ ...inputStyle, colorScheme: "dark" }}>
                        <option value="" disabled>Chọn ngân hàng...</option>
                        {BANKS.map((b) => <option key={b} value={b} className="bg-[#0A0F1E]">{b}</option>)}
                      </select>
                    </Field>
                    <Field label="Số tài khoản" icon={Hash}>
                      <input type="text" placeholder="19034xxxxxxxxx" value={form.accountNumber}
                        onChange={(e) => set("accountNumber", e.target.value)}
                        className={inputCls} style={inputStyle} />
                    </Field>
                    <Field label="Tên chủ tài khoản" icon={User}>
                      <input type="text" placeholder="NGUYEN VAN A" value={form.accountHolder}
                        onChange={(e) => set("accountHolder", e.target.value)}
                        className={inputCls + " uppercase"} style={inputStyle} />
                    </Field>
                  </div>
                </div>

                <InfoBox>
                  Thông tin ngân hàng được sử dụng để nhận thanh toán tiền thuê tự động qua hệ thống NestaVietAI. Chúng tôi không lưu trữ thông tin tài khoản trực tiếp — mọi giao dịch thông qua cổng thanh toán được chứng nhận PCI-DSS.
                </InfoBox>
              </div>
            )}

            {/* ── Section 4: Services & Confirm ── */}
            {section === 4 && (
              <div className="space-y-6">
                <SectionTitle>Dịch vụ muốn sử dụng</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map((s) => (
                    <button key={s} onClick={() => toggleArr("services", s)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                        form.services.includes(s)
                          ? "bg-violet-500/15 border-violet-500/50 text-violet-300"
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/25"
                      }`}
                      style={{ fontSize: "0.875rem" }}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${
                        form.services.includes(s) ? "bg-violet-500 border-violet-500" : "border-white/30"
                      }`}>
                        {form.services.includes(s) && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                      {s}
                    </button>
                  ))}
                </div>

                {/* Summary */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-white font-semibold mb-4" style={{ fontSize: "0.95rem" }}>
                    Xác nhận thông tin đăng ký
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Chủ sở hữu", form.fullName],
                      ["Email", form.email],
                      ["Tòa nhà", form.buildingName],
                      ["Địa điểm", form.district + ", " + form.city],
                      ["Số tầng", form.floors + " tầng"],
                      ["Tổng căn hộ", form.totalUnits + " căn"],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <p className="text-white/40" style={{ fontSize: "0.72rem" }}>{label}</p>
                        <p className="text-white" style={{ fontSize: "0.85rem" }}>{val || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                  <p className="text-white/70" style={{ fontSize: "0.82rem", lineHeight: 1.7 }}>
                    Bằng cách gửi đăng ký, bạn xác nhận tất cả thông tin là chính xác và đồng ý với{" "}
                    <button className="text-violet-400 underline">Điều khoản Quản lý</button>,{" "}
                    <button className="text-violet-400 underline">Chính sách Bảo mật</button> và{" "}
                    <button className="text-violet-400 underline">Thỏa thuận Dịch vụ</button> của NestaVietAI.
                    Hồ sơ sẽ được đội ngũ xác minh trong 1–2 ngày làm việc.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => section > 1 ? setSection((s) => (s - 1) as Section) : navigate("/")}
            className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
            style={{ fontSize: "0.875rem" }}
          >
            <ChevronLeft size={16} />
            {section > 1 ? "Quay lại" : "Trang chủ"}
          </button>

          <div className="flex items-center gap-2 text-white/30" style={{ fontSize: "0.75rem" }}>
            {section}/4
          </div>

          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-7 py-3 rounded-full font-semibold transition-all shadow-lg shadow-violet-500/20 ${
              canNext()
                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90"
                : "bg-gradient-to-r from-violet-500/40 to-purple-600/40 text-white/60 cursor-not-allowed"
            }`}
            style={{ fontSize: "0.9rem" }}
          >
            {section === 4 ? "Gửi hồ sơ đăng ký" : "Tiếp theo"}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────
const inputCls =
  "w-full bg-white/5 border border-white/15 rounded-xl py-2.5 pl-9 pr-4 text-white placeholder-white/25 outline-none focus:border-violet-500/50 transition-colors";
const inputStyle = { fontSize: "0.875rem" };

function Field({ label, icon: Icon, children }: { label: string; icon: React.ComponentType<{size?: number; className?: string}>; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
        {label}
      </label>
      <div className="relative">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 z-10" />
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-white font-semibold flex items-center gap-2" style={{ fontSize: "1rem" }}>
      {children}
    </p>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
      <Info size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
      <p className="text-blue-300/80" style={{ fontSize: "0.8rem", lineHeight: 1.65 }}>
        {children}
      </p>
    </div>
  );
}
