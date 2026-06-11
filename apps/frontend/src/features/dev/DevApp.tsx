import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity, AlertTriangle, Bot, Database,
  Flag, GitBranch, Globe, Layers, LogOut,
  Server, Settings, Terminal, Bell,
} from "lucide-react";
import { useLang } from "@shared/hooks/useLang";
import DevTabContent from "@features/dev/components/DevTabContent";
import { type DevTab, API_LOGS, AGENTS, ERRORS, INITIAL_FEATURE_FLAGS } from "@features/dev/components/DevData";

const AUTH_KEY = "nv_dev_session";
function getSession() {
  try { return JSON.parse(sessionStorage.getItem(AUTH_KEY) || "{}"); } catch { return {}; }
}

export function DevApp() {
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang("dev");
  const [tab, setTab] = useState<DevTab>("overview");
  const session = getSession();

  useEffect(() => {
    if (!session.expiry || Date.now() >= session.expiry) navigate("/dev/login", { replace: true });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    navigate("/dev/login", { replace: true });
  };

  const navItems: { id: DevTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "overview",  label: "Overview",      icon: Activity },
    { id: "api_logs",  label: "API Logs",       icon: Layers,    badge: API_LOGS.filter(l => l.status >= 400).length },
    { id: "agents",    label: "AI Agents",      icon: Bot,       badge: AGENTS.filter(a => a.status === "warning").length },
    { id: "database",  label: "Database",       icon: Database },
    { id: "deploys",   label: "Deployments",    icon: GitBranch },
    { id: "flags",     label: "Feature Flags",  icon: Flag,      badge: INITIAL_FEATURE_FLAGS.filter(f => !f.enabled).length },
    { id: "errors",    label: "Errors",         icon: AlertTriangle, badge: ERRORS.filter(e => !e.resolved).length },
    { id: "config",    label: "Config",         icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#030B14] text-white overflow-hidden font-mono">
      <div className="nv-scan-line" style={{ zIndex: 50 }} />

      <aside className="w-52 flex-shrink-0 flex flex-col border-r border-blue-500/12 relative z-10" style={{ background: "rgba(1,5,12,0.99)" }}>
        <div className="p-4 border-b border-blue-500/10">
          <motion.div
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center nv-glow-pulse-blue" style={{ boxShadow: "0 0 16px rgba(59,130,246,0.35)" }}>
              <Terminal size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold" style={{ fontSize: "0.82rem" }}>Nesta<span className="text-blue-400">Dev</span></p>
              <p className="text-blue-400/50" style={{ fontSize: "0.6rem" }}>console v2.4.1</p>
            </div>
          </motion.div>
        </div>

        <div className="p-3 border-b border-blue-500/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 22 }}
            className="flex items-center gap-2.5 bg-blue-500/6 border border-blue-500/15 rounded-xl p-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xs nv-status-online">
              {session.name?.[0] || "D"}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold truncate" style={{ fontSize: "0.76rem" }}>{session.name || "Dev"}</p>
              <p className="text-blue-300/40 truncate" style={{ fontSize: "0.6rem" }}>{session.level || "Engineer"}</p>
            </div>
          </motion.div>
        </div>

        <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
          {navItems.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => setTab(item.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.04, type: "spring", stiffness: 280, damping: 26 }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.96 }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors text-left relative overflow-hidden ${
                tab === item.id
                  ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                  : "text-white/35 hover:text-white/65 hover:bg-white/4"
              }`}
              style={{ fontSize: "0.78rem" }}
            >
              {tab === item.id && (
                <motion.div
                  layoutId="dev-tab-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-blue-400"
                />
              )}
              <item.icon size={13} className={tab === item.id ? "text-blue-400" : ""} />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center nv-badge-pop" style={{ fontSize: "0.52rem" }}>{item.badge}</span>
              ) : null}
            </motion.button>
          ))}
        </nav>

        <div className="p-2.5 border-t border-blue-500/10 space-y-1">
          <button onClick={toggleLang} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/25 hover:text-white/55 hover:bg-white/4 transition-all" style={{ fontSize: "0.74rem" }}>
            <Globe size={13} />
            {lang === "vi" ? "English" : "Tiếng Việt"}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400/55 hover:text-red-400 hover:bg-red-500/8 transition-all" style={{ fontSize: "0.74rem" }}>
            <LogOut size={13} />
            {t("Đăng xuất", "Sign Out")}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="flex items-center justify-between px-5 py-3 border-b border-blue-500/10" style={{ background: "rgba(1,5,12,0.85)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-2">
            <span className="text-blue-500/40 font-mono" style={{ fontSize: "0.75rem" }}>$</span>
            <motion.span
              key={tab}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="text-blue-300/70 font-mono" style={{ fontSize: "0.76rem" }}
            >
              nv-console <span className="text-white/35">--tab</span> <span className="text-cyan-400">{tab}</span>
            </motion.span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 nv-status-online" />
              <span className="text-emerald-400/60 font-mono" style={{ fontSize: "0.7rem" }}>production</span>
            </div>
            <motion.div whileHover={{ scale: 1.15, rotate: 10 }} whileTap={{ scale: 0.9 }} className="cursor-pointer">
              <Bell size={15} className="text-white/35 hover:text-white/65 transition-colors" />
            </motion.div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <DevTabContent tab={tab} t={t} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
