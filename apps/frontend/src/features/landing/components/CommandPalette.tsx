import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Search, Home, UserPlus, LogIn, Building2, Globe, Shield, ArrowRight, ChevronRight,
} from "lucide-react";
import { LISTINGS } from "../data";

export function CommandPalette({ onClose, onLang, onGetStarted, t, navigate }: {
  onClose: () => void;
  onLang: () => void;
  onGetStarted: () => void;
  t: (vi: string, en: string) => string;
  navigate: (path: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const navCommands = [
    { type: "nav",    icon: Home,         label: t("Trang chủ","Home"),                      action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { type: "nav",    icon: UserPlus,     label: t("Đăng ký cư dân","Tenant signup"),         action: () => navigate("/tenant/register") },
    { type: "nav",    icon: LogIn,        label: t("Đăng nhập cư dân","Tenant login"),         action: () => navigate("/tenant/login") },
    { type: "nav",    icon: Building2,    label: t("Đăng ký chủ nhà","Landlord signup"),       action: () => navigate("/landlord/register") },
    { type: "nav",    icon: Globe,        label: "Manager Portal",                             action: () => navigate("/manager/login") },
    { type: "nav",    icon: Globe,        label: "Developer Portal",                           action: () => navigate("/dev/login") },
    { type: "nav",    icon: Shield,       label: t("Trang bảo mật","Security page"),           action: () => navigate("/security") },
    { type: "action", icon: Globe,        label: t("Đổi ngôn ngữ EN ↔ VI","Toggle EN ↔ VI"), action: () => { onLang(); onClose(); } },
    { type: "action", icon: ArrowRight,   label: t("Bắt đầu ngay","Get started free"),         action: () => { onGetStarted(); onClose(); } },
  ];

  const listingHits = query.trim().length >= 1
    ? LISTINGS.filter(l =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.district.toLowerCase().includes(query.toLowerCase()) ||
        l.amenities.some(a => a.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 4)
    : [];

  const navHits = query.trim().length >= 1
    ? navCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : navCommands;

  type Result = { type: string; label: string; sub: string; icon: typeof Home; action: () => void };
  const allResults: Result[] = [
    ...listingHits.map(l => ({ type: "listing", label: l.name, sub: `${l.district} · ${l.priceFrom}–${l.priceTo}M/tháng`, icon: Home, action: () => { onGetStarted(); onClose(); } })),
    ...navHits.map(c => ({ ...c, sub: "" })),
  ];

  const go = (i: number) => { allResults[i]?.action(); onClose(); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-start justify-center pt-[16vh] px-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(16px)" }}
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: -24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: -12 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ background: "rgba(4,9,20,0.98)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(34,211,238,0.06)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <Search size={16} className="text-white/28 flex-shrink-0" />
          <input ref={inputRef} type="text"
            placeholder={t("Tìm căn hộ, tính năng, điều hướng...","Search apartments, features, navigate...")}
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={e => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, allResults.length - 1)); }
              if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
              if (e.key === "Enter")     { go(activeIdx); }
              if (e.key === "Escape")    { onClose(); }
            }}
            className="flex-1 bg-transparent text-white placeholder-white/22 outline-none"
            style={{ fontSize: "0.95rem" }} />
          <span className="text-white/18 font-mono border border-white/10 px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontSize: "0.65rem" }}>ESC</span>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {listingHits.length > 0 && (
            <p className="px-5 py-1.5 text-white/22" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em" }}>
              {t("CĂN HỘ","LISTINGS")}
            </p>
          )}
          {allResults.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-white/25" style={{ fontSize: "0.85rem" }}>{t("Không tìm thấy","No results")}</p>
            </div>
          )}
          {allResults.map((r, i) => {
            const Icon = r.icon;
            const isListing = r.type === "listing";
            return (
              <button key={i}
                onClick={() => go(i)}
                onMouseEnter={() => setActiveIdx(i)}
                className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors nv-cmd-result"
                style={{ background: i === activeIdx ? "rgba(34,211,238,0.07)" : undefined }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: isListing ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)" }}>
                  <Icon size={13} className={isListing ? "text-emerald-400" : "text-white/35"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80" style={{ fontSize: "0.85rem" }}>{r.label}</p>
                  {r.sub && <p className="text-white/28 truncate" style={{ fontSize: "0.7rem" }}>{r.sub}</p>}
                </div>
                {i === activeIdx && <ChevronRight size={13} className="text-white/22 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 px-5 py-3 border-t" style={{ background: "rgba(0,0,0,0.25)", borderColor: "rgba(255,255,255,0.06)" }}>
          {([["↑↓", t("điều hướng","navigate")], ["↵", t("chọn","select")], ["esc", t("đóng","close")]] as [string, string][]).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="text-white/18 font-mono border border-white/10 px-1.5 py-0.5 rounded" style={{ fontSize: "0.6rem" }}>{key}</span>
              <span className="text-white/20" style={{ fontSize: "0.66rem" }}>{label}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/18 font-mono" style={{ fontSize: "0.6rem" }}>NestaVietAI</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
