import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot, BarChart3, Building2,
  ChevronLeft, Clock, GitBranch,
  Layers, LogOut, RefreshCw,
  Settings, Terminal, Users, Server,
  FileText, DollarSign, BarChart2, Code2,
} from "lucide-react";
import { AdminTabs, type AdminTab } from "@features/admin/components/AdminTabs";
import { ManagerTabs, type ManagerTab } from "@features/admin/components/ManagerTabs";
import { DevTabs, type DevTab } from "@features/admin/components/DevTabs";
import { MGR_LISTINGS, MGR_CONTRACTS } from "@features/admin/components/adminData";

type AnyTab = AdminTab | ManagerTab | DevTab;

export function AdminPanel() {
  const navigate = useNavigate();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const session = (() => {
    try {
      const s = sessionStorage.getItem("nv_admin_session") ?? sessionStorage.getItem("nv_manager_session") ?? sessionStorage.getItem("nv_dev_session");
      return s ? JSON.parse(s) as { name: string; role: string } : null;
    } catch { return null; }
  })();
  const role     = session?.role ?? "";
  const userName = session?.name ?? "Unknown";

  const isAdmin   = role === "admin";
  const isManager = role === "manager";
  const isDev     = role === "dev";

  const accentColor = isAdmin ? "#ef4444" : isManager ? "#10b981" : "#8b5cf6";
  const accentGrad  = isAdmin ? "from-red-500 to-rose-700" : isManager ? "from-emerald-500 to-teal-600" : "from-violet-600 to-purple-800";
  const roleLabel   = isAdmin ? "SUPER ADMIN" : isManager ? "MANAGER" : "DEV TEAM";
  const bgCard      = isManager ? "#0d1f18" : "#0f1829";

  const adminNav: { id: AdminTab; icon: React.ElementType; label: string; badge?: boolean }[] = [
    { id: "overview", icon: BarChart3, label: "Overview"  },
    { id: "agents",   icon: Bot,       label: "AI Agents", badge: true },
    { id: "users",    icon: Users,     label: "Users"     },
    { id: "logs",     icon: Terminal,  label: "API Logs"  },
    { id: "settings", icon: Settings,  label: "Settings"  },
  ];
  const mgrNav: { id: ManagerTab; icon: React.ElementType; label: string; badge?: boolean }[] = [
    { id: "dashboard", icon: BarChart2,  label: "Tổng quan"      },
    { id: "listings",  icon: Building2,  label: "Bất động sản"   },
    { id: "contracts", icon: FileText,   label: "Hợp đồng", badge: true },
    { id: "finances",  icon: DollarSign, label: "Tài chính"      },
    { id: "tenants",   icon: Users,      label: "Khách thuê"     },
  ];
  const devNav: { id: DevTab; icon: React.ElementType; label: string }[] = [
    { id: "logs",    icon: Terminal,  label: "API Logs"      },
    { id: "system",  icon: Server,    label: "System Health" },
    { id: "agents",  icon: Bot,       label: "AI Agents"     },
    { id: "deploys", icon: GitBranch, label: "Deployments"   },
    { id: "config",  icon: Code2,     label: "Config / Env"  },
  ];

  const initialTab: AnyTab = isAdmin ? "overview" : isManager ? "dashboard" : "logs";
  const [activeTab, setActiveTab] = useState<AnyTab>(initialTab);

  useEffect(() => {
    if (!autoRefresh) return;
    const iv = setInterval(() => setLastRefresh(new Date()), 5000);
    return () => clearInterval(iv);
  }, [autoRefresh]);

  const totalUnits    = MGR_LISTINGS.reduce((s, l) => s + l.units, 0);
  const occupiedUnits = MGR_LISTINGS.reduce((s, l) => s + l.occupied, 0);
  const monthlyRev    = MGR_LISTINGS.reduce((s, l) => s + l.occupied * l.rent, 0);
  const pendingCt     = MGR_CONTRACTS.filter((c) => c.status === "pending").length;

  const currentNav = isAdmin ? adminNav : isManager ? mgrNav : devNav;

  return (
    <div className="flex h-screen bg-[#080d18] text-white overflow-hidden">

      {/* ── Sidebar ── */}
      <div className="flex flex-col w-56 border-r border-white/8 flex-shrink-0" style={{ background: isAdmin ? "#09101e" : isManager ? "#081510" : "#060a14" }}>
        {/* Logo */}
        <div className="p-4 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accentGrad} flex items-center justify-center shadow-lg`}>
              <Layers size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white" style={{ fontSize: "0.82rem", fontWeight: 800 }}>NestaVietAI</p>
              <span className="inline-block px-1.5 py-0.5 rounded-md text-white font-bold" style={{ background: accentColor + "30", color: accentColor, fontSize: "0.52rem", letterSpacing: "0.1em" }}>{roleLabel}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="px-4 py-2.5 border-b border-white/8">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accentColor }} />
            <span className="text-white/50" style={{ fontSize: "0.65rem" }}>Systems operational</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-white/25" style={{ fontSize: "0.6rem" }}>
            <Clock size={9} />
            <span>{lastRefresh.toLocaleTimeString("vi-VN")}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {currentNav.map((item) => {
            const active = activeTab === item.id;
            return (
              <motion.button key={item.id} whileHover={{ x: 3 }}
                onClick={() => setActiveTab(item.id as AnyTab)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  background: active ? accentColor + "18" : "transparent",
                  border: `1px solid ${active ? accentColor + "35" : "transparent"}`,
                  color: active ? accentColor : "rgba(255,255,255,0.38)",
                }}
              >
                <item.icon size={15} strokeWidth={active ? 2.5 : 1.8} />
                <span style={{ fontSize: "0.8rem", fontWeight: active ? 700 : 400 }}>{item.label}</span>
                {"badge" in item && item.badge && (
                  <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center text-black" style={{ background: "#f59e0b", fontSize: "0.52rem", fontWeight: 900 }}>!</div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User + controls */}
        <div className="p-3 border-t border-white/8 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${accentGrad} flex items-center justify-center flex-shrink-0`} style={{ fontSize: "0.7rem", fontWeight: 800 }}>
              {userName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white truncate" style={{ fontSize: "0.78rem", fontWeight: 600 }}>{userName}</p>
              <p style={{ fontSize: "0.6rem", color: accentColor, opacity: 0.8 }}>{roleLabel.toLowerCase()}</p>
            </div>
          </div>
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
            <ChevronLeft size={13} /><span style={{ fontSize: "0.72rem" }}>Trang chủ</span>
          </button>
          <button onClick={() => {
            sessionStorage.removeItem("nv_admin_session");
            sessionStorage.removeItem("nv_manager_session");
            sessionStorage.removeItem("nv_dev_session");
            navigate(isAdmin ? "/admin/login" : isManager ? "/manager/login" : "/dev/login");
          }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/8 transition-all"
          >
            <LogOut size={13} /><span style={{ fontSize: "0.72rem" }}>Logout</span>
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="border-b border-white/8 px-5 py-2.5 flex items-center justify-between flex-shrink-0" style={{ background: isAdmin ? "#09101e" : isManager ? "#081510" : "#060a14" }}>
          <div className="flex items-center gap-2 text-white/40" style={{ fontSize: "0.72rem" }}>
            <span>NestaVietAI</span><span className="text-white/20">/</span>
            <span style={{ color: accentColor, fontWeight: 600 }}>{role}</span><span className="text-white/20">/</span>
            <span className="text-white/60">{currentNav.find((n) => n.id === activeTab)?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all"
              style={{ borderColor: autoRefresh ? accentColor + "40" : "rgba(255,255,255,0.1)", background: autoRefresh ? accentColor + "12" : "transparent", color: autoRefresh ? accentColor : "rgba(255,255,255,0.35)", fontSize: "0.7rem" }}
            >
              <motion.div animate={autoRefresh ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                <RefreshCw size={12} />
              </motion.div>
              Auto-refresh
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10" style={{ fontSize: "0.68rem" }}>
              <div className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? "animate-pulse" : ""}`} style={{ background: autoRefresh ? "#10b981" : "rgba(255,255,255,0.2)" }} />
              <span className="text-white/40">{autoRefresh ? "Live" : "Paused"}</span>
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {isAdmin && (
              <AdminTabs key="admin" activeTab={activeTab as AdminTab} accentColor={accentColor} bgCard={bgCard} />
            )}
            {isManager && (
              <ManagerTabs key="manager" activeTab={activeTab as ManagerTab} bgCard={bgCard}
                totalUnits={totalUnits} occupiedUnits={occupiedUnits} monthlyRev={monthlyRev} pendingCt={pendingCt} />
            )}
            {isDev && (
              <DevTabs key="dev" activeTab={activeTab as DevTab} accentColor={accentColor} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
