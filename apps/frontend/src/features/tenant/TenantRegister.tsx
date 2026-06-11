import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Building2, ChevronLeft, ChevronRight, Bot, Sparkles, CheckCircle2 } from "lucide-react";
import { type RegistrationMode } from "@features/tenant/components/TenantRegisterData";
import AIRegisterFlow from "@features/tenant/components/AIRegisterFlow";
import BuildingRegisterFlow from "@features/tenant/components/BuildingRegisterFlow";

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <motion.button
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setMode("ai")}
                className="text-left rounded-3xl p-7 transition-all group relative overflow-hidden"
                style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(16,185,129,0.45)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(16,185,129,0.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(16,185,129,0.2)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
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
            <AIRegisterFlow onBack={() => setMode("none")} />
          </motion.div>
        )}

        {mode === "building" && (
          <motion.div key="building-flow" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="relative z-10">
            <BuildingRegisterFlow onBack={() => setMode("none")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
