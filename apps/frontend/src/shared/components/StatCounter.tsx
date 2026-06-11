import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useCountUp } from "@shared/hooks/useCountUp";

export function StatCounter({ target, suffix = "", prefix = "", color, label, duration = 1200 }: {
  target: number; suffix?: string; prefix?: string; color: string; label: string; duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCountUp(inView ? target : 0, duration);
  return (
    <div ref={ref}>
      <p className="font-black" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", letterSpacing: "-0.04em", color }}>
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-white/38" style={{ fontSize: "0.75rem" }}>{label}</p>
      <div className="mt-2 h-px rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </div>
    </div>
  );
}
