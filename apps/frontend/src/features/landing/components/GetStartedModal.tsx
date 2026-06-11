import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Home, Building2, CheckCircle2, X, UserPlus, LogIn,
} from "lucide-react";

export function GetStartedModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const roles = [
    {
      key: "tenant", icon: Home,
      gradient: "from-emerald-500 to-cyan-500", glow: "rgba(16,185,129,0.25)",
      title: "Cư dân / Người thuê",
      desc: "Tìm phòng thuê bằng AI, đặt lịch xem, quản lý hóa đơn & hợp đồng",
      features: ["Tìm phòng bằng Super Broker AI","Chat & đặt lịch trực tiếp","Quản lý hóa đơn VietQR"],
      register: "/tenant/register", login: "/tenant/login",
    },
    {
      key: "landlord", icon: Building2,
      gradient: "from-violet-500 to-purple-600", glow: "rgba(139,92,246,0.25)",
      title: "Chủ nhà / Quản lý",
      desc: "Đăng tin cho thuê, quản lý cư dân & doanh thu với 4 AI Agents",
      features: ["Listing Verifier kiểm duyệt tự động","Dashboard doanh thu real-time","Smart Concierge 24/7"],
      register: "/landlord/register", login: "/landlord/login",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 16 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-6">
          <p className="text-white/40 mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.14em" }}>CHÀO MỪNG ĐẾN VỚI</p>
          <h2 className="text-white font-black" style={{ fontSize: "clamp(1.4rem,3vw,2rem)", letterSpacing: "-0.03em" }}>
            NestaViet<span style={{ color: "#a78bfa" }}>AI</span>
          </h2>
          <p className="text-white/35 mt-1" style={{ fontSize: "0.85rem" }}>Bạn muốn sử dụng với tư cách gì?</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {roles.map((role, i) => {
            const Icon = role.icon;
            return (
              <motion.div key={role.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 240, damping: 24 }}
                className="rounded-2xl overflow-hidden border border-white/10"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <div className={`bg-gradient-to-br ${role.gradient} p-5`} style={{ boxShadow: `0 8px 32px ${role.glow}` }}>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold" style={{ fontSize: "1rem" }}>{role.title}</h3>
                  <p className="text-white/70 mt-1" style={{ fontSize: "0.78rem", lineHeight: 1.5 }}>{role.desc}</p>
                </div>
                <div className="p-4 space-y-2">
                  {role.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-white/35 flex-shrink-0" />
                      <span className="text-white/55" style={{ fontSize: "0.75rem" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(role.register)}
                    className={`flex-1 py-2.5 rounded-xl text-white font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r ${role.gradient}`}
                    style={{ fontSize: "0.8rem" }}>
                    <UserPlus size={14} />Đăng ký mới
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(role.login)}
                    className="px-4 py-2.5 rounded-xl border border-white/20 text-white/65 hover:text-white hover:border-white/40 transition-colors flex items-center gap-1.5"
                    style={{ fontSize: "0.8rem" }}>
                    <LogIn size={14} />Đăng nhập
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center">
          <button onClick={onClose} className="text-white/25 hover:text-white/55 transition-colors flex items-center gap-1.5 mx-auto" style={{ fontSize: "0.8rem" }}>
            <X size={14} />Đóng lại
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
