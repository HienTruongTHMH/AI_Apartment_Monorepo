import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Users, Wrench, Zap, KeyRound, Megaphone,
  DollarSign, Settings, LogOut, Bell, Globe, Building,
} from "lucide-react";
import { useLang } from "@shared/hooks/useLang";
import ManagerTabContent, {
  type ManagerTab,
  RESIDENTS,
  REQUESTS,
} from "@features/manager/components/ManagerTabContent";

const AUTH_KEY = "nv_manager_session";
function getSession() {
  try { return JSON.parse(sessionStorage.getItem(AUTH_KEY) || "{}"); } catch { return {}; }
}

export function ManagerApp() {
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang("manager");
  const [tab, setTab] = useState<ManagerTab>("dashboard");
  const [search, setSearch] = useState("");
  const session = getSession();

  useEffect(() => {
    if (!session.expiry || Date.now() >= session.expiry) navigate("/manager/login", { replace: true });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    navigate("/manager/login", { replace: true });
  };

  const navItems: { id: ManagerTab; label: string; labelEn: string; icon: React.ElementType; badge?: number }[] = [
    { id: "dashboard",     label: "Tổng quan",   labelEn: "Overview",      icon: LayoutDashboard },
    { id: "residents",     label: "Cư dân",       labelEn: "Residents",     icon: Users,          badge: RESIDENTS.filter(r => r.status === "late").length },
    { id: "requests",      label: "Yêu cầu",      labelEn: "Requests",      icon: Wrench,         badge: REQUESTS.filter(r => r.status === "pending").length },
    { id: "utilities",     label: "Tiện ích",      labelEn: "Utilities",     icon: Zap },
    { id: "access",        label: "Kiểm soát",    labelEn: "Access",        icon: KeyRound },
    { id: "announcements", label: "Thông báo",    labelEn: "Announcements", icon: Megaphone },
    { id: "finance",       label: "Tài chính",    labelEn: "Finance",       icon: DollarSign },
    { id: "settings",      label: "Cài đặt",      labelEn: "Settings",      icon: Settings },
  ];

  const tabTitles: Record<ManagerTab, [string, string]> = {
    dashboard:     ["Tổng quan hoạt động", "Operations Overview"],
    residents:     ["Quản lý cư dân",      "Resident Management"],
    requests:      ["Yêu cầu bảo trì",     "Maintenance Requests"],
    utilities:     ["Tiện ích & Đồng hồ",  "Utilities & Meters"],
    access:        ["Kiểm soát ra vào",     "Access Control"],
    announcements: ["Thông báo toà nhà",   "Building Announcements"],
    finance:       ["Tài chính tháng",      "Monthly Finance"],
    settings:      ["Cài đặt tài khoản",   "Account Settings"],
  };

  return (
    <div className="flex h-screen bg-[#0A1628] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-emerald-500/8" style={{ background: "rgba(4,12,18,0.99)" }}>
        {/* Logo */}
        <div className="p-4 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center nv-glow-pulse-emerald" style={{ boxShadow: "0 0 16px rgba(16,185,129,0.3)" }}>
              <Building size={15} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold" style={{ fontSize: "0.82rem" }}>NestaViet<span className="text-emerald-400">AI</span></p>
              <p className="text-emerald-400/70" style={{ fontSize: "0.62rem" }}>Manager Portal</p>
            </div>
          </motion.div>
        </div>

        {/* User card */}
        <div className="p-3 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 22 }}
            className="flex items-center gap-2.5 bg-emerald-500/8 border border-emerald-500/15 rounded-xl p-2.5"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm nv-status-online">
              {session.name?.[0] || "M"}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold truncate" style={{ fontSize: "0.78rem" }}>{session.name || "Manager"}</p>
              <p className="text-emerald-400/50 truncate" style={{ fontSize: "0.62rem" }}>{session.building || "Toà nhà"}</p>
            </div>
          </motion.div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => setTab(item.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.04, type: "spring", stiffness: 280, damping: 26 }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors text-left relative overflow-hidden ${
                tab === item.id
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                  : "text-white/45 hover:text-white/80 hover:bg-white/4"
              }`}
              style={{ fontSize: "0.82rem" }}
            >
              {tab === item.id && (
                <motion.div
                  layoutId="manager-tab-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-emerald-400"
                />
              )}
              <item.icon size={15} className={tab === item.id ? "text-emerald-400" : ""} />
              <span className="flex-1">{lang === "vi" ? item.label : item.labelEn}</span>
              {item.badge ? (
                <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center nv-badge-pop" style={{ fontSize: "0.58rem" }}>{item.badge}</span>
              ) : null}
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <button onClick={toggleLang} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/35 hover:text-white/65 hover:bg-white/4 transition-all" style={{ fontSize: "0.78rem" }}>
            <Globe size={14} />
            {lang === "vi" ? "English" : "Tiếng Việt"}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-all" style={{ fontSize: "0.78rem" }}>
            <LogOut size={14} />
            {t("Đăng xuất", "Sign Out")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-white/5" style={{ background: "rgba(4,12,18,0.8)", backdropFilter: "blur(16px)" }}>
          <div>
            <p className="text-white/30" style={{ fontSize: "0.68rem" }}>30/04/2026 • NestaViet Manager</p>
            <motion.h2
              key={tab}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="text-white font-bold" style={{ fontSize: "1.05rem" }}
            >
              {t(...tabTitles[tab])}
            </motion.h2>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative cursor-pointer">
              <Bell size={18} className="text-white/45 hover:text-white/80 transition-colors" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-white nv-badge-pop" style={{ fontSize: "0.5rem" }}>3</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer" style={{ boxShadow: "0 0 12px rgba(16,185,129,0.3)" }}>
              {session.name?.[0] || "M"}
            </motion.div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <ManagerTabContent
                tab={tab}
                setTab={setTab}
                search={search}
                setSearch={setSearch}
                t={t}
                session={session}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
