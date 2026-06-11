import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Building2, MessageCircle, Globe, Plus, ChevronDown } from "lucide-react";
import type { NavigateFunction } from "react-router";

interface NavbarSectionProps {
  scrolled: boolean;
  navigate: NavigateFunction;
  lang: string;
  toggleLang: () => void;
  onContact: () => void;
  onPostListing: () => void;
  t: (vi: string, en: string) => string;
}

export default function NavbarSection({ scrolled, navigate, lang, toggleLang, onContact, onPostListing, t }: NavbarSectionProps) {
  const [portalsOpen, setPortalsOpen] = useState(false);
  const portalsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (portalsRef.current && !portalsRef.current.contains(e.target as Node)) {
        setPortalsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[9990] transition-all duration-300"
      style={{
        background: scrolled ? "rgba(3,7,18,0.8)" : "rgba(3,7,18,0.45)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 select-none flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center"
            style={{ boxShadow: "0 0 16px rgba(34,211,238,0.3)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <Building2 size={16} className="text-white" />
          </div>
          <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
            NestaViet<span className="text-cyan-400">AI</span>
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {[
            { label: t("Căn hộ","Listings"), href: null },
            { label: t("Tính năng","Features"), href: null },
            { label: t("Bảo mật","Security"), href: "/security" },
            { label: t("Tải app","Download"), href: null },
          ].map(({ label, href }) => (
            <button key={label} onClick={() => href ? navigate(href) : undefined}
              className="px-4 py-2 rounded-lg text-white/45 hover:text-white/80 hover:bg-white/5 transition-all"
              style={{ fontSize: "0.85rem" }}>
              {label}
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={onContact}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/28 hover:text-white/55 transition-all"
            style={{ fontSize: "0.72rem", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
            <MessageCircle size={11} className="text-white/25" />
            <span>{t("Liên hệ", "Contact")}</span>
          </button>
          <button onClick={toggleLang}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-white/40 hover:text-white/75 hover:bg-white/6 transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.67rem", fontWeight: 700 }}>
            {lang === "vi" ? "EN" : "VI"}
          </button>

          <button onClick={() => navigate("/tenant/login")}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white/65 hover:text-white transition-all"
            style={{ fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.11)", background: "rgba(255,255,255,0.04)" }}>
            {t("Cư dân","Tenant")}
          </button>

          {/* Portal dropdown */}
          <div className="relative hidden md:block" ref={portalsRef}>
            <button
              onClick={() => setPortalsOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-white/55 hover:text-white/80 transition-all"
              style={{ fontSize: "0.78rem", border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)" }}>
              <Globe size={12} />{t("Cổng khác","Portals")}
              <ChevronDown size={10} style={{ transform: portalsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </button>
            {portalsOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
                style={{ background: "rgba(3,7,18,0.97)", backdropFilter: "blur(16px)" }}>
                {[
                  { label: t("Cổng Chủ Nhà","Landlord Portal"),    sub: "landlord.nestaviet.vn", path: "/landlord/login", color: "text-amber-400"   },
                  { label: t("Quản lý toà nhà","Building Manager"), sub: "manager.nestaviet.vn",  path: "/manager/login",  color: "text-emerald-400" },
                  { label: "Developer Portal",                       sub: "dev.nestaviet.vn",      path: "/dev/login",      color: "text-blue-400"    },
                  { label: "Admin Portal",                           sub: "admin.nestaviet.vn",    path: "/admin/login",    color: "text-violet-400"  },
                ].map(p => (
                  <button key={p.path} onClick={() => { navigate(p.path); setPortalsOpen(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/6 last:border-0">
                    <p className={`font-semibold ${p.color}`} style={{ fontSize: "0.8rem" }}>{p.label}</p>
                    <p className="text-white/22 font-mono mt-0.5" style={{ fontSize: "0.62rem" }}>{p.sub}</p>
                  </button>
                ))}
                <button onClick={() => { navigate("/portals"); setPortalsOpen(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-t border-white/10">
                  <p className="font-semibold text-white/50" style={{ fontSize: "0.8rem" }}>🗂 {t("Tất cả cổng","All Portals")}</p>
                  <p className="text-white/22 font-mono mt-0.5" style={{ fontSize: "0.62rem" }}>nestaviet.vn/portals</p>
                </button>
              </div>
            )}
          </div>

          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={onPostListing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white font-semibold"
            style={{ fontSize: "0.83rem", background: "linear-gradient(135deg,#22d3ee,#3b82f6)", boxShadow: "0 0 18px rgba(34,211,238,0.25)" }}>
            {t("Đăng tin","Post Listing")}<Plus size={13} />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
