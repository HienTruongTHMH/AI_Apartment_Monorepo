import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Shield, Building, Code2, Home, User,
  ArrowRight, Globe, Lock,
} from "lucide-react";

const PORTALS = [
  {
    id: "tenant",
    title: "Cổng Cư Dân",
    subtitle: "Tenant Portal",
    icon: User,
    color: "#22d3ee",
    grad: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/20",
    bg: "rgba(34,211,238,0.05)",
    glow: "rgba(34,211,238,0.25)",
    loginPath: "/tenant/login",
    domain: "app.nestaviet.vn",
    desc: "Quản lý hợp đồng, hóa đơn, báo sự cố và chat với AI",
    demoEmail: "tenant@email.com",
    demoPass: "(bất kỳ mật khẩu)",
    features: ["Chat với Super Broker AI", "Hóa đơn điện tử", "Báo cáo sự cố", "Khám phá căn hộ"],
  },
  {
    id: "landlord",
    title: "Cổng Chủ Nhà",
    subtitle: "Landlord Portal",
    icon: Home,
    color: "#a78bfa",
    grad: "from-violet-500 to-purple-700",
    border: "border-violet-500/20",
    bg: "rgba(167,139,250,0.05)",
    glow: "rgba(167,139,250,0.25)",
    loginPath: "/landlord/login",
    domain: "landlord.nestaviet.vn",
    desc: "Quản lý bất động sản, hợp đồng và doanh thu",
    demoEmail: "landlord@email.com",
    demoPass: "(bất kỳ mật khẩu)",
    features: ["Quản lý tài sản", "Hợp đồng số", "Báo cáo doanh thu", "Xác minh AI"],
  },
  {
    id: "manager",
    title: "Cổng Quản Lý Toà",
    subtitle: "Building Manager",
    icon: Building,
    color: "#34d399",
    grad: "from-emerald-500 to-teal-600",
    border: "border-emerald-500/20",
    bg: "rgba(52,211,153,0.05)",
    glow: "rgba(52,211,153,0.25)",
    loginPath: "/manager/login",
    domain: "manager.nestaviet.vn",
    desc: "Tổng quan toà nhà, hợp đồng và tài chính",
    demoEmail: "manager@nestaviet.vn",
    demoPass: "NestaViet@Manager2025",
    features: ["Tổng quan toà nhà", "Quản lý hợp đồng", "Báo cáo tài chính", "Danh sách cư dân"],
  },
  {
    id: "admin",
    title: "Admin Portal",
    subtitle: "Super Administrator",
    icon: Shield,
    color: "#8b5cf6",
    grad: "from-violet-500 to-purple-700",
    border: "border-violet-500/20",
    bg: "rgba(139,92,246,0.05)",
    glow: "rgba(139,92,246,0.3)",
    loginPath: "/admin/login",
    domain: "admin.nestaviet.vn",
    desc: "Giám sát hệ thống AI, quản lý người dùng và API logs",
    demoEmail: "admin@nestaviet.vn",
    demoPass: "NestaViet@Admin2025",
    features: ["AI Agent Monitor", "API Logs", "User Management", "System Settings"],
  },
  {
    id: "dev",
    title: "Developer Portal",
    subtitle: "Engineering Team",
    icon: Code2,
    color: "#3b82f6",
    grad: "from-blue-500 to-cyan-600",
    border: "border-blue-500/20",
    bg: "rgba(59,130,246,0.05)",
    glow: "rgba(59,130,246,0.3)",
    loginPath: "/dev/login",
    domain: "dev.nestaviet.vn",
    desc: "Hệ thống CI/CD, cấu hình môi trường và deployment",
    demoEmail: "dev@nestaviet.vn",
    demoPass: "NestaViet@Dev2025",
    features: ["API Logs Live", "System Health", "Deployments", "Env Config"],
  },
];

export function PortalDirectory() {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{
        backgroundImage:
          "radial-gradient(rgba(148,163,184,0.03) 1px, transparent 1px), " +
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34,211,238,0.06) 0%, transparent 60%), " +
          "linear-gradient(#030B14, #030B14)",
        backgroundSize: "28px 28px, 100% 100%, 100% 100%",
      }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <span className="text-white font-bold" style={{ fontSize: "1.1rem" }}>NestaVietAI</span>
          </div>
          <h1 className="text-white font-bold mb-3" style={{ fontSize: "2rem", letterSpacing: "-0.04em" }}>
            Portal Directory
          </h1>
          <p className="text-white/40 max-w-md mx-auto" style={{ fontSize: "0.9rem" }}>
            Chọn cổng phù hợp với vai trò của bạn để tiếp tục
          </p>
          <button onClick={() => navigate("/")} className="mt-4 text-white/25 hover:text-white/50 transition-colors" style={{ fontSize: "0.75rem" }}>
            ← Về trang chủ
          </button>
        </motion.div>

        {/* Portal grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PORTALS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => navigate(p.loginPath)}
              className={`rounded-2xl border ${p.border} p-6 cursor-pointer group`}
              style={{ background: p.bg, boxShadow: `0 0 0 0 ${p.glow}`, transition: "box-shadow 0.3s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px -8px ${p.glow}`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 transparent"; }}
            >
              {/* Icon + title */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.grad} flex items-center justify-center shadow-lg flex-shrink-0`}
                  style={{ boxShadow: `0 6px 20px ${p.glow}` }}>
                  <p.icon size={20} className="text-white" />
                </div>
                <ArrowRight size={16} className="text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all mt-1" />
              </div>

              <p className="text-white font-bold mb-0.5" style={{ fontSize: "0.95rem" }}>{p.title}</p>
              <p style={{ fontSize: "0.7rem", color: p.color, fontWeight: 600, marginBottom: "8px" }}>{p.subtitle}</p>
              <p className="text-white/40 mb-4" style={{ fontSize: "0.78rem", lineHeight: 1.55 }}>{p.desc}</p>

              {/* Features */}
              <div className="space-y-1.5 mb-5">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    <span className="text-white/35" style={{ fontSize: "0.72rem" }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* Demo credentials */}
              <div className="rounded-xl border px-3 py-2.5" style={{ borderColor: `${p.color}22`, background: `${p.color}08` }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Lock size={10} style={{ color: p.color, opacity: 0.6 }} />
                  <span style={{ fontSize: "0.6rem", color: p.color, fontWeight: 700, opacity: 0.6, letterSpacing: "0.08em" }}>DEMO</span>
                </div>
                <p className="text-white/35 font-mono" style={{ fontSize: "0.68rem" }}>{p.demoEmail}</p>
                <p className="text-white/22 font-mono" style={{ fontSize: "0.63rem" }}>{p.demoPass}</p>
              </div>

              <div className="mt-4 flex items-center gap-2 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "0.65rem", color: p.color, fontWeight: 600, opacity: 0.5 }}>{p.domain}</span>
                <span className="ml-auto text-white/60 group-hover:text-white transition-colors font-semibold flex items-center gap-1" style={{ fontSize: "0.78rem" }}>
                  Đăng nhập <ArrowRight size={12} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/15 mt-10" style={{ fontSize: "0.68rem" }}>
          NestaVietAI — Nền tảng quản lý bất động sản thông minh · TLS 1.3
        </p>
      </div>
    </div>
  );
}
