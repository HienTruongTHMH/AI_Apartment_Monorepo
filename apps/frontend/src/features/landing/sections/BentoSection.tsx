import { motion } from "motion/react";
import { Search, QrCode, FileText, Shield } from "lucide-react";
import { StatCounter } from "@shared/components/StatCounter";
import { WordReveal } from "@shared/components/WordReveal";
import { BentoAICard } from "../components";
import { REAL_LISTINGS, bentoContainerVariants, bentoCardVariants } from "../data";

interface BentoSectionProps {
  t: (vi: string, en: string) => string;
}

export default function BentoSection({ t }: BentoSectionProps) {
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14">
          <p className="text-cyan-400 mb-3" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em" }}>
            {t("TÍNH NĂNG NỔI BẬT","PLATFORM FEATURES")}
          </p>
          <h2 className="text-white max-w-3xl mx-auto" style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            <WordReveal text={t("Mọi thứ bạn cần,","Everything you need,")} />
            <br />
            <span style={{ background: "linear-gradient(110deg,#22d3ee,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              <WordReveal text={t("trong một nền tảng.","in one platform.")} />
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-12 gap-4"
          variants={bentoContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}>

          <BentoAICard t={t} />

          <motion.div
            variants={bentoCardVariants}
            className="col-span-12 lg:col-span-5 rounded-3xl p-7 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.06) 100%)", border: "1px solid rgba(139,92,246,0.18)" }}>
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-mono" style={{ fontSize: "0.6rem", fontWeight: 700 }}>LIVE</span>
            </div>
            <p className="text-white/40 mb-1" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{t("Nền tảng tính đến hôm nay","Platform stats today")}</p>
            <div className="grid grid-cols-2 gap-5 mt-4">
              <StatCounter target={REAL_LISTINGS.length} suffix="+" color="#22d3ee" label={t("Tin đăng thực tế","Real listings")} />
              <StatCounter target={98}    suffix="%" color="#34d399" label={t("Hài lòng","Satisfaction")} />
              <StatCounter target={3200}  suffix="+" color="#a78bfa" label={t("GD/tháng","Txn/month")} />
              <div>
                <p className="font-black" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", letterSpacing: "-0.04em", color: "#fbbf24" }}>1.2s</p>
                <p className="text-white/38" style={{ fontSize: "0.75rem" }}>{t("Phản hồi AI","AI latency")}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={bentoCardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 28 } }}
            className="col-span-12 md:col-span-4 rounded-3xl p-6 relative overflow-hidden cursor-pointer nv-bento-card nv-inner-shimmer"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.18)" }}>
              <Search size={20} style={{ color: "#22d3ee" }} />
            </div>
            <h3 className="text-white font-bold mb-2" style={{ fontSize: "1.1rem" }}>{t("Tìm kiếm thông minh","Smart Search")}</h3>
            <p className="text-white/40" style={{ fontSize: "0.83rem", lineHeight: 1.65 }}>
              {t("Nhắn tin tự nhiên — AI Super Broker hiểu ngữ cảnh và lọc căn hộ phù hợp trong giây lát.","Chat naturally — AI Super Broker understands context and finds matching apartments in seconds.")}
            </p>
          </motion.div>

          <motion.div
            variants={bentoCardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 28 } }}
            className="col-span-12 md:col-span-4 rounded-3xl p-6 relative overflow-hidden cursor-pointer nv-bento-card nv-inner-shimmer"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.18)" }}>
              <QrCode size={20} style={{ color: "#10b981" }} />
            </div>
            <h3 className="text-white font-bold mb-2" style={{ fontSize: "1.1rem" }}>{t("Thanh toán VietQR","VietQR Payments")}</h3>
            <p className="text-white/40" style={{ fontSize: "0.83rem", lineHeight: 1.65 }}>
              {t("Hóa đơn tự động xuất VietQR, gửi email, reconcile thanh toán và báo cáo dòng tiền real-time.","Auto-generate VietQR invoices, email, payment reconciliation and cash-flow reports in real-time.")}
            </p>
          </motion.div>

          <motion.div
            variants={bentoCardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 28 } }}
            className="col-span-12 md:col-span-4 rounded-3xl p-6 relative overflow-hidden cursor-pointer nv-bento-card nv-inner-shimmer"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.18)" }}>
              <FileText size={20} style={{ color: "#a78bfa" }} />
            </div>
            <h3 className="text-white font-bold mb-2" style={{ fontSize: "1.1rem" }}>{t("Hợp đồng điện tử","E-Contracts")}</h3>
            <p className="text-white/40" style={{ fontSize: "0.83rem", lineHeight: 1.65 }}>
              {t("Ký số trực tuyến, lưu trữ an toàn, nhắc gia hạn tự động. Không cần in ấn, không cần gặp mặt.","Online e-signing, secure storage, auto renewal reminders. No printing, no in-person required.")}
            </p>
          </motion.div>

          <motion.div
            variants={bentoCardVariants}
            className="col-span-12 rounded-3xl px-8 py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <Shield size={22} style={{ color: "#ef4444" }} />
              </div>
              <div>
                <h3 className="text-white font-bold" style={{ fontSize: "1.05rem" }}>{t("Bảo mật cấp doanh nghiệp","Enterprise-grade security")}</h3>
                <p className="text-white/38" style={{ fontSize: "0.82rem" }}>
                  {t("TLS 1.3 · OWASP Top 10 · WAF · Zero-Trust · AES-256 · SIEM 24/7","TLS 1.3 · OWASP Top 10 · WAF · Zero-Trust · AES-256 · SIEM 24/7")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["A+ SSL","OWASP","AES-256","Zero-Trust","24/7"].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full font-semibold" style={{ fontSize: "0.72rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>{tag}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
