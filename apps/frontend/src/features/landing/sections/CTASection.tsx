import type { RefObject } from "react";
import { motion } from "motion/react";
import type { MotionValue } from "motion/react";
import { ArrowRight, Building2 } from "lucide-react";
import { WordReveal } from "@shared/components/WordReveal";

interface CTASectionProps {
  ctaRef: RefObject<HTMLElement | null>;
  ctaGlowX: MotionValue<string>;
  onGetStarted: () => void;
  t: (vi: string, en: string) => string;
}

export default function CTASection({ ctaRef, ctaGlowX, onGetStarted, t }: CTASectionProps) {
  return (
    <section ref={ctaRef} className="py-28 px-6 relative overflow-hidden">
      <motion.div
        className="absolute pointer-events-none"
        style={{ x: ctaGlowX, inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,211,238,0.06) 0%, transparent 70%)" }}
      />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/50" style={{ fontSize: "0.75rem" }}>{t("Miễn phí đăng ký — không cần thẻ tín dụng","Free to join — no credit card needed")}</span>
          </div>
          <h2 className="text-white mb-5" style={{ fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
            <WordReveal text={t("Bắt đầu ngay hôm nay","Start today,")} /><br />
            <span style={{ background: "linear-gradient(110deg,#34d399 0%,#22d3ee 50%,#818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              <WordReveal text={t("hoàn toàn miễn phí","completely free.")} />
            </span>
          </h2>
          <p className="text-white/38 mb-10 max-w-lg mx-auto" style={{ fontSize: "1rem", lineHeight: 1.75 }}>
            {t("Kết hợp với AI Super Broker để chuẩn hoá thông tin căn hộ nơi bạn ở. Quản lý mọi thứ từ một nơi.","Combine with AI Super Broker to standardize your apartment info. Manage everything from one place.")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 44px rgba(34,211,238,0.38)" }}
              whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: ["0 0 30px rgba(34,211,238,0.22)", "0 0 60px rgba(34,211,238,0.45)", "0 0 30px rgba(34,211,238,0.22)"] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              onClick={onGetStarted}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white"
              style={{ fontSize: "0.95rem", background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}>
              {t("Bắt đầu ngay — miễn phí","Get started — free")}<ArrowRight size={17} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onGetStarted}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white/60 border border-white/12 hover:text-white/85 hover:border-white/22 transition-all"
              style={{ fontSize: "0.95rem" }}>
              <Building2 size={16} />{t("Đăng ký quản lý tòa nhà","Register building manager")}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
