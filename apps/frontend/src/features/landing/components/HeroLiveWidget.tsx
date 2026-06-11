import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function HeroLiveWidget() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const events = [
    { msg: "AI duyệt #L-2204 — ảnh OK", color: "#3b82f6", time: "08:42" },
    { msg: "Cư dân P.805 thanh toán 12M", color: "#10b981", time: "08:39" },
    { msg: "Super Broker chốt lịch hẹn", color: "#a78bfa", time: "08:35" },
    { msg: "HĐ ký điện tử #C-0301 xong",  color: "#f59e0b", time: "08:31" },
    { msg: "Ticket T-089 đóng · 5⭐",      color: "#8b5cf6", time: "08:28" },
  ];
  const currentEvents = Array.from({ length: 4 }, (_, i) => events[(tick + i) % events.length]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 0.55, type: "spring", stiffness: 180, damping: 22 }}
      className="hidden xl:block absolute right-[-1rem] top-1/2 -translate-y-1/2 w-72"
      style={{ zIndex: 5 }}
    >
      <div className="rounded-2xl border border-white/10 overflow-hidden"
        style={{ background: "rgba(5,10,24,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 24px 72px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.08)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/7" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/45 font-mono" style={{ fontSize: "0.65rem", fontWeight: 600 }}>LIVE ACTIVITY</span>
          </div>
          <span className="text-white/22 font-mono" style={{ fontSize: "0.6rem" }}>NestaVietAI</span>
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-white/6 px-0 py-0">
          {[
            { val: "24",   label: "AI tư vấn", color: "#22d3ee" },
            { val: "4",    label: "Agents ON",  color: "#a78bfa" },
            { val: "97.8%",label: "SLA",        color: "#34d399" },
          ].map(({ val, label, color }) => (
            <div key={label} className="flex flex-col items-center py-3">
              <p className="font-bold" style={{ fontSize: "0.95rem", color }}>{val}</p>
              <p className="text-white/28" style={{ fontSize: "0.58rem" }}>{label}</p>
            </div>
          ))}
        </div>
        {/* Event stream */}
        <div className="px-4 py-3 space-y-2">
          {currentEvents.map((e, i) => (
            <motion.div key={`${tick}-${i}`}
              initial={i === 0 ? { opacity: 0, y: -8 } : { opacity: 1 - i * 0.2 }}
              animate={{ opacity: 1 - i * 0.2 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <span className="text-white/45 flex-1 truncate" style={{ fontSize: "0.68rem" }}>{e.msg}</span>
              <span className="text-white/18 flex-shrink-0 font-mono" style={{ fontSize: "0.6rem" }}>{e.time}</span>
            </motion.div>
          ))}
        </div>
        {/* Bottom bar */}
        <div className="px-4 py-2.5 border-t border-white/6" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="flex items-center justify-between">
            <span className="text-white/28" style={{ fontSize: "0.62rem" }}>3,200+ giao dịch/tháng</span>
            <span className="text-emerald-400/60" style={{ fontSize: "0.6rem", fontWeight: 600 }}>↑ 12%</span>
          </div>
        </div>
      </div>
      {/* Floating ambient glow */}
      <div className="absolute -inset-4 rounded-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)", filter: "blur(20px)" }} />
    </motion.div>
  );
}
