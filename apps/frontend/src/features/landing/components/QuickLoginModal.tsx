import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { X, Building2 } from "lucide-react";

interface QuickLoginModalProps {
  mode: "chat" | "post";
  onClose: () => void;
  onSuccess: () => void;
}

const modeLabel = {
  chat: "Đăng nhập để trò chuyện với AI",
  post: "Đăng nhập để đăng tin",
};

const inputCls: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  fontSize: "0.88rem",
  outline: "none",
};

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Vui lòng nhập đầy đủ thông tin."); return; }
    localStorage.setItem("nv-quick-email", email.trim());
    onSuccess();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50" style={{ fontSize: "0.78rem" }}>Email</label>
        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
          placeholder="you@example.com" style={inputCls} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50" style={{ fontSize: "0.78rem" }}>Mật khẩu</label>
        <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
          placeholder="••••••••" style={inputCls} />
      </div>
      {error && <p className="text-red-400" style={{ fontSize: "0.78rem" }}>{error}</p>}
      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        className="w-full py-2.5 rounded-xl text-white font-semibold mt-1"
        style={{ fontSize: "0.88rem", background: "linear-gradient(135deg,#22d3ee,#3b82f6)", boxShadow: "0 0 18px rgba(34,211,238,0.25)" }}>
        Đăng nhập
      </motion.button>
    </form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin."); return;
    }
    if (password !== confirm) { setError("Mật khẩu xác nhận không khớp."); return; }
    localStorage.setItem("nv-quick-email", email.trim());
    onSuccess();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50" style={{ fontSize: "0.78rem" }}>Họ và tên</label>
        <input type="text" value={name} onChange={e => { setName(e.target.value); setError(""); }}
          placeholder="Nguyễn Văn A" style={inputCls} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50" style={{ fontSize: "0.78rem" }}>Email</label>
        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
          placeholder="you@example.com" style={inputCls} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50" style={{ fontSize: "0.78rem" }}>Số điện thoại</label>
        <input type="tel" value={phone} onChange={e => { setPhone(e.target.value); setError(""); }}
          placeholder="0901 234 567" style={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50" style={{ fontSize: "0.78rem" }}>Mật khẩu</label>
          <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
            placeholder="••••••••" style={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50" style={{ fontSize: "0.78rem" }}>Xác nhận</label>
          <input type="password" value={confirm} onChange={e => { setConfirm(e.target.value); setError(""); }}
            placeholder="••••••••" style={inputCls} />
        </div>
      </div>
      {error && <p className="text-red-400" style={{ fontSize: "0.78rem" }}>{error}</p>}
      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        className="w-full py-2.5 rounded-xl text-white font-semibold mt-1"
        style={{ fontSize: "0.88rem", background: "linear-gradient(135deg,#22d3ee,#3b82f6)", boxShadow: "0 0 18px rgba(34,211,238,0.25)" }}>
        Tạo tài khoản
      </motion.button>
    </form>
  );
}

export function QuickLoginModal({ mode, onClose, onSuccess }: QuickLoginModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-2xl p-7"
        style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(15,24,41,0.97)", backdropFilter: "blur(20px)" }}>

        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all">
          <X size={16} />
        </button>

        {/* Branding */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Building2 size={15} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold" style={{ fontSize: "0.95rem", lineHeight: 1.2 }}>
              NestaViet<span className="text-cyan-400">AI</span>
            </p>
            <p className="text-white/35" style={{ fontSize: "0.68rem" }}>Tài khoản người dùng · {modeLabel[mode]}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mt-5 mb-5 border-b border-white/8">
          {(["login", "register"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-2.5 px-1 mr-5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                tab === t ? "text-cyan-400 border-cyan-400" : "text-white/35 border-transparent hover:text-white/55"
              }`}
              style={{ fontSize: "0.85rem" }}>
              {t === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>
          ))}
        </div>

        {tab === "login" ? <LoginForm onSuccess={onSuccess} /> : <RegisterForm onSuccess={onSuccess} />}
      </motion.div>
    </div>,
    document.body
  );
}
