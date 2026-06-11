import type { RefObject } from "react";
import { motion } from "motion/react";
import type { MotionValue } from "motion/react";
import { Search, MapPin, X, Bot, ArrowRight, Play, ChevronRight } from "lucide-react";
import { HeroLiveWidget } from "../components";
import type { Listing } from "@features/listing/types";

interface HeroSectionProps {
  heroRef: RefObject<HTMLElement | null>;
  headlineY: MotionValue<number>;
  subTextY: MotionValue<number>;
  widgetY: MotionValue<number>;
  widgetOpacity: MotionValue<number>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchFocused: boolean;
  setSearchFocused: (f: boolean) => void;
  setSubmittedQuery: (q: string) => void;
  handleSearchSubmit: () => void;
  onAskAI: () => void;
  listings: Listing[];
  totalListings: number;
  onGetStarted: () => void;
  t: (vi: string, en: string) => string;
}

export default function HeroSection({
  heroRef, headlineY, subTextY, widgetY, widgetOpacity,
  searchQuery, setSearchQuery, searchFocused, setSearchFocused,
  setSubmittedQuery, handleSearchSubmit, onAskAI, listings, totalListings,
  onGetStarted, t,
}: HeroSectionProps) {
  return (
    <section ref={heroRef} className="relative min-h-[78vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-10 overflow-visible">

      <div className="absolute top-[20%] left-[8%] w-48 h-48 rounded-full pointer-events-none nv-orb-1"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.22) 0%, transparent 70%)", filter: "blur(12px)" }} />
      <div className="absolute bottom-[25%] right-[10%] w-64 h-64 rounded-full pointer-events-none nv-orb-2"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)", filter: "blur(16px)" }} />
      <div className="absolute top-[10%] left-[5%] w-[200px] h-[200px] rounded-full pointer-events-none nv-orb-1"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.28) 0%, transparent 60%)", filter: "blur(8px)", opacity: 0.3 }} />
      <div className="absolute bottom-[20%] right-[8%] w-[150px] h-[150px] rounded-full pointer-events-none nv-orb-2"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.32) 0%, transparent 60%)", filter: "blur(6px)", opacity: 0.32 }} />

      <motion.div className="hidden lg:block absolute right-8 top-36 z-10" style={{ y: widgetY, opacity: widgetOpacity }}>
        <HeroLiveWidget />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 22 }}
        className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.035]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white/55" style={{ fontSize: "0.76rem", fontWeight: 500 }}>
          {t("Nền tảng PropTech #1 Việt Nam 2025","#1 PropTech Platform Vietnam 2025")}
        </span>
      </motion.div>

      <motion.div style={{ y: headlineY }} className="relative z-10 max-w-5xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: 60, filter: "blur(16px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.16, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-white text-center"
          style={{ fontSize: "clamp(2rem,5.5vw,4rem)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.045em" }}>
          {t("THUÊ CĂN HỘ","RENT SMARTER")}
          <br />
          <span className="nv-hero-gradient">
            {t("THÔNG MINH VỚI AI","POWERED BY AI")}
          </span>
        </motion.h1>
      </motion.div>

      <motion.div style={{ y: subTextY }} className="mt-5 max-w-xl mx-auto w-full">
        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.32, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/40 text-center"
          style={{ fontSize: "clamp(0.95rem,1.8vw,1.1rem)", lineHeight: 1.75 }}>
          {t(
            "Hệ thống Multi-Agent AI tự động hóa toàn bộ — từ kiểm duyệt, tư vấn đến quản lý hợp đồng và thu tiền.",
            "Multi-Agent AI automates the entire rental lifecycle — verification, advisory, contracts, and payments."
          )}
        </motion.p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.44, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-7 w-full max-w-2xl">
        <div className="flex gap-2">
          <div className="flex items-center gap-3 flex-1 rounded-2xl px-5 py-3.5 border transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: searchFocused ? "rgba(34,211,238,0.45)" : "rgba(255,255,255,0.1)",
              boxShadow: searchFocused ? "0 0 0 4px rgba(34,211,238,0.07), 0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.2)",
              backdropFilter: "blur(20px)",
            }}>
            <Search size={17} className="text-white/28 flex-shrink-0" />
            <input
              type="text"
              placeholder={t("Nhập địa điểm, tên chung cư...","Search by location or building name...")}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              onKeyDown={e => { if (e.key === "Enter") handleSearchSubmit(); }}
              className="bg-transparent flex-1 text-white placeholder-white/22 outline-none"
              style={{ fontSize: "0.92rem" }}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setSubmittedQuery(""); }} className="text-white/28 hover:text-white/55 transition-colors flex-shrink-0">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={onAskAI}
            title={t("Hỏi AI", "Ask AI")}
            className="flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              width: 50, height: 50, borderRadius: "1rem",
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.35)",
              color: "#a78bfa", cursor: "pointer",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.28)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.15)"; }}
          >
            <Bot size={18} />
          </button>
          <button onClick={handleSearchSubmit}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-white hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ fontSize: "0.88rem", background: "linear-gradient(135deg,#22d3ee,#3b82f6)", boxShadow: "0 0 20px rgba(34,211,238,0.22)" }}>
            <Search size={15} />{t("Tìm","Search")}
          </button>
        </div>

        {/* Search dropdown */}
        {searchFocused && searchQuery.trim().length >= 2 && (() => {
          const q = searchQuery.trim().toLowerCase();
          const results = listings.filter(l =>
            l.title.toLowerCase().includes(q) ||
            l.district.toLowerCase().includes(q) ||
            l.province.toLowerCase().includes(q) ||
            l.amenities.some(a => a.toLowerCase().includes(q))
          ).slice(0, 5);
          return (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-white/12 overflow-hidden z-50"
              style={{ background: "rgba(5,10,24,0.97)", backdropFilter: "blur(24px)" }}>
              {results.length > 0 ? (
                <>
                  <div className="px-4 py-2.5 border-b border-white/7">
                    <span className="text-white/35" style={{ fontSize: "0.72rem" }}>{results.length} kết quả thực</span>
                  </div>
                  {results.map(apt => (
                    <button key={apt.id} onClick={() => { setSearchQuery(apt.title); setSubmittedQuery(apt.title); setSearchFocused(false); }}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={apt.image} alt={apt.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white truncate" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{apt.title}</p>
                        <p className="text-white/40 flex items-center gap-1" style={{ fontSize: "0.72rem" }}>
                          <MapPin size={10} />{apt.district} · {apt.price}
                        </p>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: "rgba(34,211,238,0.15)", color: "#22d3ee", fontSize: "0.62rem", fontWeight: 600 }}>{apt.type}</span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 py-3 border-b border-white/7">
                  <p className="text-white/45" style={{ fontSize: "0.8rem" }}>Không tìm thấy "{searchQuery}"</p>
                </div>
              )}
              <button onClick={handleSearchSubmit}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-500/8 transition-colors">
                <span className="flex items-center gap-2 text-cyan-400" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  <Bot size={15} />Tìm kết quả cho "{searchQuery}"
                </span>
                <ChevronRight size={14} className="text-cyan-400/60" />
              </button>
            </motion.div>
          );
        })()}
      </motion.div>

      {/* Trust stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.58, duration: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-6 mt-7">
        {[
          { val: `${totalListings}+`, label: t("Tin đăng thực tế","Real listings"), color: "#22d3ee" },
          { val: "4.9★",     label: t("App Store","App Store"),               color: "#fbbf24" },
          { val: "98%",      label: t("Khách hài lòng","Satisfaction rate"),  color: "#34d399" },
        ].map(({ val, label, color }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="text-white font-bold" style={{ fontSize: "1.05rem", color }}>{val}</span>
            <span className="text-white/35" style={{ fontSize: "0.78rem" }}>{label}</span>
          </div>
        ))}
      </motion.div>

      {/* CTA buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-5">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          onClick={onGetStarted}
          className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white hover:opacity-90 transition-opacity"
          style={{ fontSize: "0.92rem", background: "linear-gradient(135deg,#34d399,#22d3ee)", boxShadow: "0 0 24px rgba(52,211,153,0.22)" }}>
          {t("Đăng ký miễn phí","Sign up free")}<ArrowRight size={16} />
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.45 }}
          onClick={onGetStarted}
          className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
          style={{ fontSize: "0.9rem" }}>
          <Play size={14} className="text-violet-400" />{t("Xem demo","Watch demo")}
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/18"
        style={{ fontSize: "0.62rem" }}>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
          className="w-5 h-8 rounded-full border border-white/12 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
