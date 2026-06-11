import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart3, Building2, Users,
  Plus,
  FileText, Settings, LogOut,
  Calendar, ScanLine, Zap, Globe,
  Cpu,
} from "lucide-react";
import { DocScanner } from "@features/landlord/components/DocScanner";
import { MaintenanceCalendar } from "@features/landlord/components/MaintenanceCalendar";
import { RatingModal } from "@shared/components/RatingModal";
import DashboardTab from "@features/landlord/components/DashboardTab";
import TenantsTab from "@features/landlord/components/TenantsTab";
import ListingTab from "@features/landlord/components/ListingTab";
import ListingApp_fixed from "./components/ListingApp_fixed"; // Demo cho ListingTab
import ReportsTab from "@features/landlord/components/ReportsTab";
import SettingsTab from "@features/landlord/components/SettingsTab";
import PropertiesTab from "@features/landlord/components/PropertiesTab";
import AgentsTab from "@features/landlord/components/AgentsTab";
import { NotificationCenter } from "@features/landlord/components/NotificationCenter";

type LandlordTab = "dashboard" | "properties" | "tenants" | "listing" | "reports" | "settings" | "agents" | "calendar" | "docs";

function getLandlordUser() {
  try { return JSON.parse(localStorage.getItem("nv-landlord-user") || "{}"); } catch { return {}; }
}
function getBuildingTenants() {
  try { return JSON.parse(localStorage.getItem("nv-building-tenants") || "[]"); } catch { return []; }
}

// ─── Main LandlordApp ─────────────────────────────────────────────────────────
export function LandlordApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LandlordTab>("dashboard");
  const [syncVersion, setSyncVersion] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("nv-dark-landlord") === "true"; } catch { return false; }
  });
  const toggleDark = () => {
    setIsDark((d) => {
      const next = !d;
      try { localStorage.setItem("nv-dark-landlord", String(next)); } catch {}
      return next;
    });
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      const watched = ["nv-building-tenants", "nv-listings-board", "nv-landlord-user"];
      if (watched.includes(e.key ?? "")) setSyncVersion(v => v + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const landlordUser = getLandlordUser();
  const landlordName = landlordUser.name || "Quản lý";
  const landlordEmail = landlordUser.email || localStorage.getItem("nv-landlord-email") || "";
  const landlordUnits = landlordUser.totalUnits ? `${landlordUser.totalUnits} căn hộ` : "12 căn hộ";
  const landlordBuilding = landlordUser.buildingName || "";
  const today = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  const pendingTenants = (getBuildingTenants() as { status: string }[]).filter(t => t.status === "pending").length + 2;
  void syncVersion;

  const handleLogout = () => {
    try { localStorage.removeItem("nv-landlord-logged-in"); } catch {}
    navigate("/");
  };

  const [lang, setLang] = useState<"vi" | "en">(() => {
    try { return (localStorage.getItem("nv-lang-landlord") as "vi" | "en") || "vi"; } catch { return "vi"; }
  });
  const toggleLang = () => setLang((l) => {
    const next = l === "vi" ? "en" : "vi";
    try { localStorage.setItem("nv-lang-landlord", next); } catch {}
    return next;
  });

  const [ratingTarget, setRatingTarget] = useState<{ name: string } | null>(null);

  const T = (vi: string, en: string) => lang === "vi" ? vi : en;

  const navItems = [
    { id: "dashboard" as LandlordTab, icon: BarChart3, label: T("Dashboard", "Dashboard"), badge: 0 },
    { id: "properties" as LandlordTab, icon: Building2, label: T("Bất động sản", "Properties"), badge: 0 },
    { id: "tenants" as LandlordTab, icon: Users, label: T("Cư dân", "Tenants"), badge: pendingTenants },
    { id: "listing" as LandlordTab, icon: Plus, label: T("Đăng tin", "New Listing"), badge: 0 },
    { id: "calendar" as LandlordTab, icon: Calendar, label: T("Bảo trì", "Maintenance"), badge: 0 },
    { id: "docs" as LandlordTab, icon: ScanLine, label: T("Tài liệu OCR", "Doc Scanner"), badge: 0 },
    { id: "agents" as LandlordTab, icon: Cpu, label: T("AI Agents", "AI Agents"), badge: 0 },
    { id: "reports" as LandlordTab, icon: FileText, label: T("Báo cáo", "Reports"), badge: 0 },
    { id: "settings" as LandlordTab, icon: Settings, label: T("Cài đặt", "Settings"), badge: 0 },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? "app-dark bg-gray-50" : "bg-gray-50"}`}>
      {/* ── Sidebar ── */}
      <div className={`hidden md:flex flex-col w-60 border-r shadow-sm flex-shrink-0 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
        {/* Logo */}
        <div className={`p-5 border-b ${isDark ? "border-slate-700" : "border-gray-100"}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <Building2 size={16} className="text-white" />
            </div>
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 800, color: isDark ? "#f1f5f9" : "#111827" }}>NestaViet<span className="text-violet-500">AI</span></p>
              <p style={{ fontSize: "0.65rem", color: isDark ? "#64748b" : "#9ca3af" }}>Landlord Portal</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className={`p-4 border-b ${isDark ? "border-slate-700" : "border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold" style={{ fontSize: "0.9rem" }}>{landlordName.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate" style={{ fontSize: "0.82rem", color: isDark ? "#f1f5f9" : "#111827" }}>{landlordName}</p>
              <p className="truncate" style={{ fontSize: "0.65rem", color: isDark ? "#64748b" : "#9ca3af" }}>{landlordUnits} • Verified ✓</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? isDark ? "bg-violet-900/40 text-violet-300 border border-violet-700/50" : "bg-violet-50 text-violet-700 border border-violet-200/70"
                  : isDark ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <item.icon size={16} strokeWidth={activeTab === item.id ? 2.5 : 1.8} />
              <span className="flex-1 text-left" style={{ fontSize: "0.85rem", fontWeight: activeTab === item.id ? 600 : 400 }}>{item.label}</span>
              {item.badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center" style={{ fontSize: "0.6rem", fontWeight: 700 }}>{item.badge}</span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`p-3 border-t space-y-1 ${isDark ? "border-slate-700" : "border-gray-100"}`}>
          <div className="flex items-center gap-2 px-3 py-2">
            <Zap size={14} className="text-violet-500" />
            <span style={{ fontSize: "0.72rem", color: isDark ? "#64748b" : "#6b7280" }}>AI Agents: 4 hoạt động</span>
          </div>
          <button onClick={toggleLang}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${isDark ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
            <Globe size={14} />
            <span style={{ fontSize: "0.82rem" }}>{lang === "vi" ? "Tiếng Việt 🇻🇳" : "English 🇬🇧"}</span>
          </button>
          <button onClick={handleLogout} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <LogOut size={15} />
            <span style={{ fontSize: "0.82rem" }}>{T("Đăng xuất", "Logout")}</span>
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className={`border-b px-5 py-3.5 flex items-center justify-between flex-shrink-0 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
          <div>
            <h1 className="font-bold" style={{ fontSize: "1rem", color: isDark ? "#f1f5f9" : "#111827" }}>
              {activeTab === "dashboard" && T("Tổng quan hệ thống", "System Overview")}
              {activeTab === "properties" && T("Danh sách bất động sản", "Properties")}
              {activeTab === "tenants" && T("Quản lý cư dân", "Tenant Management")}
              {activeTab === "listing" && T("Đăng tin cho thuê", "New Listing")}
              {activeTab === "agents" && T("Multi-Agent System", "Multi-Agent System")}
              {activeTab === "reports" && T("Báo cáo tài chính", "Financial Reports")}
              {activeTab === "settings" && T("Cài đặt tài khoản", "Account Settings")}
              {activeTab === "calendar" && T("Lịch bảo trì", "Maintenance Calendar")}
              {activeTab === "docs" && T("Quét tài liệu OCR", "Document Scanner")}
            </h1>
            <p style={{ fontSize: "0.72rem", color: isDark ? "#475569" : "#9ca3af" }}>{today}{landlordBuilding ? ` • ${landlordBuilding}` : " • NestaVietAI Landlord"}</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center cursor-pointer" onClick={() => setActiveTab("settings")}>
              <span className="text-white font-bold" style={{ fontSize: "0.8rem" }}>{landlordName.charAt(0)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col">
                <DashboardTab pendingCount={pendingTenants} />
              </motion.div>
            )}
            {activeTab === "properties" && (
              <motion.div key="properties" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col">
                <PropertiesTab />
              </motion.div>
            )}
            {activeTab === "tenants" && (
              <motion.div key="tenants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col">
                <TenantsTab landlordBuilding={landlordBuilding} />
              </motion.div>
            )}
            {activeTab === "listing" && (
              <motion.div key="listing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col w-full"> {/*Tắt max-w-3xl với w-auto để anh Hiển test FE phần ni nghe*/}
                {/* <ListingTab /> */}
                <ListingApp_fixed />
              </motion.div>
            )}
            {activeTab === "agents" && (
              <motion.div key="agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col">
                <AgentsTab />
              </motion.div>
            )}
            {activeTab === "reports" && (
              <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col">
                <ReportsTab />
              </motion.div>
            )}
            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col">
                <SettingsTab landlordName={landlordName} landlordEmail={landlordEmail} isDark={isDark} toggleDark={toggleDark} />
              </motion.div>
            )}
            {activeTab === "calendar" && (
              <motion.div key="calendar" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex-1 overflow-hidden flex flex-col">
                <MaintenanceCalendar isDark={isDark} />
              </motion.div>
            )}
            {activeTab === "docs" && (
              <motion.div key="docs" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex-1 overflow-hidden flex flex-col">
                <DocScanner isDark={isDark} />
              </motion.div>
            )}
          </AnimatePresence>

          {ratingTarget && (
            <RatingModal targetName={ratingTarget.name} targetRole="tenant" onClose={() => setRatingTarget(null)} />
          )}
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden bg-white border-t border-gray-100 px-2 py-2 flex-shrink-0">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 6).map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl ${activeTab === item.id ? "text-violet-600" : "text-gray-400"}`}>
                <item.icon size={19} strokeWidth={activeTab === item.id ? 2.5 : 1.8} />
                <span style={{ fontSize: "0.58rem" }}>{item.label}</span>
                {item.badge > 0 && <div className="absolute -top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center" style={{ fontSize: "0.5rem" }}>{item.badge}</div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
