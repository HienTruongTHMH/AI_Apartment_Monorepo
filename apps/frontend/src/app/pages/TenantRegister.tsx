import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2, ChevronLeft, ChevronRight, CheckCircle2,
  MapPin, Home, Calendar, User, Phone, Mail, Lock,
  BedDouble, DollarSign, ArrowRight, Eye, EyeOff, Search,
  AlertCircle, Bot, Sparkles, Hash, Star,
} from "lucide-react";
import { getProvinceNames, getAllWardsInProvince } from "../../data/vietnam-admin";

// ─── Data ─────────────────────────────────────────────────────────────────────
const ROOM_TYPES = ["Studio", "1 phòng ngủ", "2 phòng ngủ", "3 phòng ngủ", "4+ phòng ngủ"];
const AMENITIES = ["Hồ bơi", "Gym", "Bãi xe", "An ninh 24/7", "Thú cưng", "Nội thất", "Wifi", "Hồ bơi trẻ em"];
const PRICE_MARKS = [3, 5, 8, 12, 18, 25, 35, 50];
const ALL_PROVINCES = getProvinceNames();

const BUILDINGS = [
  // ── TP. Hồ Chí Minh ─────────────────────────────────────────────────────────
  {
    id: "B01", name: "Sunrise City North", city: "Hồ Chí Minh", district: "Quận 7",
    address: "117 Nguyễn Hữu Thọ, Quận 7, TP.HCM", rating: 4.8,
    units: ["1201", "1204", "1305", "1402", "1501", "1605", "1708", "1901"],
    price: "10–15M/tháng", img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=200",
  },
  {
    id: "B02", name: "Vinhomes Grand Park", city: "Hồ Chí Minh", district: "TP. Thủ Đức",
    address: "Nguyễn Xiển, Long Bình, TP. Thủ Đức", rating: 4.7,
    units: ["A101", "A205", "B301", "B402", "C205", "C310", "D501"],
    price: "8–14M/tháng", img: "https://images.unsplash.com/photo-1585128792103-0b591f96512e?w=200",
  },
  {
    id: "B03", name: "The River Thủ Thiêm", city: "Hồ Chí Minh", district: "TP. Thủ Đức",
    address: "Đảo Thủ Thiêm, TP. Thủ Đức, TP.HCM", rating: 4.9,
    units: ["01A", "03B", "05C", "07A", "09B", "11C"],
    price: "14–22M/tháng", img: "https://images.unsplash.com/photo-1763401929055-43fd29000be3?w=200",
  },
  {
    id: "B04", name: "Masteri Centre Point", city: "Hồ Chí Minh", district: "TP. Thủ Đức",
    address: "36 Nguyễn Xiển, TP. Thủ Đức", rating: 4.6,
    units: ["T01-01", "T01-05", "T02-08", "T03-12", "T04-03"],
    price: "9–13M/tháng", img: "https://images.unsplash.com/photo-1774716925810-e923c8206ed5?w=200",
  },
  {
    id: "B05", name: "Sunwah Pearl", city: "Hồ Chí Minh", district: "Bình Thạnh",
    address: "90 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM", rating: 4.8,
    units: ["P01-10", "P02-15", "P03-08", "P04-22", "P05-06"],
    price: "13–25M/tháng", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200",
  },
  {
    id: "B06", name: "Botanica Premier", city: "Hồ Chí Minh", district: "Tân Bình",
    address: "Phổ Quang, Tân Bình, TP.HCM", rating: 4.5,
    units: ["S01", "S02", "S05", "S08", "S12", "S15", "S18"],
    price: "8–12M/tháng", img: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=200",
  },
  // ── Hà Nội ──────────────────────────────────────────────────────────────────
  {
    id: "B07", name: "Vinhomes Smart City", city: "Hà Nội", district: "Nam Từ Liêm",
    address: "Tây Mỗ, Nam Từ Liêm, Hà Nội", rating: 4.8,
    units: ["SA1-01", "SA1-05", "SB2-08", "SB3-12", "SC1-03", "SC2-07"],
    price: "12–20M/tháng", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200",
  },
  {
    id: "B08", name: "Masteri West Heights", city: "Hà Nội", district: "Nam Từ Liêm",
    address: "Đại lộ Thăng Long, Nam Từ Liêm, Hà Nội", rating: 4.7,
    units: ["W1-101", "W1-205", "W2-310", "W3-402", "W3-508"],
    price: "14–22M/tháng", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=200",
  },
  {
    id: "B09", name: "The Zei", city: "Hà Nội", district: "Nam Từ Liêm",
    address: "8 Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm, Hà Nội", rating: 4.6,
    units: ["Z01-05", "Z02-08", "Z03-11", "Z04-14", "Z05-03"],
    price: "11–18M/tháng", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200",
  },
  // ── Đà Nẵng ─────────────────────────────────────────────────────────────────
  {
    id: "B10", name: "Monarchy Da Nang", city: "Đà Nẵng", district: "Sơn Trà",
    address: "Bạch Đằng, Sơn Trà, Đà Nẵng", rating: 4.7,
    units: ["A-01", "A-05", "B-08", "B-12", "C-03", "C-09"],
    price: "9–16M/tháng", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200",
  },
  {
    id: "B11", name: "Ariyana Smart Condotel", city: "Đà Nẵng", district: "Ngũ Hành Sơn",
    address: "Trường Sa, Ngũ Hành Sơn, Đà Nẵng", rating: 4.5,
    units: ["AR-101", "AR-205", "AR-308", "AR-412", "AR-506"],
    price: "8–14M/tháng", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200",
  },
];

const CITIES = ["Tất cả", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng"];
const DISTRICTS_BY_CITY: Record<string, string[]> = {
  "Hồ Chí Minh": ["Tất cả", "TP. Thủ Đức", "Quận 7", "Bình Thạnh", "Tân Bình"],
  "Hà Nội":       ["Tất cả", "Nam Từ Liêm", "Hoàng Mai", "Cầu Giấy", "Đống Đa"],
  "Đà Nẵng":      ["Tất cả", "Sơn Trà", "Ngũ Hành Sơn", "Hải Châu", "Liên Chiểu"],
};
const DISTRICTS = ["Tất cả", "TP. Thủ Đức", "Quận 7", "Bình Thạnh", "Tân Bình"];

type RegistrationMode = "none" | "ai" | "building";

function capitalizeWords(str: string) {
  return str.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
}
function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

// ─── Shared personal info step ────────────────────────────────────────────────
interface PersonalInfo {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function PersonalInfoStep({
  info, onChange, attempted,
}: {
  info: PersonalInfo;
  onChange: (updates: Partial<PersonalInfo>) => void;
  attempted: boolean;
}) {
  const [showPass, setShowPass] = useState(false);

  const errors = useMemo(() => {
    const e: string[] = [];
    if (!info.fullName.trim()) e.push("Họ và tên không được để trống");
    if (!info.phone.trim()) e.push("Số điện thoại không được để trống");
    if (!info.email.trim()) e.push("Email không được để trống");
    if (info.password.length < 6) e.push(`Mật khẩu cần ít nhất 6 ký tự`);
    if (info.password && info.confirmPassword && info.password !== info.confirmPassword)
      e.push("Mật khẩu xác nhận không khớp");
    return e;
  }, [info]);

  const fields = [
    { key: "fullName" as const, label: "Họ và tên", icon: User, type: "text", placeholder: "Nguyễn Văn An", autoComplete: "name", capitalize: true },
    { key: "phone" as const, label: "Số điện thoại", icon: Phone, type: "tel", placeholder: "0901 234 567", autoComplete: "tel" },
    { key: "email" as const, label: "Email", icon: Mail, type: "email", placeholder: "email@example.com", autoComplete: "email" },
  ];

  return (
    <div className="space-y-4">
      {fields.map(({ key, label, icon: Icon, type, placeholder, autoComplete, capitalize }) => (
        <div key={key}>
          <label className="block text-white/70 mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {label} <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type={type}
              inputMode={type === "tel" ? "numeric" : undefined}
              placeholder={placeholder}
              value={info[key]}
              onChange={(e) => onChange({ [key]: key === "phone" ? formatPhone(e.target.value) : e.target.value })}
              onBlur={capitalize ? (e) => onChange({ [key]: capitalizeWords(e.target.value) }) : undefined}
              className="w-full bg-white/5 border border-white/15 rounded-xl py-3 pl-9 pr-4 text-white placeholder-white/25 outline-none focus:border-cyan-500/50 transition-colors"
              style={{ fontSize: "0.875rem" }}
              autoComplete={autoComplete}
            />
          </div>
        </div>
      ))}

      {/* Password */}
      {(["password", "confirmPassword"] as const).map((key) => (
        <div key={key}>
          <label className="block text-white/70 mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {key === "password" ? "Mật khẩu" : "Xác nhận mật khẩu"} <span className="text-red-400">*</span>
            {key === "password" && <span className="text-white/35 font-normal ml-1">(tối thiểu 6 ký tự)</span>}
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type={showPass ? "text" : "password"}
              placeholder={key === "password" ? "••••••" : "Nhập lại mật khẩu"}
              value={info[key]}
              onChange={(e) => onChange({ [key]: e.target.value })}
              className={`w-full bg-white/5 border rounded-xl py-3 pl-9 pr-10 text-white placeholder-white/25 outline-none transition-colors ${
                key === "confirmPassword" && info.confirmPassword && info.confirmPassword !== info.password
                  ? "border-red-500/60"
                  : "border-white/15 focus:border-cyan-500/50"
              }`}
              style={{ fontSize: "0.875rem" }}
            />
            {key === "password" && (
              <button type="button" onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            )}
          </div>
          {key === "password" && info.password.length > 0 && info.password.length < 6 && (
            <p className="mt-1 text-amber-400" style={{ fontSize: "0.72rem" }}>Còn {6 - info.password.length} ký tự nữa</p>
          )}
          {key === "confirmPassword" && info.confirmPassword && info.confirmPassword !== info.password && (
            <p className="mt-1 text-red-400" style={{ fontSize: "0.72rem" }}>Mật khẩu không khớp</p>
          )}
        </div>
      ))}

      {attempted && errors.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
          <p className="text-red-400 font-semibold mb-1.5 flex items-center gap-1.5" style={{ fontSize: "0.8rem" }}>
            <AlertCircle size={14} />Cần hoàn thiện:
          </p>
          <ul className="space-y-0.5">
            {errors.map((e) => <li key={e} className="text-red-400/80" style={{ fontSize: "0.75rem" }}>• {e}</li>)}
          </ul>
        </motion.div>
      )}

      <p className="text-white/35" style={{ fontSize: "0.75rem", lineHeight: 1.6 }}>
        Bằng cách đăng ký, bạn đồng ý với{" "}
        <button className="text-cyan-400 underline">Điều khoản dịch vụ</button> và{" "}
        <button className="text-cyan-400 underline">Chính sách bảo mật</button>.
      </p>
    </div>
  );
}

function isPersonalInfoValid(info: PersonalInfo) {
  return (
    info.fullName.trim() &&
    info.phone.trim() &&
    info.email.trim() &&
    info.password.length >= 6 &&
    info.password === info.confirmPassword
  );
}

// ─── Done screen ──────────────────────────────────────────────────────────────
function DoneScreen({
  mode, info, building, unit,
}: {
  mode: "ai" | "building";
  info: PersonalInfo;
  building?: typeof BUILDINGS[number];
  unit?: string;
}) {
  const navigate = useNavigate();
  const tempPass = info.email
    ? btoa(info.email.split("@")[0] + "2025").replace(/[^A-Za-z0-9]/g, "").slice(0, 10)
    : "Nv2025Abc!";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: "#030B14" }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-emerald-500/30">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h2 className="text-white mb-2" style={{ fontSize: "1.8rem", fontWeight: 800 }}>Đăng ký thành công!</h2>
          {mode === "building" && building ? (
            <p className="text-white/55" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
              Yêu cầu vào phòng <strong className="text-white">{unit}</strong> tại{" "}
              <strong className="text-white">{building.name}</strong> đã được gửi tới quản lý.
            </p>
          ) : (
            <p className="text-white/55" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
              AI Super Broker sẽ tìm căn hộ phù hợp và gửi về{" "}
              <strong className="text-white">{info.email}</strong> trong vài phút.
            </p>
          )}
        </div>

        {/* Mock email card */}
        <div className="rounded-2xl border border-white/10 overflow-hidden mb-6" style={{ background: "rgba(15,24,41,0.9)" }}>
          <div className="px-5 py-3.5 border-b border-white/8 flex items-center gap-3" style={{ background: "rgba(34,211,238,0.06)" }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Mail size={15} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold" style={{ fontSize: "0.82rem" }}>NestaVietAI · noreply@nestaviet.vn</p>
              <p className="text-white/40" style={{ fontSize: "0.7rem" }}>Gửi đến: {info.email}</p>
            </div>
          </div>
          <div className="p-5">
            <p className="text-white font-bold mb-4" style={{ fontSize: "0.9rem" }}>Chào {info.fullName || "bạn"}, tài khoản đã sẵn sàng!</p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                <span className="text-white/50" style={{ fontSize: "0.78rem" }}>Email đăng nhập</span>
                <span className="text-cyan-400 font-mono font-semibold" style={{ fontSize: "0.78rem" }}>{info.email}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                <span className="text-white/50" style={{ fontSize: "0.78rem" }}>Mật khẩu tạm thời</span>
                <span className="text-emerald-400 font-mono font-bold" style={{ fontSize: "0.82rem" }}>{tempPass}</span>
              </div>
              {mode === "building" && building && (
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                  <span className="text-white/50" style={{ fontSize: "0.78rem" }}>Trạng thái</span>
                  <span className="text-amber-400 font-semibold" style={{ fontSize: "0.78rem" }}>⏳ Chờ quản lý xét duyệt</span>
                </div>
              )}
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-2">
              <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-300" style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
                Bắt buộc đổi mật khẩu tạm thời trong lần đăng nhập đầu tiên.
              </p>
            </div>
          </div>
        </div>

        {mode === "building" && (
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 mb-5 flex items-start gap-3">
            <Bot size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
            <p className="text-violet-300" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
              <strong>AI Agent</strong> đã gửi thông báo tới quản lý tòa nhà. Bạn sẽ nhận được xác nhận trong 1–2 ngày làm việc.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button onClick={() => navigate("/tenant/login")}
            className="flex items-center gap-2 justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ fontSize: "0.9rem" }}>
            Đăng nhập ngay <ArrowRight size={17} />
          </button>
          <button onClick={() => navigate("/")} className="text-white/35 hover:text-white/60 transition-colors text-center" style={{ fontSize: "0.82rem" }}>
            Về trang chủ
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── AI Flow ──────────────────────────────────────────────────────────────────
function AIFlow({ onBack }: { onBack: () => void }) {
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

  if (done) return <DoneScreen mode="ai" info={info} />;

  const stepLabels = ["Nhu cầu tìm nhà", "Thông tin cá nhân", "Hoàn tất"];

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
      {/* Flow header */}
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

      {/* Steps */}
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
              {/* Province */}
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

              {/* Ward */}
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

              {/* Room type */}
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

              {/* Budget */}
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

              {/* Move-in date */}
              <div>
                <label className="block text-white/70 mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Dự kiến dọn vào</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="date" value={needs.moveInDate} onChange={(e) => setNeeds((f) => ({ ...f, moveInDate: e.target.value }))}
                    className="w-full bg-white/5 border border-white/15 rounded-xl py-3 pl-9 pr-4 text-white/80 outline-none focus:border-cyan-500/50 transition-colors"
                    style={{ fontSize: "0.875rem", colorScheme: "dark" }} />
                </div>
              </div>

              {/* Amenities */}
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

      {/* Nav */}
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

// ─── Building Flow ─────────────────────────────────────────────────────────────
function BuildingFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [attempted, setAttempted] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Tất cả");
  const [selectedDistrict, setSelectedDistrict] = useState("Tất cả");
  const [buildingSearch, setBuildingSearch] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<typeof BUILDINGS[number] | null>(null);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [info, setInfo] = useState<PersonalInfo>({ fullName: "", phone: "", email: "", password: "", confirmPassword: "" });

  const districtOptions = selectedCity !== "Tất cả" ? (DISTRICTS_BY_CITY[selectedCity] ?? ["Tất cả"]) : ["Tất cả"];

  const filteredBuildings = BUILDINGS.filter((b) => {
    const matchCity = selectedCity === "Tất cả" || b.city === selectedCity;
    const matchDistrict = selectedDistrict === "Tất cả" || b.district === selectedDistrict;
    const matchSearch = !buildingSearch || b.name.toLowerCase().includes(buildingSearch.toLowerCase()) || b.address.toLowerCase().includes(buildingSearch.toLowerCase());
    return matchCity && matchDistrict && matchSearch;
  });

  const canNext = () => {
    if (step === 1) return !!selectedBuilding && !!selectedUnit;
    if (step === 2) return !!isPersonalInfoValid(info);
    return true;
  };

  const handleNext = () => {
    if (!canNext()) { setAttempted(true); return; }
    if (step < 3) { setStep((s) => (s + 1) as 1 | 2 | 3); setAttempted(false); }
    else {
      // Save tenant user
      try {
        localStorage.setItem("nv-tenant-user", JSON.stringify({
          name: info.fullName, email: info.email,
          unit: selectedUnit, buildingName: selectedBuilding?.name,
          city: selectedBuilding?.city, district: selectedBuilding?.district,
        }));
      } catch {}

      // Write to building-tenants so landlord can see it
      try {
        const existing = JSON.parse(localStorage.getItem("nv-building-tenants") || "[]");
        const newTenant = {
          name: info.fullName, email: info.email, phone: info.phone,
          unit: selectedUnit, buildingName: selectedBuilding?.name,
          registeredAt: new Date().toLocaleDateString("vi-VN"),
          status: "pending",
        };
        localStorage.setItem("nv-building-tenants", JSON.stringify([...existing, newTenant]));
      } catch {}

      setDone(true);
    }
  };

  if (done) return <DoneScreen mode="building" info={info} building={selectedBuilding ?? undefined} unit={selectedUnit} />;

  const stepLabels = ["Chọn tòa nhà & phòng", "Thông tin cá nhân", "Xác nhận"];

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
      {/* Flow header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-white/40 hover:text-white/70 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Building2 size={14} className="text-white" />
          </div>
          <span className="text-white font-bold" style={{ fontSize: "0.95rem" }}>Đăng ký vào tòa nhà</span>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-0 mb-8">
        {stepLabels.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const active = step === n; const completed = step > n;
          return (
            <div key={n} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${completed ? "bg-violet-500" : active ? "bg-gradient-to-br from-violet-500 to-purple-600" : "bg-white/10"}`} style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                  {completed ? <CheckCircle2 size={15} className="text-white" /> : <span className="text-white">{n}</span>}
                </div>
                <span className={`mt-1.5 text-center ${active ? "text-white" : "text-white/40"}`} style={{ fontSize: "0.65rem", fontWeight: active ? 600 : 400, whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px mx-2 mb-5 transition-colors ${completed ? "bg-violet-500/50" : "bg-white/10"}`} />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} transition={{ duration: 0.22 }}>
          {step === 1 && (
            <div className="space-y-5">
              {/* Search */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" placeholder="Tìm tên tòa nhà, địa chỉ..." value={buildingSearch}
                  onChange={(e) => setBuildingSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl py-3 pl-9 pr-4 text-white placeholder-white/25 outline-none focus:border-violet-500/50 transition-colors"
                  style={{ fontSize: "0.875rem" }} />
              </div>

              {/* City tabs */}
              <div className="flex gap-2 flex-wrap">
                {CITIES.map((c) => (
                  <button key={c} onClick={() => { setSelectedCity(c); setSelectedDistrict("Tất cả"); setSelectedBuilding(null); setSelectedUnit(""); }}
                    className={`px-3.5 py-1.5 rounded-full border transition-all font-semibold ${selectedCity === c ? "bg-violet-600/25 border-violet-500 text-violet-300" : "bg-white/5 border-white/12 text-white/45 hover:border-white/28"}`}
                    style={{ fontSize: "0.78rem" }}>
                    {c === "Tất cả" ? "🇻🇳 Tất cả" : c === "Hồ Chí Minh" ? "🏙 TP.HCM" : c === "Hà Nội" ? "🏛 Hà Nội" : "🌊 Đà Nẵng"}
                  </button>
                ))}
              </div>

              {/* District filter (shown when a city is selected) */}
              {selectedCity !== "Tất cả" && (
                <div className="flex gap-2 flex-wrap">
                  {districtOptions.map((d) => (
                    <button key={d} onClick={() => setSelectedDistrict(d)}
                      className={`px-3 py-1 rounded-full border transition-all ${selectedDistrict === d ? "bg-violet-500/15 border-violet-500/60 text-violet-400" : "bg-white/4 border-white/10 text-white/38 hover:border-white/22"}`}
                      style={{ fontSize: "0.73rem" }}>{d}</button>
                  ))}
                </div>
              )}

              {/* Building list */}
              <div className="space-y-3">
                <p className="text-white/50" style={{ fontSize: "0.75rem" }}>{filteredBuildings.length} tòa nhà</p>
                {filteredBuildings.map((building) => (
                  <motion.div key={building.id} whileHover={{ y: -1 }}
                    onClick={() => { setSelectedBuilding(building); setSelectedUnit(""); }}
                    className={`rounded-2xl border transition-all cursor-pointer overflow-hidden ${selectedBuilding?.id === building.id ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                    <div className="flex items-center gap-4 p-4">
                      <img src={building.img} alt={building.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-white font-bold truncate" style={{ fontSize: "0.9rem" }}>{building.name}</p>
                          {selectedBuilding?.id === building.id && <CheckCircle2 size={15} className="text-violet-400 flex-shrink-0" />}
                        </div>
                        <p className="text-white/50 flex items-center gap-1" style={{ fontSize: "0.75rem" }}><MapPin size={11} />{building.address}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-violet-400 font-semibold" style={{ fontSize: "0.78rem" }}>{building.price}</span>
                          <span className="flex items-center gap-0.5 text-amber-400" style={{ fontSize: "0.72rem" }}>
                            <Star size={11} className="fill-amber-400" />{building.rating}
                          </span>
                          <span className="text-white/40" style={{ fontSize: "0.7rem" }}>{building.units.length} phòng trống</span>
                        </div>
                      </div>
                    </div>

                    {/* Unit selection */}
                    <AnimatePresence>
                      {selectedBuilding?.id === building.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="border-t border-violet-500/30 px-4 pb-4 pt-3" style={{ overflow: "hidden" }}>
                          <p className="text-white/60 mb-2.5" style={{ fontSize: "0.78rem", fontWeight: 600 }}>Chọn căn hộ / phòng:</p>
                          <div className="flex flex-wrap gap-2">
                            {building.units.map((unit) => (
                              <button key={unit} onClick={(e) => { e.stopPropagation(); setSelectedUnit(unit); }}
                                className={`px-3 py-1.5 rounded-xl border font-mono transition-all flex items-center gap-1.5 ${selectedUnit === unit ? "bg-violet-500 border-violet-400 text-white" : "bg-white/5 border-white/20 text-white/60 hover:border-violet-400/50 hover:text-white/80"}`}
                                style={{ fontSize: "0.82rem" }}>
                                <Hash size={11} />{unit}
                              </button>
                            ))}
                          </div>
                          {attempted && !selectedUnit && <p className="mt-2 text-red-400" style={{ fontSize: "0.72rem" }}>Vui lòng chọn một căn hộ</p>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
                {filteredBuildings.length === 0 && (
                  <div className="text-center py-10 text-white/30" style={{ fontSize: "0.85rem" }}>Không tìm thấy tòa nhà phù hợp</div>
                )}
              </div>

              {attempted && !selectedBuilding && (
                <p className="text-red-400" style={{ fontSize: "0.75rem" }}>Vui lòng chọn một tòa nhà</p>
              )}
            </div>
          )}

          {step === 2 && (
            <PersonalInfoStep info={info} onChange={(u) => setInfo((p) => ({ ...p, ...u }))} attempted={attempted} />
          )}

          {step === 3 && selectedBuilding && (
            <div className="space-y-4">
              {/* Selected building summary */}
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-5">
                <p className="text-white font-bold mb-3" style={{ fontSize: "0.95rem" }}>Xác nhận đăng ký</p>
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-violet-500/20">
                  <img src={selectedBuilding.img} alt={selectedBuilding.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>{selectedBuilding.name}</p>
                    <p className="text-white/60" style={{ fontSize: "0.78rem" }}>{selectedBuilding.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-mono" style={{ fontSize: "0.75rem" }}>Phòng {selectedUnit}</span>
                      <span className="text-white/40" style={{ fontSize: "0.72rem" }}>{selectedBuilding.price}</span>
                    </div>
                  </div>
                </div>
                {[
                  { icon: User, label: "Họ tên", val: info.fullName },
                  { icon: Mail, label: "Email", val: info.email },
                  { icon: Phone, label: "Điện thoại", val: info.phone },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-center gap-3 py-1.5">
                    <Icon size={14} className="text-white/30 flex-shrink-0" />
                    <span className="text-white/50" style={{ fontSize: "0.78rem", width: "80px" }}>{label}</span>
                    <span className="text-white" style={{ fontSize: "0.875rem" }}>{val}</span>
                  </div>
                ))}
              </div>

              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 flex items-start gap-3">
                <Bot size={15} className="text-violet-400 flex-shrink-0 mt-0.5" />
                <p className="text-violet-300" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
                  Sau khi đăng ký, AI Agent sẽ tự động thông báo tới quản lý tòa nhà <strong>{selectedBuilding.name}</strong>. Yêu cầu sẽ được xét duyệt trong 1–2 ngày làm việc.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center justify-between mt-8">
        <button onClick={() => step > 1 ? setStep((s) => (s - 1) as 1 | 2 | 3) : onBack()}
          className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
          style={{ fontSize: "0.875rem" }}>
          <ChevronLeft size={16} />{step > 1 ? "Quay lại" : "Chọn lại"}
        </button>
        <button onClick={handleNext}
          className={`flex items-center gap-2 px-7 py-3 rounded-full font-semibold transition-all ${
            canNext() ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-violet-500/20" : "bg-white/10 text-white/40 cursor-not-allowed"
          }`}
          style={{ fontSize: "0.9rem" }}>
          {step === 3 ? "Xác nhận đăng ký" : "Tiếp theo"}<ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Main TenantRegister ───────────────────────────────────────────────────────
export function TenantRegister() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<RegistrationMode>("none");

  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#030B14" }}>
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(148,163,184,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "50%", height: "60%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-5%", right: "-10%", width: "45%", height: "50%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Building2 size={15} className="text-white" />
          </div>
          <span style={{ fontSize: "1rem", fontWeight: 800 }}>NestaViet<span className="text-cyan-400">AI</span></span>
        </button>
        <button onClick={() => mode !== "none" ? setMode("none") : navigate("/")}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors" style={{ fontSize: "0.875rem" }}>
          <ChevronLeft size={16} />{mode !== "none" ? "Chọn lại" : "Trang chủ"}
        </button>
      </header>

      <AnimatePresence mode="wait">
        {mode === "none" && (
          <motion.div key="mode-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-2xl mx-auto px-6 py-12">

            {/* Title */}
            <motion.div className="text-center mb-12"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
                style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-cyan-400" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em" }}>ĐĂNG KÝ CƯ DÂN · MIỄN PHÍ</span>
              </div>
              <h1 className="text-white mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Bạn đã có phòng chưa?
              </h1>
              <p className="text-white/45 max-w-sm mx-auto" style={{ fontSize: "0.92rem", lineHeight: 1.65 }}>
                Chọn hướng phù hợp — AI sẽ đồng hành cùng bạn trong cả hai trường hợp
              </p>
            </motion.div>

            {/* Mode cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Not yet found — AI search */}
              <motion.button
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setMode("ai")}
                className="text-left rounded-3xl p-7 transition-all group relative overflow-hidden"
                style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(16,185,129,0.45)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(16,185,129,0.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(16,185,129,0.2)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                    <Bot size={26} className="text-white" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-bold" style={{ fontSize: "0.6rem", background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)", letterSpacing: "0.06em" }}>
                    ĐỀ XUẤT
                  </span>
                </div>
                <h3 className="text-white font-bold mb-2" style={{ fontSize: "1.1rem" }}>Chưa chọn được phòng</h3>
                <p className="text-white/48 mb-5" style={{ fontSize: "0.82rem", lineHeight: 1.7 }}>
                  Cho AI biết nhu cầu của bạn — Super Broker sẽ gợi ý những căn hộ tốt nhất và gửi về email trong 5 phút.
                </p>
                <ul className="space-y-2 mb-6">
                  {["Tìm theo khu vực, ngân sách, loại phòng", "AI phân tích & gợi ý cá nhân hoá", "Nhận danh sách phù hợp qua email"].map((item) => (
                    <li key={item} className="flex items-center gap-2" style={{ fontSize: "0.75rem", color: "rgba(52,211,153,0.8)" }}>
                      <Sparkles size={10} className="flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1.5 font-semibold" style={{ fontSize: "0.82rem", color: "#34d399" }}>
                  Để AI tìm giúp <ChevronRight size={15} />
                </div>
              </motion.button>

              {/* Already has a building in mind */}
              <motion.button
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.24, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setMode("building")}
                className="text-left rounded-3xl p-7 transition-all group relative overflow-hidden"
                style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.2)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.45)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(139,92,246,0.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.2)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                    <Building2 size={26} className="text-white" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-bold" style={{ fontSize: "0.6rem", background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.25)", letterSpacing: "0.06em" }}>
                    CÓ TÒA NHÀ
                  </span>
                </div>
                <h3 className="text-white font-bold mb-2" style={{ fontSize: "1.1rem" }}>Đã biết tòa nhà muốn ở</h3>
                <p className="text-white/48 mb-5" style={{ fontSize: "0.82rem", lineHeight: 1.7 }}>
                  Chọn căn hộ cụ thể trong tòa nhà và đăng ký vào — AI sẽ tự động thông báo tới quản lý và xử lý hồ sơ.
                </p>
                <ul className="space-y-2 mb-6">
                  {["Chọn tòa nhà từ danh sách có sẵn", "Xem phòng trống, chọn căn hộ cụ thể", "AI thông báo & theo dõi hồ sơ tự động"].map((item) => (
                    <li key={item} className="flex items-center gap-2" style={{ fontSize: "0.75rem", color: "rgba(167,139,250,0.85)" }}>
                      <CheckCircle2 size={10} className="flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1.5 font-semibold" style={{ fontSize: "0.82rem", color: "#a78bfa" }}>
                  Chọn tòa nhà <ChevronRight size={15} />
                </div>
              </motion.button>
            </div>

            {/* Divider + login */}
            <motion.div className="mt-10 text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                <span className="text-white/25" style={{ fontSize: "0.72rem" }}>hoặc</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              </div>
              <p className="text-white/35" style={{ fontSize: "0.82rem" }}>
                Đã có tài khoản?{" "}
                <button onClick={() => navigate("/tenant/login")} className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">Đăng nhập ngay →</button>
              </p>
            </motion.div>
          </motion.div>
        )}

        {mode === "ai" && (
          <motion.div key="ai-flow" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="relative z-10">
            <AIFlow onBack={() => setMode("none")} />
          </motion.div>
        )}

        {mode === "building" && (
          <motion.div key="building-flow" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="relative z-10">
            <BuildingFlow onBack={() => setMode("none")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
