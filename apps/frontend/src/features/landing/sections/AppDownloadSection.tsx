import { motion } from "motion/react";
import { Smartphone } from "lucide-react";

interface AppDownloadSectionProps {
  t: (vi: string, en: string) => string;
}

export default function AppDownloadSection({ t }: AppDownloadSectionProps) {
  return (
    <section className="py-28 px-6" style={{ background: "rgba(255,255,255,0.015)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-3xl p-10 md:p-14 border flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="absolute -left-24 -top-16 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)" }} />
          <div className="absolute -right-24 -bottom-16 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />
          <div className="relative flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
              <Smartphone size={12} className="text-cyan-400" />
              <span className="text-white/45" style={{ fontSize: "0.73rem" }}>iOS & Android</span>
            </div>
            <h2 className="text-white mb-3" style={{ fontSize: "clamp(1.5rem,2.5vw,2.2rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
              {t("Quản lý mọi thứ trong","Manage everything in the")}
              {" "}<span style={{ background: "linear-gradient(90deg,#22d3ee,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {t("lòng bàn tay","palm of your hand")}
              </span>
            </h2>
            <p className="text-white/38 mb-7 max-w-md mx-auto md:mx-0" style={{ fontSize: "0.9rem", lineHeight: 1.75 }}>
              {t("Đồng bộ hoàn toàn giữa web và app — nhận thông báo thanh toán, theo dõi bảo trì và xem hợp đồng mọi lúc.","Fully synced between web and app — get payment alerts, track maintenance and view contracts anywhere.")}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {[
                { store: "App Store", icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg> },
                { store: "Google Play", icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"><path d="M3.18 23.4c.3.17.64.2.95.08l11.5-6.64-2.36-2.36L3.18 23.4zm15.14-8.74L5.69 7.91 3.18.6c-.3-.12-.64-.09-.95.08L13.23 11.7l5.09 2.96zm1.56-5.5L16.72 7.4l-2.93-1.7L2.23.57c-.43-.25-.95-.13-1.23.25v22.36c.28.38.8.5 1.23.25l11.55-6.67 2.93-1.7 3.16-1.83c.68-.4.68-1.4.01-1.79v.01z" fill="#34A853" /></svg> },
              ].map(({ store, icon }) => (
                <button key={store} className="flex items-center gap-3 rounded-xl px-5 py-3 border border-white/9 hover:border-white/18 transition-all" style={{ background: "rgba(255,255,255,0.045)" }}>
                  <span className="text-white">{icon}</span>
                  <div className="text-left">
                    <p className="text-white/30" style={{ fontSize: "0.6rem" }}>Tải về trên</p>
                    <p className="text-white font-semibold" style={{ fontSize: "0.88rem" }}>{store}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Phone mockup */}
          <div className="relative flex-shrink-0">
            <div className="w-48 h-80 rounded-[2.5rem] border-2 border-white/10 shadow-2xl overflow-hidden"
              style={{ background: "linear-gradient(160deg,#0d1629 0%,#030B14 100%)" }}>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-white/12" />
              <div className="absolute inset-0 pt-10 px-3">
                <div className="h-3.5 w-3/4 rounded-md bg-white/7 mb-2" />
                <div className="h-2.5 w-1/2 rounded-md bg-white/5 mb-4" />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[["from-emerald-500 to-teal-500","45.2M ₫"],["from-violet-500 to-purple-500","92%"]].map(([g,v],i) => (
                    <div key={i} className={`rounded-xl bg-gradient-to-br ${g} p-2.5`}>
                      <p className="text-white font-bold" style={{ fontSize: "0.75rem" }}>{v}</p>
                      <p className="text-white/50" style={{ fontSize: "0.5rem" }}>Live</p>
                    </div>
                  ))}
                </div>
                {[0,1,2].map(i => (
                  <div key={i} className="h-7 rounded-lg bg-white/5 flex items-center px-2 gap-2 mb-1.5">
                    <div className="w-3.5 h-3.5 rounded bg-white/8 flex-shrink-0" />
                    <div className="flex-1 h-1.5 rounded bg-white/7" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full" style={{ background: "rgba(34,211,238,0.18)", filter: "blur(10px)" }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
