import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot, MapPin, Home, Wrench, Receipt, User,
  Building2, LogOut,
  TrendingUp, ChevronDown,
  MessageSquare, Map, DollarSign, Globe,
} from "lucide-react";
import { OnboardingTour } from "@shared/components/OnboardingTour";
import { ChatInbox } from "@features/chat/ChatInbox";
import { MapView } from "@features/apartment/components/MapView";
import { PriceEstimator } from "@features/listing/components/PriceEstimator";
import { RatingModal } from "@shared/components/RatingModal";
import HomeTab from "@features/tenant/components/HomeTab";
import ChatTab from "@features/tenant/components/ChatTab";
import ExploreTab from "@features/tenant/components/ExploreTab";
import ServicesTab from "@features/tenant/components/ServicesTab";
import InvoicesTab from "@features/tenant/components/InvoicesTab";
import ProfileTab from "@features/tenant/components/ProfileTab";
import { NotificationCenter } from "@features/tenant/components/NotificationCenter";

type Tab = "home" | "chat" | "explore" | "services" | "invoices" | "profile" | "inbox" | "map" | "price";

function getTenantUser() {
  try { return JSON.parse(localStorage.getItem("nv-tenant-user") || "{}"); } catch { return {}; }
}

// ─── Main TenantApp ───────────────────────────────────────────────────────────
export function TenantApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [syncVersion, setSyncVersion] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("nv-dark-tenant") === "true"; } catch { return false; }
  });
  const toggleDark = () => {
    setIsDark((d) => {
      const next = !d;
      try { localStorage.setItem("nv-dark-tenant", String(next)); } catch {}
      return next;
    });
  };

  // Real-time cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      const watched = ["nv-building-tenants", "nv-listings-board", "nv-tenant-user"];
      if (watched.includes(e.key ?? "")) setSyncVersion(v => v + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const tenantUser = getTenantUser();
  void syncVersion;
  const tenantName = tenantUser.name || "Cư dân";

  const handleLogout = () => {
    try { localStorage.removeItem("nv-tenant-logged-in"); } catch {}
    navigate("/");
  };

  const [lang, setLang] = useState<"vi" | "en">(() => {
    try { return (localStorage.getItem("nv-lang-tenant") as "vi" | "en") || "vi"; } catch { return "vi"; }
  });
  const toggleLang = () => setLang((l) => {
    const next = l === "vi" ? "en" : "vi";
    try { localStorage.setItem("nv-lang-tenant", next); } catch {}
    return next;
  });

  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem("nv-onboarding-tenant-done"); } catch { return false; }
  });
  const [showRating, setShowRating] = useState(false);

  const T = (vi: string, en: string) => lang === "vi" ? vi : en;

  const navItems: { id: Tab; icon: React.ElementType; label: string; badge?: number }[] = [
    { id: "home",     icon: Home,          label: T("Trang chủ", "Home") },
    { id: "chat",     icon: Bot,           label: T("AI Chat", "AI Chat") },
    { id: "explore",  icon: MapPin,        label: T("Khám phá", "Explore") },
    { id: "inbox",    icon: MessageSquare, label: T("Hộp thư", "Inbox"), badge: 3 },
    { id: "map",      icon: Map,           label: T("Bản đồ", "Map") },
    { id: "price",    icon: DollarSign,    label: T("Ước giá AI", "Price AI") },
    { id: "services", icon: Wrench,        label: T("Dịch vụ", "Services"), badge: 2 },
    { id: "invoices", icon: Receipt,       label: T("Hóa đơn", "Invoices"), badge: 1 },
    { id: "profile",  icon: User,          label: T("Hồ sơ", "Profile") },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? "app-dark bg-gray-50" : "bg-gray-50"}`}>
      {/* ── Sidebar ── */}
      <div className={`${sidebarOpen ? "flex" : "hidden"} md:flex flex-col w-56 border-r shadow-sm flex-shrink-0 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
        {/* Logo */}
        <div className={`p-5 border-b ${isDark ? "border-slate-700" : "border-gray-100"}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Building2 size={16} className="text-white" />
            </div>
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 800, color: isDark ? "#f1f5f9" : "#111827" }}>NestaViet<span className="text-emerald-500">AI</span></p>
              <p style={{ fontSize: "0.62rem", color: isDark ? "#64748b" : "#9ca3af" }}>Cổng cư dân</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className={`p-4 border-b ${isDark ? "border-slate-700" : "border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold" style={{ fontSize: "0.9rem" }}>{tenantName.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate" style={{ fontSize: "0.82rem", color: isDark ? "#f1f5f9" : "#111827" }}>{tenantName}</p>
              <p className="truncate" style={{ fontSize: "0.62rem", color: isDark ? "#64748b" : "#9ca3af" }}>
                {tenantUser.unit ? `Phòng ${tenantUser.unit}` : "Phòng 1204"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <motion.button key={item.id} whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? isDark ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50" : "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                  : isDark ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}>
              <item.icon size={16} strokeWidth={activeTab === item.id ? 2.5 : 1.8} />
              <span className="flex-1 text-left" style={{ fontSize: "0.85rem", fontWeight: activeTab === item.id ? 600 : 400 }}>{item.label}</span>
              {item.badge ? (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center" style={{ fontSize: "0.6rem", fontWeight: 700 }}>{item.badge}</span>
              ) : null}
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`p-3 border-t space-y-1 ${isDark ? "border-slate-700" : "border-gray-100"}`}>
          <div className="flex items-center gap-2 px-3 py-2">
            <TrendingUp size={13} className="text-emerald-500" />
            <span style={{ fontSize: "0.68rem", color: isDark ? "#64748b" : "#9ca3af" }}>AI Agents: 2 hoạt động</span>
          </div>
          <button onClick={toggleLang}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${isDark ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
            <Globe size={13} />
            <span style={{ fontSize: "0.82rem" }}>{lang === "vi" ? "Tiếng Việt 🇻🇳" : "English 🇬🇧"}</span>
          </button>
          <button onClick={handleLogout} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <LogOut size={14} />
            <span style={{ fontSize: "0.82rem" }}>{T("Đăng xuất", "Logout")}</span>
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className={`border-b px-5 py-3.5 flex items-center justify-between flex-shrink-0 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
              <ChevronDown size={16} className="text-gray-600" />
            </button>
            <h1 className="font-bold" style={{ fontSize: "1rem", color: isDark ? "#f1f5f9" : "#111827" }}>
              {activeTab === "home"     && T("Trang chủ", "Home")}
              {activeTab === "chat"     && T("Super Broker AI", "Super Broker AI")}
              {activeTab === "explore"  && T("Khám phá căn hộ", "Explore Listings")}
              {activeTab === "inbox"    && T("Hộp thư", "Inbox")}
              {activeTab === "map"      && T("Bản đồ TP.HCM", "HCM City Map")}
              {activeTab === "price"    && T("AI Ước giá thuê", "AI Price Estimator")}
              {activeTab === "services" && T("Yêu cầu dịch vụ", "Services")}
              {activeTab === "invoices" && T("Hóa đơn & Thanh toán", "Invoices & Payments")}
              {activeTab === "profile"  && T("Hồ sơ cư dân", "Resident Profile")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-700" style={{ fontSize: "0.72rem", fontWeight: 500 }}>Đang thuê</span>
            </div>
            <NotificationCenter isDark={isDark} />
            <button onClick={() => navigate("/")} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600" title="Về trang chủ">
              <Home size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                <HomeTab onTabChange={setActiveTab} />
              </motion.div>
            )}
            {activeTab === "chat" && (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                <ChatTab />
              </motion.div>
            )}
            {activeTab === "explore" && (
              <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                <ExploreTab />
              </motion.div>
            )}
            {activeTab === "services" && (
              <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                <ServicesTab />
              </motion.div>
            )}
            {activeTab === "invoices" && (
              <motion.div key="invoices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                <InvoicesTab />
              </motion.div>
            )}
            {activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                <ProfileTab onLogout={handleLogout} isDark={isDark} toggleDark={toggleDark} />
              </motion.div>
            )}
            {activeTab === "inbox" && (
              <motion.div key="inbox" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex-1 flex flex-col overflow-hidden">
                <ChatInbox isDark={isDark} />
              </motion.div>
            )}
            {activeTab === "map" && (
              <motion.div key="map" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex-1 flex flex-col overflow-hidden">
                <MapView isDark={isDark} />
              </motion.div>
            )}
            {activeTab === "price" && (
              <motion.div key="price" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex-1 flex flex-col overflow-hidden">
                <PriceEstimator isDark={isDark} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour role="tenant" onComplete={() => {
          setShowOnboarding(false);
          try { localStorage.setItem("nv-onboarding-tenant-done", "1"); } catch {}
        }} />
      )}

      {/* Rating Modal */}
      {showRating && (
        <RatingModal targetName="Nguyễn Văn Hùng (Chủ nhà)" targetRole="landlord"
          onClose={() => setShowRating(false)} />
      )}
    </div>
  );
}
