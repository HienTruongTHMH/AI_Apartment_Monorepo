import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2, ChevronLeft, Mail, Lock, Eye, EyeOff,
  CheckCircle2, ArrowRight, AlertCircle, RefreshCw, Shield,
} from "lucide-react";

const STAFF_EMAILS = new Set([
  "admin@nestaviet.vn",
  "dev@nestaviet.vn", "devops@nestaviet.vn",
  "manager@nestaviet.vn", "manager2@nestaviet.vn",
]);

export function LandlordLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.documentElement.removeAttribute("data-theme"); // auth pages always dark
  }, []);

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) { setError("Vui lòng nhập email và mật khẩu"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Email không hợp lệ"); return; }
    if (STAFF_EMAILS.has(email.toLowerCase())) {
      setError("Tài khoản nhân viên không được truy cập cổng chủ nhà. Vui lòng dùng đúng cổng.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    const tempSuffix = /^[A-Z2-9a-z]{10}$/.test(password);
    if (tempSuffix) {
      setIsFirstLogin(true);
    } else {
      try {
        localStorage.setItem("nv-landlord-logged-in", "true");
        localStorage.setItem("nv-landlord-email", email);
        if (!localStorage.getItem("nv-landlord-user")) {
          const prefix = email.split("@")[0];
          const name = prefix.replace(/[._-]/g, " ").split(" ")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          localStorage.setItem("nv-landlord-user", JSON.stringify({ name, email }));
        }
      } catch {}
      navigate("/landlord");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) { setError("Mật khẩu mới phải ít nhất 8 ký tự"); return; }
    if (newPassword !== confirmNew) { setError("Mật khẩu xác nhận không khớp"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    try {
      localStorage.setItem("nv-landlord-logged-in", "true");
      localStorage.setItem("nv-landlord-email", email);
      if (!localStorage.getItem("nv-landlord-user")) {
        const prefix = email.split("@")[0];
        const name = prefix.replace(/[._-]/g, " ").split(" ")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        localStorage.setItem("nv-landlord-user", JSON.stringify({ name, email }));
      }
    } catch {}
    setSuccess(true);
    setTimeout(() => navigate("/landlord"), 1500);
  };

  const handleForgot = async () => {
    if (!email.trim()) { setError("Nhập email để nhận mật khẩu mới"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setForgotSent(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--nv-bg)" }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-violet-500/30">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h2 className="text-white font-bold mb-2" style={{ fontSize: "1.5rem" }}>Mật khẩu đã cập nhật!</h2>
          <p className="text-white/50" style={{ fontSize: "0.88rem" }}>Đang chuyển hướng vào bảng quản lý...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "var(--nv-bg)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(148,163,184,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 45% at 30% 20%, rgba(139,92,246,0.07) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 70% 80%, rgba(34,211,238,0.04) 0%, transparent 60%)" }} />

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
            <Building2 size={15} className="text-white" />
          </div>
          <span style={{ fontSize: "1rem", fontWeight: 800 }}>NestaViet<span className="text-violet-400">AI</span></span>
        </button>
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors" style={{ fontSize: "0.875rem" }}>
          <ChevronLeft size={16} />Trang chủ
        </button>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-4">
              <Shield size={13} className="text-violet-400" />
              <span className="text-violet-400" style={{ fontSize: "0.72rem", fontWeight: 700 }}>QUẢN LÝ TÒA NHÀ</span>
            </div>
            <h1 className="text-white mb-2" style={{ fontSize: "2rem", fontWeight: 800 }}>
              {isFirstLogin ? "Đổi mật khẩu" : forgotMode ? "Quên mật khẩu" : "Đăng nhập"}
            </h1>
            <p className="text-white/45" style={{ fontSize: "0.9rem" }}>
              {isFirstLogin
                ? "Đặt mật khẩu mới để bảo vệ tài khoản quản lý của bạn"
                : forgotMode
                ? "Nhập email đăng ký — hệ thống sẽ gửi mật khẩu tạm thời"
                : "Dành cho chủ nhà & quản lý tòa nhà"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-8" style={{ background: "rgba(15,24,41,0.8)", backdropFilter: "blur(20px)" }}>
            <AnimatePresence mode="wait">
              {forgotMode && !forgotSent && (
                <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div>
                    <label className="block text-white/60 mb-2" style={{ fontSize: "0.8rem" }}>Email đăng ký</label>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/12 rounded-xl px-4 py-3">
                      <Mail size={16} className="text-white/35" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
                        className="flex-1 bg-transparent text-white placeholder-white/25 outline-none" style={{ fontSize: "0.88rem" }} />
                    </div>
                  </div>
                  {error && <p className="text-red-400 flex items-center gap-2" style={{ fontSize: "0.78rem" }}><AlertCircle size={13} />{error}</p>}
                  <button onClick={handleForgot} disabled={loading}
                    className="w-full py-3.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#a78bfa)", fontSize: "0.9rem" }}>
                    {loading ? <RefreshCw size={16} className="animate-spin" /> : null}
                    Gửi mật khẩu tạm thời
                  </button>
                  <button onClick={() => { setForgotMode(false); setError(""); }} className="w-full text-white/40 hover:text-white/70 transition-colors text-center" style={{ fontSize: "0.8rem" }}>
                    Quay lại đăng nhập
                  </button>
                </motion.div>
              )}

              {forgotMode && forgotSent && (
                <motion.div key="forgot-sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-4">
                    <Mail size={28} className="text-violet-400" />
                  </div>
                  <p className="text-white font-bold mb-2" style={{ fontSize: "1.1rem" }}>Email đã gửi!</p>
                  <p className="text-white/50 mb-5" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                    Kiểm tra hộp thư <strong className="text-white">{email}</strong> — mật khẩu tạm thời sẽ đến trong vài phút.
                  </p>
                  <button onClick={() => { setForgotMode(false); setForgotSent(false); setError(""); }}
                    className="text-violet-400 hover:text-violet-300 transition-colors" style={{ fontSize: "0.85rem" }}>
                    Về trang đăng nhập
                  </button>
                </motion.div>
              )}

              {isFirstLogin && (
                <motion.div key="change-pass" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                    <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-300" style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
                      Tài khoản quản lý yêu cầu đổi mật khẩu tạm thời trước khi sử dụng.
                    </p>
                  </div>
                  {[
                    { label: "Mật khẩu mới (≥8 ký tự)", value: newPassword, set: setNewPassword },
                    { label: "Xác nhận mật khẩu mới", value: confirmNew, set: setConfirmNew },
                  ].map((f, i) => (
                    <div key={i}>
                      <label className="block text-white/60 mb-2" style={{ fontSize: "0.8rem" }}>{f.label}</label>
                      <div className="flex items-center gap-3 bg-white/5 border border-white/12 rounded-xl px-4 py-3">
                        <Lock size={16} className="text-white/35" />
                        <input type={showNew ? "text" : "password"} value={f.value} onChange={(e) => f.set(e.target.value)} placeholder="••••••••"
                          className="flex-1 bg-transparent text-white placeholder-white/25 outline-none" style={{ fontSize: "0.88rem" }} />
                        <button onClick={() => setShowNew((v) => !v)} className="text-white/35 hover:text-white/60">
                          {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {error && <p className="text-red-400 flex items-center gap-2" style={{ fontSize: "0.78rem" }}><AlertCircle size={13} />{error}</p>}
                  <button onClick={handlePasswordChange} disabled={loading}
                    className="w-full py-3.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", fontSize: "0.9rem" }}>
                    {loading ? <RefreshCw size={16} className="animate-spin" /> : <><CheckCircle2 size={16} />Xác nhận & Vào hệ thống</>}
                  </button>
                </motion.div>
              )}

              {!isFirstLogin && !forgotMode && (
                <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, type: "spring", stiffness: 280, damping: 24 }}>
                    <label className="block text-white/60 mb-2" style={{ fontSize: "0.8rem" }}>Email</label>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/12 rounded-xl px-4 py-3 focus-within:border-violet-500/40 transition-colors">
                      <Mail size={16} className="text-white/35" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
                        className="flex-1 bg-transparent text-white placeholder-white/25 outline-none" style={{ fontSize: "0.88rem" }}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13, type: "spring", stiffness: 280, damping: 24 }}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white/60" style={{ fontSize: "0.8rem" }}>Mật khẩu</label>
                      <button onClick={() => { setForgotMode(true); setError(""); }} className="text-violet-400 hover:text-violet-300 transition-colors" style={{ fontSize: "0.75rem" }}>
                        Quên mật khẩu?
                      </button>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/12 rounded-xl px-4 py-3 focus-within:border-violet-500/40 transition-colors">
                      <Lock size={16} className="text-white/35" />
                      <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                        className="flex-1 bg-transparent text-white placeholder-white/25 outline-none" style={{ fontSize: "0.88rem" }}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
                      <button onClick={() => setShowPass((v) => !v)} className="text-white/35 hover:text-white/60">
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </motion.div>
                  {error && (
                    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 flex items-center gap-2" style={{ fontSize: "0.78rem" }}>
                      <AlertCircle size={13} />{error}
                    </motion.p>
                  )}
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.21, type: "spring", stiffness: 280, damping: 24 }}>
                    <button onClick={handleLogin} disabled={loading}
                      className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 nv-glow-pulse transition-opacity hover:opacity-90"
                      style={{ background: "linear-gradient(135deg,#8b5cf6,#a78bfa)", fontSize: "0.9rem" }}>
                      {loading ? <RefreshCw size={16} className="animate-spin" /> : <><ArrowRight size={16} />Đăng nhập</>}
                    </button>
                  </motion.div>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8" /></div>
                    <div className="relative flex justify-center"><span className="bg-transparent px-3 text-white/25" style={{ fontSize: "0.72rem" }}>hoặc</span></div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, type: "spring", stiffness: 280, damping: 24 }} className="text-center">
                    <p className="text-white/40 mb-3" style={{ fontSize: "0.82rem" }}>Chưa có tài khoản quản lý?</p>
                    <button onClick={() => navigate("/landlord/register")}
                      className="w-full py-3 rounded-xl border border-violet-500/30 text-violet-400 hover:bg-violet-500/8 transition-all font-semibold" style={{ fontSize: "0.85rem" }}>
                      Đăng ký quản lý tòa nhà
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!isFirstLogin && !forgotMode && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-5 rounded-xl border border-white/8 p-4" style={{ background: "rgba(139,92,246,0.04)" }}>
              <p className="text-white/40 text-center" style={{ fontSize: "0.75rem", lineHeight: 1.6 }}>
                Sau khi xác minh hồ sơ, NestaVietAI gửi thông tin đăng nhập qua email.<br />
                Lần đầu đăng nhập bắt buộc thay đổi mật khẩu tạm thời.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
