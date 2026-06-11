import type { RefObject } from "react";
import { motion } from "motion/react";
import type { MotionValue } from "motion/react";
import { MessageSquare, Home, FileText } from "lucide-react";
import { WordReveal } from "@shared/components/WordReveal";

interface HowItWorksSectionProps {
  howRef: RefObject<HTMLElement | null>;
  connectorScale: MotionValue<number>;
  t: (vi: string, en: string) => string;
}

export default function HowItWorksSection({ howRef, connectorScale, t }: HowItWorksSectionProps) {
  return (
    <section ref={howRef} className="py-28 px-6" style={{ background: "rgba(255,255,255,0.015)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16">
          <p className="text-violet-400 mb-3" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em" }}>
            {t("QUY TRÌNH 3 BƯỚC","3 SIMPLE STEPS")}
          </p>
          <h2 className="text-white" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            <WordReveal text={t("Đơn giản từ đầu đến cuối","Simple from start to finish")} />
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="nv-step-connector hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px pointer-events-none"
            style={{ scaleX: connectorScale, originX: 0 }}
          />

          {([
            { step: "01", title: t("Mô tả nhu cầu","Describe your needs"), desc: t("Nhắn tin cho AI Super Broker như nói chuyện bình thường — AI hiểu ngữ cảnh, lọc chính xác.","Chat with AI Super Broker naturally — it understands context and filters precisely."), icon: MessageSquare, color: "#22d3ee", entrance: { x: -40, y: 0 } },
            { step: "02", title: t("Xem & Đặt lịch","View & Schedule"), desc: t("Nhận đề xuất cá nhân hóa, xem virtual tour hoặc đặt lịch thực tế ngay trong app.","Get personalized suggestions, virtual tours or schedule in-person visits in the app."), icon: Home, color: "#34d399", entrance: { x: 0, y: 40 } },
            { step: "03", title: t("Ký HĐ & Quản lý","Sign & Manage"), desc: t("Ký hợp đồng điện tử, thanh toán VietQR, theo dõi sự cố và hóa đơn mọi lúc.","Sign e-contracts, pay via VietQR, track maintenance and invoices anytime."), icon: FileText, color: "#a78bfa", entrance: { x: 40, y: 0 } },
          ] as const).map((h, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, ...h.entrance }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 140, damping: 20 }}
              whileHover={{ y: -4 }}
              className="relative rounded-3xl p-7 border transition-all"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${h.color}30`; (e.currentTarget as HTMLElement).style.background = `${h.color}06`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${h.color}15`, border: `1px solid ${h.color}22` }}>
                  <h.icon size={22} style={{ color: h.color }} />
                </div>
                <span className="font-black" style={{ fontSize: "3.5rem", lineHeight: 1, color: `${h.color}10`, letterSpacing: "-0.05em" }}>{h.step}</span>
              </div>
              <h3 className="text-white mb-2" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{h.title}</h3>
              <p className="text-white/40" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
