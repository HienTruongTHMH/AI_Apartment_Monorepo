import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Bot, Activity } from "lucide-react";
import { AGENTS, AGENT_COLORS, AGENT_METRICS, AGENT_LOGS } from "../data";

export function AgentControlRoom() {
  const [aiTick, setAiTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAiTick(i => i + 1), 2600);
    return () => clearInterval(id);
  }, []);
  const aiProcIdx = aiTick % 4;
  const logEntries = Array.from({ length: 5 }, (_, i) => AGENT_LOGS[(aiTick + i) % AGENT_LOGS.length]);
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-cyan-500/8 border border-cyan-500/15 rounded-full px-4 py-1.5 mb-4">
          <Bot size={13} className="text-cyan-400" />
          <span className="text-cyan-400" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em" }}>MULTI-AGENT AI ARCHITECTURE</span>
        </div>
        <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
          AI Control Room · 4 agents · 24/7
        </h2>
        <p className="text-white/40 max-w-2xl mx-auto" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
          Kiến trúc đa tác nhân phân tán — mỗi Agent chuyên trách một nghiệp vụ, giao tiếp qua event-driven để xử lý xuyên suốt vòng đời hợp đồng thuê nhà
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-3xl overflow-hidden border border-white/8"
        style={{ background: "rgba(3,7,18,0.95)", backdropFilter: "blur(24px)" }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/6" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-white/22 font-mono" style={{ fontSize: "0.68rem" }}>nestavietai — agent-orchestrator · v2.1.0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400/50 font-mono" style={{ fontSize: "0.62rem" }}>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/5">
          {AGENTS.map((agent, i) => {
            const isProc = aiProcIdx === i;
            const col = AGENT_COLORS[i];
            const m = AGENT_METRICS[i];
            return (
              <div key={agent.id} className="p-5 relative transition-colors duration-500"
                style={{ background: isProc ? "rgba(255,255,255,0.03)" : "transparent" }}>
                {isProc && <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${col}15 0%, transparent 70%)` }} />}
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.g} flex items-center justify-center transition-all duration-500`}
                      style={{ boxShadow: isProc ? `0 0 24px ${col}55` : "none" }}>
                      <agent.icon size={18} className="text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-all duration-500"
                      style={{ background: isProc ? `${col}20` : "rgba(52,211,153,0.1)", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.05em", color: isProc ? col : "#34d399" }}>
                      <motion.span animate={isProc ? { opacity: [1, 0.15, 1] } : { opacity: 1 }} transition={{ repeat: Infinity, duration: 0.7 }}
                        style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
                      {isProc ? "PROC..." : "ONLINE"}
                    </div>
                  </div>
                  <p className="text-white/20 mb-0.5" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em" }}>AGENT {agent.id}</p>
                  <p className="text-white font-bold mb-1.5" style={{ fontSize: "0.9rem" }}>{agent.name}</p>
                  <p className="text-white/30 mb-4" style={{ fontSize: "0.68rem", lineHeight: 1.55 }}>{agent.desc}</p>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                    <p className="font-extrabold transition-colors duration-500"
                      style={{ fontSize: "1.5rem", letterSpacing: "-0.03em", color: isProc ? col : "rgba(255,255,255,0.85)" }}>{m.val}</p>
                    <p className="text-white/28" style={{ fontSize: "0.6rem" }}>{m.label}</p>
                    <p style={{ fontSize: "0.58rem", color: col, opacity: 0.55, marginTop: "2px" }}>{m.sub}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/5 px-6 py-4" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={12} className="text-white/20" />
            <span className="text-white/20 font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.08em" }}>EVENT STREAM · LIVE</span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400/35 font-mono" style={{ fontSize: "0.58rem" }}>streaming</span>
            </div>
          </div>
          <div className="space-y-1.5">
            {logEntries.map((log, i) => (
              <div key={i} className="flex items-start gap-3 font-mono" style={{ fontSize: "0.68rem", opacity: 1 - i * 0.17 }}>
                <span className="text-white/18 flex-shrink-0 tabular-nums" style={{ minWidth: "2.8rem" }}>
                  {String((aiTick * 7 + i * 11) % 60).padStart(2,"0")}:{String((aiTick * 13 + i * 17 + 23) % 60).padStart(2,"0")}
                </span>
                <span className="flex-shrink-0 font-bold" style={{ color: log.color, minWidth: "7rem", opacity: 0.75 }}>[{log.agent.split(" ").slice(0,2).join(" ")}]</span>
                <span className="text-white/30 flex-1 min-w-0 truncate">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
