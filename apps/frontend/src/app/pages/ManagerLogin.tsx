import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Building, Lock, Mail, Eye, EyeOff, Shield, AlertCircle, Globe } from "lucide-react";
import { useLang } from "@shared/hooks/useLang";

const MANAGER_USERS = [
  { email: "manager@nestaviet.vn", password: "NestaViet@Manager2025", role: "manager", name: "Nguyễn Quản Lý", building: "Toà A - NestaViet Tower" },
  { email: "manager2@nestaviet.vn", password: "NestaViet@Manager2025", role: "manager", name: "Trần Thị Hoa", building: "Toà B - Sky Residences" },
];

const AUTH_KEY = "nv_manager_session";

export function isManagerAuthenticated(): boolean {
  try {
    const s = sessionStorage.getItem(AUTH_KEY);
    if (!s) return false;
    const { expiry } = JSON.parse(s);
    return Date.now() < expiry;
  } catch { return false; }
}

export function ManagerLogin() {
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang("manager");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.documentElement.removeAttribute("data-theme"); }, []);

  const handleLogin = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    const user = MANAGER_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify({
        email: user.email, name: user.name, role: user.role,
        building: user.building, expiry: Date.now() + 8 * 60 * 60 * 1000,
      }));
      navigate("/manager/dashboard", { replace: true });
    } else {
      setError(t("Email hoặc mật khẩu không đúng.", "Incorrect email or password."));
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "radial-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), " +
          "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(16,185,129,0.09) 0%, transparent 60%), " +
          "radial-gradient(ellipse 60% 60% at 80% 70%, rgba(6,182,212,0.06) 0%, transparent 55%), " +
          "linear-gradient(#07101C, #07101C)",
        backgroundSize: "28px 28px, 100% 100%, 100% 100%, 100% 100%",
      }}
    >
      {/* Lang toggle */}
      <button
        onClick={toggleLang}
        className="fixed top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/6 border border-white/10 text-white/50 hover:text-white/80 transition-colors"
        style={{ fontSize: "0.75rem" }}
      >
        <Globe size={13} />
        {lang === "vi" ? "EN" : "VI"}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <div
          className="rounded-2xl border border-emerald-500/15 p-8 nv-shimmer nv-holo-card"
          style={{ background: "rgba(10,22,20,0.96)", backdropFilter: "blur(20px)", boxShadow: "0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,185,129,0.12)" }}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 flex items-center justify-center mb-4">
              <div className="absolute inset-0 rounded-full border border-emerald-500/20 nv-orbit-ring-1" style={{ transform: "scale(1.1)" }} />
              <div className="absolute inset-0 rounded-full border border-teal-500/10 nv-orbit-ring-2" style={{ transform: "scale(1.28)", borderStyle: "dashed" }} />
              <motion.div
                initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 18 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center nv-glow-pulse-emerald"
                style={{ boxShadow: "0 8px 32px rgba(16,185,129,0.4)" }}
              >
                <Building size={26} className="text-white" />
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 mb-1">
              <Shield size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-mono" style={{ fontSize: "0.72rem", fontWeight: 600 }}>manager.nestaviet.vn</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, type: "spring", stiffness: 260, damping: 22 }}
              className="text-center font-bold" style={{ fontSize: "1.3rem", background: "linear-gradient(135deg,#10b981,#34d399,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {t("Cổng Quản Lý Toà Nhà", "Building Manager Portal")}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }} className="text-white/40 text-center mt-1" style={{ fontSize: "0.8rem" }}>
              {t("Dành riêng cho ban quản lý", "Restricted to building staff")}
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, type: "spring", stiffness: 280, damping: 24 }}>
              <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                {t("Email quản lý", "Manager Email")}
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email" placeholder="manager@nestaviet.vn"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full bg-white/5 border border-emerald-500/20 rounded-xl py-3 pl-9 pr-4 text-white placeholder-white/22 outline-none nv-input-focus-emerald"
                  style={{ fontSize: "0.875rem" }} autoComplete="email"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13, type: "spring", stiffness: 280, damping: 24 }}>
              <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                {t("Mật khẩu", "Password")}
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPass ? "text" : "password"} placeholder="••••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full bg-white/5 border border-emerald-500/20 rounded-xl py-3 pl-9 pr-10 text-white placeholder-white/22 outline-none nv-input-focus-emerald"
                  style={{ fontSize: "0.875rem" }} autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/28 hover:text-white/55 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2.5">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400" style={{ fontSize: "0.8rem" }}>{error}</p>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.21, type: "spring", stiffness: 280, damping: 24 }}>
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg shadow-emerald-500/20 mt-2 nv-glow-pulse"
                style={{ fontSize: "0.9rem" }}
              >
                {loading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
                  </svg>
                ) : <Lock size={15} />}
                {loading ? t("Đang xác thực...", "Authenticating...") : t("Đăng nhập", "Sign In")}
              </button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => navigate("/")} className="text-white/28 hover:text-white/50 transition-colors" style={{ fontSize: "0.75rem" }}>
              ← {t("Về trang chủ", "Back to Home")}
            </button>
          </div>
        </div>
        {/* Demo credentials — click to fill */}
        <button
          type="button"
          onClick={() => { setEmail("manager@nestaviet.vn"); setPassword("NestaViet@Manager2025"); }}
          className="mt-4 w-full rounded-xl border border-emerald-500/15 px-4 py-3 text-left hover:border-emerald-500/30 transition-colors group"
          style={{ background: "rgba(16,185,129,0.05)" }}
        >
          <p className="text-emerald-400/60 mb-1.5 flex items-center gap-2" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em" }}>
            DEMO CREDENTIALS
            <span className="text-emerald-400/40 group-hover:text-emerald-400/70 transition-colors" style={{ fontSize: "0.6rem", fontWeight: 400 }}>← click to fill</span>
          </p>
          <p className="text-white/40 font-mono" style={{ fontSize: "0.72rem" }}>manager@nestaviet.vn</p>
          <p className="text-white/28 font-mono" style={{ fontSize: "0.68rem" }}>NestaViet@Manager2025</p>
        </button>
        <p className="text-center text-white/18 mt-3" style={{ fontSize: "0.68rem" }}>
          {t("Khu vực bảo mật — Chỉ dành cho ban quản lý toà nhà", "Secured area — Building management staff only")}
        </p>
      </motion.div>
    </div>
  );
}
