import { CSSProperties } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { TOUR_STEPS } from "../data";

export function ProductTour({ step, total, onNext, onSkip, t }: {
  step: number; total: number;
  onNext: () => void; onSkip: () => void;
  t: (vi: string, en: string) => string;
}) {
  const curr = TOUR_STEPS[step];
  const Icon = curr.icon;
  const isLast = step === total - 1;
  const positions: CSSProperties[] = [
    { top: "18vh", left: "50%", transform: "translateX(-50%)" },
    { top: "50vh", left: "50%", transform: "translateX(-50%)" },
    { top: "40vh", left: "50%", transform: "translateX(-50%)" },
    { bottom: "14vh", left: "50%", transform: "translateX(-50%)" },
  ];
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9985] pointer-events-none"
        style={{ background: "rgba(0,0,0,0.52)" }} />
      <div className="fixed inset-0 z-[9985]" onClick={onSkip} />
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.88, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="fixed z-[9986] pointer-events-auto"
        style={positions[step] as CSSProperties}>
        <div className="w-72 rounded-2xl p-5"
          style={{ background: "rgba(4,9,20,0.98)", border: "1px solid rgba(34,211,238,0.3)", boxShadow: "0 24px 64px rgba(0,0,0,0.85), 0 0 0 1px rgba(34,211,238,0.08)" }}>
          <div className="flex items-center gap-2 mb-3">
            {Array.from({ length: total }, (_, i) => (
              <div key={i} className="h-1 rounded-full transition-all duration-300"
                style={{ background: i <= step ? "#22d3ee" : "rgba(255,255,255,0.12)", width: i === step ? "20px" : "6px" }} />
            ))}
            <span className="ml-auto text-white/28" style={{ fontSize: "0.6rem" }}>{step + 1}/{total}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 nv-tour-ring"
              style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.3)" }}>
              <Icon size={18} style={{ color: "#22d3ee" }} />
            </div>
            <h3 className="text-white font-bold" style={{ fontSize: "0.95rem" }}>{curr.title}</h3>
          </div>
          <p className="text-white/45 mb-4" style={{ fontSize: "0.8rem", lineHeight: 1.65 }}>{curr.desc}</p>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={e => { e.stopPropagation(); onNext(); }}
              className="flex-1 py-2 rounded-xl text-white font-semibold flex items-center justify-center gap-1.5"
              style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", fontSize: "0.82rem" }}>
              {isLast ? t("Bắt đầu!","Let's go!") : t("Tiếp theo","Next")}<ArrowRight size={13} />
            </motion.button>
            <button onClick={e => { e.stopPropagation(); onSkip(); }}
              className="px-3 py-2 text-white/28 hover:text-white/55 transition-colors" style={{ fontSize: "0.78rem" }}>
              {t("Bỏ qua","Skip")}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
