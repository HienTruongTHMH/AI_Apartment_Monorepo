import { useRef } from "react";
import { motion, useInView } from "motion/react";

export function SocialProofBadge({ t }: { t: (vi: string, en: string) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const avatars = [
    "from-emerald-400 to-teal-500",
    "from-violet-400 to-purple-500",
    "from-cyan-400 to-blue-500",
    "from-orange-400 to-amber-500",
    "from-pink-400 to-rose-500",
  ];
  const initials = ["TH","ML","KN","VL","BT"];
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3">
      <div className="flex -space-x-2.5">
        {avatars.map((bg, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 22 }}
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center text-white font-bold border-2`}
            style={{ fontSize: "0.58rem", borderColor: "#030B14" }}>
            {initials[i]}
          </motion.div>
        ))}
      </div>
      <div>
        <p className="text-white/65 font-medium" style={{ fontSize: "0.8rem" }}>
          <motion.span key="count" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}>
            +124{" "}
          </motion.span>
          {t("người đang xem hôm nay","people viewing today")}
        </p>
      </div>
    </motion.div>
  );
}
