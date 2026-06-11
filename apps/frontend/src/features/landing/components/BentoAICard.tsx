import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity } from "lucide-react";
import { AGENTS, AGENT_COLORS, bentoAICardVariants } from "../data";

export function BentoAICard({ t }: { t: (vi: string, en: string) => string }) {
  const [procIdx, setProcIdx] = useState(0);
  const [logTick, setLogTick] = useState(0);
  useEffect(() => {
    const a = setInterval(() => setProcIdx(i => (i + 1) % 4), 2400);
    const b = setInterval(() => setLogTick(i => i + 1), 1600);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  const miniLogs = [
    { col: "#3b82f6", msg: "#L-2204 duyệt xong · 4/4 ảnh OK" },
    { col: "#10b981", msg: "Khách 2PN Q7 — chốt lịch hẹn" },
    { col: "#8b5cf6", msg: "T-089 điều hoà hỏng — SLA 2h45p" },
    { col: "#f59e0b", msg: "156 hóa đơn xuất · VietQR OK" },
    { col: "#3b82f6", msg: "Watermark #IMG-0392 từ chối" },
    { col: "#10b981", msg: "3PN Thảo Điền — tour ảo 8h mai" },
  ];
  const visibleLog = miniLogs[(logTick) % miniLogs.length];

  return (
    <motion.div variants={bentoAICardVariants}
      className="col-span-12 lg:col-span-7 rounded-3xl relative overflow-hidden group cursor-pointer"
      style={{ background: "rgba(3,7,18,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
      whileHover={{ borderColor: "rgba(34,211,238,0.25)" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 15% 20%, rgba(34,211,238,0.08) 0%, transparent 55%)" }} />

      {/* Header area */}
      <div className="relative z-10 p-7 pb-4">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/18 rounded-full px-3 py-1 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em" }}>MULTI-AGENT AI · LIVE</span>
        </div>
        <h3 className="text-white mb-2" style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
          {t("4 AI Agents hoạt động 24/7","4 AI Agents running 24/7")}
        </h3>
        <p className="text-white/38" style={{ fontSize: "0.88rem", lineHeight: 1.65, maxWidth: "420px" }}>
          {t("Kiến trúc đa tác nhân tự trị — mỗi agent chuyên một nghiệp vụ, chạy song song liên tục.","Autonomous multi-agent architecture — each agent specialises, runs continuously in parallel.")}
        </p>
      </div>

      {/* Agent status grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-0 border-t border-b border-white/5 divide-x divide-white/5 mx-0">
        {AGENTS.map((a, i) => {
          const isActive = procIdx === i;
          const col = AGENT_COLORS[i];
          return (
            <div key={a.id} className="px-4 py-4 transition-colors duration-500 relative"
              style={{ background: isActive ? `${col}08` : "transparent" }}>
              {isActive && <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${col}12 0%, transparent 65%)` }} />}
              <div className="relative">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.g} flex items-center justify-center mb-2.5 transition-all duration-500`}
                  style={{ boxShadow: isActive ? `0 0 20px ${col}45` : "none" }}>
                  <a.icon size={16} className="text-white" />
                </div>
                <p className="text-white font-semibold" style={{ fontSize: "0.72rem", lineHeight: 1.3 }}>{a.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <motion.div className="w-1 h-1 rounded-full" style={{ background: isActive ? col : "#34d399" }}
                    animate={isActive ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 0.7 }} />
                  <span style={{ fontSize: "0.55rem", color: isActive ? col : "#34d399", fontWeight: 700, opacity: 0.75 }}>
                    {isActive ? "PROC..." : "ONLINE"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live log ticker */}
      <div className="relative z-10 flex items-center gap-3 px-7 py-3">
        <Activity size={11} className="text-white/20 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={logTick}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5">
              <span className="font-bold font-mono flex-shrink-0" style={{ color: visibleLog.col, fontSize: "0.62rem" }}>
                [{AGENTS[logTick % 4].name.split(" ").slice(0,2).join(" ")}]
              </span>
              <span className="text-white/30 truncate" style={{ fontSize: "0.65rem" }}>{visibleLog.msg}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400/40 font-mono" style={{ fontSize: "0.58rem" }}>streaming</span>
        </div>
      </div>
    </motion.div>
  );
}
