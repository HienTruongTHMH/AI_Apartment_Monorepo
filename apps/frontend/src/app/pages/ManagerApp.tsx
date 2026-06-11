import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Users, Wrench, Zap, KeyRound, Megaphone,
  DollarSign, Settings, LogOut, Bell, Globe, ChevronRight,
  CheckCircle2, AlertTriangle, XCircle, PlusCircle,
  BarChart3, ArrowUpRight, ArrowDownRight, Search,
  Filter, MoreHorizontal, Phone, Car, Wifi, Droplets,
  Eye, Edit3, Trash2, Download, Send, User, Building,
  TrendingUp, Star,
} from "lucide-react";
import { useCountUp } from "@shared/hooks/useCountUp";
import { useLang } from "@shared/hooks/useLang";

const AUTH_KEY = "nv_manager_session";
function getSession() {
  try { return JSON.parse(sessionStorage.getItem(AUTH_KEY) || "{}"); } catch { return {}; }
}

// ─── Mock Data ─────────────────────────────────────────────────────────────
const RESIDENTS = [
  { id: 1, name: "Nguyễn Văn An",     unit: "A201", floor: 2, type: "Căn hộ 2PN", rent: 8500000,  status: "active",  phone: "0901234567", email: "an.nguyen@email.com",   since: "01/2024", contract: "01/2025", rating: 4.8 },
  { id: 2, name: "Trần Thị Bình",      unit: "A305", floor: 3, type: "Studio",     rent: 5500000,  status: "active",  phone: "0912345678", email: "binh.tran@email.com",    since: "06/2023", contract: "06/2025", rating: 4.5 },
  { id: 3, name: "Lê Hoàng Cường",     unit: "A412", floor: 4, type: "Căn hộ 3PN", rent: 12000000, status: "late",    phone: "0923456789", email: "cuong.le@email.com",     since: "03/2023", contract: "03/2025", rating: 3.2 },
  { id: 4, name: "Phạm Minh Dũng",     unit: "A115", floor: 1, type: "Căn hộ 2PN", rent: 8000000,  status: "active",  phone: "0934567890", email: "dung.pham@email.com",    since: "09/2024", contract: "09/2025", rating: 4.9 },
  { id: 5, name: "Hoàng Thị Thu Hà",   unit: "A502", floor: 5, type: "Penthouse",  rent: 25000000, status: "active",  phone: "0945678901", email: "ha.hoang@email.com",     since: "01/2023", contract: "01/2026", rating: 4.7 },
  { id: 6, name: "Vũ Đức Kiên",        unit: "A218", floor: 2, type: "Studio",     rent: 5000000,  status: "expired", phone: "0956789012", email: "kien.vu@email.com",      since: "02/2022", contract: "02/2025", rating: 4.1 },
  { id: 7, name: "Đặng Thị Lan",       unit: "A320", floor: 3, type: "Căn hộ 2PN", rent: 9000000,  status: "active",  phone: "0967890123", email: "lan.dang@email.com",     since: "07/2024", contract: "07/2025", rating: 4.6 },
  { id: 8, name: "Bùi Văn Mạnh",       unit: "A408", floor: 4, type: "Căn hộ 3PN", rent: 11500000, status: "active",  phone: "0978901234", email: "manh.bui@email.com",     since: "10/2024", contract: "10/2025", rating: 4.3 },
];

const REQUESTS = [
  { id: "REQ001", unit: "A201", resident: "Nguyễn Văn An",   type: "maintenance", title: "Điều hòa không lạnh",         priority: "high",   status: "in_progress", created: "30/04/2026 08:15", assigned: "Kỹ thuật viên Hùng" },
  { id: "REQ002", unit: "A305", resident: "Trần Thị Bình",   type: "repair",      title: "Ống nước nhà tắm bị rò",      priority: "urgent", status: "pending",     created: "30/04/2026 09:30", assigned: null },
  { id: "REQ003", unit: "A412", resident: "Lê Hoàng Cường",  type: "cleaning",    title: "Làm sạch hành lang",           priority: "low",    status: "done",        created: "29/04/2026 14:00", assigned: "Nhân viên vệ sinh" },
  { id: "REQ004", unit: "A502", resident: "Hoàng Thị Thu Hà",type: "inspection",  title: "Kiểm tra đường điện căn hộ",   priority: "medium", status: "pending",     created: "30/04/2026 07:00", assigned: null },
  { id: "REQ005", unit: "A115", resident: "Phạm Minh Dũng",  type: "maintenance", title: "Thay bóng đèn hành lang",      priority: "low",    status: "done",        created: "28/04/2026 16:00", assigned: "Kỹ thuật viên Hùng" },
  { id: "REQ006", unit: "A218", resident: "Vũ Đức Kiên",     type: "repair",      title: "Ổ khóa cửa chính bị kẹt",     priority: "high",   status: "in_progress", created: "30/04/2026 10:00", assigned: "Kỹ thuật viên Nam" },
];

const UTILITIES = [
  { unit: "A201", resident: "Nguyễn Văn An",   electricity: 285, water: 12.5, wifi: true,  parking: "A12", elevStatus: "OK" },
  { unit: "A305", resident: "Trần Thị Bình",   electricity: 142, water: 8.2,  wifi: true,  parking: null,  elevStatus: "OK" },
  { unit: "A412", resident: "Lê Hoàng Cường",  electricity: 412, water: 18.7, wifi: false, parking: "B03", elevStatus: "OK" },
  { unit: "A115", resident: "Phạm Minh Dũng",  electricity: 198, water: 9.4,  wifi: true,  parking: "A05", elevStatus: "OK" },
  { unit: "A502", resident: "Hoàng Thị Thu Hà",electricity: 680, water: 28.3, wifi: true,  parking: "P01", elevStatus: "OK" },
  { unit: "A218", resident: "Vũ Đức Kiên",     electricity: 95,  water: 5.1,  wifi: true,  parking: null,  elevStatus: "OK" },
  { unit: "A320", resident: "Đặng Thị Lan",    electricity: 310, water: 14.8, wifi: true,  parking: "B07", elevStatus: "OK" },
  { unit: "A408", resident: "Bùi Văn Mạnh",    electricity: 380, water: 16.2, wifi: true,  parking: "B11", elevStatus: "OK" },
];

const ACCESS_LOG = [
  { time: "30/04 10:42", unit: "A201", person: "Nguyễn Văn An",    type: "resident", gate: "Cổng chính", method: "Thẻ từ",   status: "allowed" },
  { time: "30/04 10:38", unit: "A305", person: "Khách / Lê Minh",  type: "visitor",  gate: "Cổng chính", method: "QR Code",  status: "allowed" },
  { time: "30/04 10:15", unit: "A412", person: "Lê Hoàng Cường",   type: "resident", gate: "Hầm xe B1",  method: "Thẻ từ",   status: "allowed" },
  { time: "30/04 09:55", unit: "—",    person: "Người lạ",         type: "unknown",  gate: "Cổng phụ",   method: "Không rõ", status: "denied" },
  { time: "30/04 09:30", unit: "A502", person: "Hoàng Thị Thu Hà", type: "resident", gate: "Hầm xe B2",  method: "Thẻ từ",   status: "allowed" },
  { time: "30/04 09:12", unit: "A115", person: "Phạm Minh Dũng",   type: "resident", gate: "Cổng chính", method: "Nhận diện",status: "allowed" },
  { time: "30/04 08:50", unit: "A218", person: "Vũ Đức Kiên",      type: "resident", gate: "Cổng chính", method: "Thẻ từ",   status: "allowed" },
];

const ANNOUNCEMENTS = [
  { id: 1, title: "Lịch cắt điện tháng 5", body: "Ngày 05/05/2026 từ 8:00 - 12:00 sẽ cắt điện toàn toà để bảo trì hệ thống điện tầng 1-5.", target: "Toàn toà", date: "30/04/2026", status: "published", views: 124 },
  { id: 2, title: "Thông báo nâng phí dịch vụ", body: "Từ 01/06/2026 phí dịch vụ tháng sẽ tăng 5% theo lộ trình đã thông báo.", target: "Toàn toà", date: "25/04/2026", status: "published", views: 210 },
  { id: 3, title: "Kiểm tra phòng cháy chữa cháy", body: "Ban quản lý phối hợp với cơ quan PCCC kiểm tra hệ thống ngày 10/05/2026.", target: "Tầng 3-5",  date: "28/04/2026", status: "draft",     views: 0 },
];

const FINANCE = {
  income: [
    { month: "T1", rent: 98, service: 12, parking: 8 },
    { month: "T2", rent: 98, service: 12, parking: 8 },
    { month: "T3", rent: 101, service: 13, parking: 9 },
    { month: "T4", rent: 105, service: 13, parking: 9 },
  ],
  expenses: [
    { label: "Lương nhân viên", amount: 28000000, pct: 35 },
    { label: "Bảo trì & sửa chữa", amount: 12500000, pct: 16 },
    { label: "Điện nước chung", amount: 8200000,  pct: 10 },
    { label: "Vệ sinh & cây cảnh", amount: 4500000,  pct: 6 },
    { label: "Bảo hiểm toà nhà", amount: 6800000,  pct: 9 },
    { label: "Chi phí khác", amount: 4000000,  pct: 5 },
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const statusBadge: Record<string, string> = {
  active:      "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  late:        "bg-amber-500/15 text-amber-400 border-amber-500/25",
  expired:     "bg-red-500/15 text-red-400 border-red-500/25",
  pending:     "bg-amber-500/15 text-amber-400 border-amber-500/25",
  in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  done:        "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  published:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  draft:       "bg-white/10 text-white/50 border-white/15",
  allowed:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  denied:      "bg-red-500/15 text-red-400 border-red-500/25",
};
const priorityBadge: Record<string, string> = {
  urgent: "bg-red-500/20 text-red-400 border border-red-500/30",
  high:   "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  medium: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  low:    "bg-white/8 text-white/40 border border-white/10",
};

function fmt(n: number) { return n.toLocaleString("vi-VN"); }

type ManagerTab = "dashboard" | "residents" | "requests" | "utilities" | "access" | "announcements" | "finance" | "settings";

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, target, suffix = "", change, up, color, icon: Icon, delay = 0 }: {
  label: string; target: number; suffix?: string; change?: string; up?: boolean;
  color: string; icon: React.ElementType; delay?: number;
}) {
  const count = useCountUp(target, 900 + delay * 150);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.1, type: "spring", stiffness: 300, damping: 22 }}
      className={`${color} rounded-2xl p-5 relative overflow-hidden nv-tilt-card nv-shimmer`}
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)" }}
    >
      {/* Inner glow top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="flex items-start justify-between mb-3">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="p-2 rounded-xl bg-white/15 backdrop-blur-sm"
        >
          <Icon size={18} className="text-white" />
        </motion.div>
        {change && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${up ? "bg-emerald-400/20 text-emerald-200" : "bg-red-400/20 text-red-200"}`}>
            {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{change}
          </span>
        )}
      </div>
      <p className="text-white text-2xl font-bold tabular-nums">{count.toLocaleString()}{suffix}</p>
      <p className="text-white/60 text-xs mt-0.5">{label}</p>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function ManagerApp() {
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang("manager");
  const [tab, setTab] = useState<ManagerTab>("dashboard");
  const [search, setSearch] = useState("");
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceBody, setAnnounceBody] = useState("");
  const [announceTarget, setAnnounceTarget] = useState("Toàn toà");
  const session = getSession();

  useEffect(() => {
    if (!session.expiry || Date.now() >= session.expiry) navigate("/manager/login", { replace: true });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    navigate("/manager/login", { replace: true });
  };

  const navItems: { id: ManagerTab; label: string; labelEn: string; icon: React.ElementType; badge?: number }[] = [
    { id: "dashboard",     label: "Tổng quan",   labelEn: "Overview",     icon: LayoutDashboard },
    { id: "residents",     label: "Cư dân",       labelEn: "Residents",    icon: Users,          badge: RESIDENTS.filter(r => r.status === "late").length },
    { id: "requests",      label: "Yêu cầu",      labelEn: "Requests",     icon: Wrench,         badge: REQUESTS.filter(r => r.status === "pending").length },
    { id: "utilities",     label: "Tiện ích",      labelEn: "Utilities",    icon: Zap },
    { id: "access",        label: "Kiểm soát",    labelEn: "Access",       icon: KeyRound },
    { id: "announcements", label: "Thông báo",    labelEn: "Announcements",icon: Megaphone },
    { id: "finance",       label: "Tài chính",    labelEn: "Finance",      icon: DollarSign },
    { id: "settings",      label: "Cài đặt",      labelEn: "Settings",     icon: Settings },
  ];

  const tabTitles: Record<ManagerTab, [string, string]> = {
    dashboard:     ["Tổng quan hoạt động", "Operations Overview"],
    residents:     ["Quản lý cư dân", "Resident Management"],
    requests:      ["Yêu cầu bảo trì", "Maintenance Requests"],
    utilities:     ["Tiện ích & Đồng hồ", "Utilities & Meters"],
    access:        ["Kiểm soát ra vào", "Access Control"],
    announcements: ["Thông báo toà nhà", "Building Announcements"],
    finance:       ["Tài chính tháng", "Monthly Finance"],
    settings:      ["Cài đặt tài khoản", "Account Settings"],
  };

  return (
    <div className="flex h-screen bg-[#0A1628] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-emerald-500/8" style={{ background: "rgba(4,12,18,0.99)" }}>
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

              {/* ─── DASHBOARD ─── */}
              {tab === "dashboard" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <KpiCard label={t("Tổng cư dân", "Total Residents")}    target={RESIDENTS.length} icon={Users}       color="bg-gradient-to-br from-emerald-600 to-teal-700"  delay={0} change="+2 tháng này" up />
                    <KpiCard label={t("Yêu cầu đang chờ", "Pending Requests")} target={REQUESTS.filter(r=>r.status==="pending").length} icon={Wrench} color="bg-gradient-to-br from-amber-600 to-orange-700" delay={1} change="-3" up={false} />
                    <KpiCard label={t("Cổng vào hôm nay", "Access Today")}  target={ACCESS_LOG.length} icon={KeyRound}   color="bg-gradient-to-br from-blue-600 to-indigo-700"   delay={2} change="+12%" up />
                    <KpiCard label={t("Thu tháng này (tr)", "Revenue (mil)")} target={127} suffix=" tr" icon={DollarSign} color="bg-gradient-to-br from-violet-600 to-purple-700"  delay={3} change="+4.2%" up />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Recent Requests */}
                    <div className="col-span-2 bg-white/4 rounded-2xl p-5 border border-white/6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold" style={{ fontSize: "0.9rem" }}>{t("Yêu cầu gần đây", "Recent Requests")}</h3>
                        <button onClick={() => setTab("requests")} className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                          {t("Xem tất cả", "View all")} <ChevronRight size={12} />
                        </button>
                      </div>
                      <div className="space-y-2.5">
                        {REQUESTS.slice(0, 5).map((req) => (
                          <div key={req.id} className="flex items-center gap-3 bg-white/3 rounded-xl p-3">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${req.priority === "urgent" ? "bg-red-400" : req.priority === "high" ? "bg-amber-400" : "bg-blue-400"}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-white/85 truncate" style={{ fontSize: "0.82rem" }}>{req.title}</p>
                              <p className="text-white/40" style={{ fontSize: "0.7rem" }}>{req.unit} • {req.resident}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full border text-xs ${statusBadge[req.status]}`}>
                              {req.status === "pending" ? t("Chờ", "Pending") : req.status === "in_progress" ? t("Đang xử", "In Progress") : t("Xong", "Done")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="space-y-4">
                      <div className="bg-white/4 rounded-2xl p-5 border border-white/6">
                        <h3 className="text-white/60 text-xs font-semibold mb-3 uppercase tracking-wider">{t("Trạng thái cư dân", "Resident Status")}</h3>
                        {[
                          { label: t("Hoạt động", "Active"),         count: RESIDENTS.filter(r=>r.status==="active").length,  color: "bg-emerald-500" },
                          { label: t("Trễ tiền thuê", "Late Rent"),  count: RESIDENTS.filter(r=>r.status==="late").length,    color: "bg-amber-500" },
                          { label: t("HĐ hết hạn", "Expired"),       count: RESIDENTS.filter(r=>r.status==="expired").length, color: "bg-red-500" },
                        ].map((s) => (
                          <div key={s.label} className="flex items-center gap-2 mb-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                            <span className="text-white/60 flex-1" style={{ fontSize: "0.78rem" }}>{s.label}</span>
                            <span className="text-white font-semibold" style={{ fontSize: "0.82rem" }}>{s.count}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white/4 rounded-2xl p-5 border border-white/6">
                        <h3 className="text-white/60 text-xs font-semibold mb-3 uppercase tracking-wider">{t("Cảnh báo", "Alerts")}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-amber-400" style={{ fontSize: "0.78rem" }}>
                            <AlertTriangle size={13} />
                            <span>{t("1 hợp đồng hết hạn", "1 contract expired")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-red-400" style={{ fontSize: "0.78rem" }}>
                            <XCircle size={13} />
                            <span>{t("1 yêu cầu khẩn cấp", "1 urgent request")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-400" style={{ fontSize: "0.78rem" }}>
                            <Bell size={13} />
                            <span>{t("Cắt điện ngày 05/05", "Power cut 05/05")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Access log preview */}
                  <div className="bg-white/4 rounded-2xl p-5 border border-white/6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold" style={{ fontSize: "0.9rem" }}>{t("Lịch sử kiểm soát vào ra", "Access Control Log")}</h3>
                      <button onClick={() => setTab("access")} className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                        {t("Xem tất cả", "View all")} <ChevronRight size={12} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {ACCESS_LOG.slice(0, 4).map((log, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <span className="text-white/30 w-24 flex-shrink-0" style={{ fontSize: "0.72rem" }}>{log.time}</span>
                          <span className={`px-2 py-0.5 rounded-full border text-xs ${statusBadge[log.status]}`}>{log.status === "allowed" ? t("Cho phép", "Allowed") : t("Từ chối", "Denied")}</span>
                          <span className="text-white/70 flex-1" style={{ fontSize: "0.8rem" }}>{log.person}</span>
                          <span className="text-white/35" style={{ fontSize: "0.72rem" }}>{log.gate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── RESIDENTS ─── */}
              {tab === "residents" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("Tìm cư dân, căn hộ...", "Search residents, units...")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-white placeholder-white/25 outline-none focus:border-emerald-500/40 transition-colors"
                        style={{ fontSize: "0.85rem" }}
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/15 border border-emerald-500/25 rounded-xl text-emerald-400 hover:bg-emerald-500/25 transition-colors" style={{ fontSize: "0.82rem" }}>
                      <Filter size={13} /> {t("Lọc", "Filter")}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 rounded-xl text-white hover:bg-emerald-600 transition-colors" style={{ fontSize: "0.82rem" }}>
                      <PlusCircle size={13} /> {t("Thêm cư dân", "Add Resident")}
                    </button>
                  </div>

                  <div className="bg-white/3 rounded-2xl border border-white/6 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/6 bg-white/3">
                          {[t("Cư dân", "Resident"), t("Căn hộ", "Unit"), t("Tiền thuê", "Rent"), t("Hợp đồng", "Contract"), t("Trạng thái", "Status"), t("Đánh giá", "Rating"), ""].map((h) => (
                            <th key={h} className="text-left px-4 py-3 text-white/40 font-semibold" style={{ fontSize: "0.72rem" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {RESIDENTS.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.unit.toLowerCase().includes(search.toLowerCase())).map((r) => (
                          <tr key={r.id} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold" style={{ fontSize: "0.8rem" }}>
                                  {r.name[0]}
                                </div>
                                <div>
                                  <p className="text-white" style={{ fontSize: "0.83rem" }}>{r.name}</p>
                                  <p className="text-white/35" style={{ fontSize: "0.7rem" }}>{r.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-white/70" style={{ fontSize: "0.83rem" }}>
                              <span className="font-mono bg-white/6 px-2 py-0.5 rounded">{r.unit}</span>
                              <span className="text-white/30 ml-1.5" style={{ fontSize: "0.7rem" }}>{r.type}</span>
                            </td>
                            <td className="px-4 py-3 text-white/80 font-mono" style={{ fontSize: "0.83rem" }}>{fmt(r.rent)}₫</td>
                            <td className="px-4 py-3">
                              <p className="text-white/40" style={{ fontSize: "0.7rem" }}>từ {r.since}</p>
                              <p className="text-white/60" style={{ fontSize: "0.78rem" }}>đến {r.contract}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full border text-xs ${statusBadge[r.status]}`}>
                                {r.status === "active" ? t("Hoạt động", "Active") : r.status === "late" ? t("Trễ hạn", "Late") : t("Hết HĐ", "Expired")}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Star size={11} className="text-amber-400 fill-amber-400" />
                                <span className="text-white/70" style={{ fontSize: "0.82rem" }}>{r.rating}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button className="p-1.5 rounded-lg hover:bg-white/8 text-white/40 hover:text-blue-400 transition-colors"><Eye size={13} /></button>
                                <button className="p-1.5 rounded-lg hover:bg-white/8 text-white/40 hover:text-emerald-400 transition-colors"><Edit3 size={13} /></button>
                                <button className="p-1.5 rounded-lg hover:bg-white/8 text-white/40 hover:text-emerald-400 transition-colors"><Phone size={13} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─── REQUESTS ─── */}
              {tab === "requests" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {["all", "pending", "in_progress", "done"].map((s) => (
                        <button key={s} className={`px-3 py-1.5 rounded-lg border transition-colors ${s === "all" ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400" : "border-white/10 text-white/40 hover:text-white/70"}`} style={{ fontSize: "0.78rem" }}>
                          {s === "all" ? t("Tất cả", "All") : s === "pending" ? t("Chờ xử lý", "Pending") : s === "in_progress" ? t("Đang xử lý", "In Progress") : t("Hoàn thành", "Done")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {REQUESTS.map((req) => (
                      <motion.div key={req.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white/4 rounded-2xl border border-white/6 p-4 flex items-start gap-4">
                        <div className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${req.priority === "urgent" ? "bg-red-500" : req.priority === "high" ? "bg-amber-500" : req.priority === "medium" ? "bg-blue-500" : "bg-white/20"}`} />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <div>
                              <p className="text-white font-semibold" style={{ fontSize: "0.88rem" }}>{req.title}</p>
                              <p className="text-white/40" style={{ fontSize: "0.73rem" }}>{req.id} • {req.unit} • {req.resident}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${priorityBadge[req.priority]}`}>
                                {req.priority === "urgent" ? t("Khẩn cấp", "Urgent") : req.priority === "high" ? t("Cao", "High") : req.priority === "medium" ? t("Vừa", "Medium") : t("Thấp", "Low")}
                              </span>
                              <span className={`px-2.5 py-1 rounded-full border text-xs ${statusBadge[req.status]}`}>
                                {req.status === "pending" ? t("Chờ", "Pending") : req.status === "in_progress" ? t("Đang xử lý", "In Progress") : t("Xong", "Done")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4" style={{ fontSize: "0.73rem" }}>
                            <span className="text-white/35">{req.created}</span>
                            {req.assigned ? (
                              <span className="text-emerald-400/80">→ {req.assigned}</span>
                            ) : (
                              <button className="text-amber-400 hover:text-amber-300 transition-colors">{t("+ Phân công", "+ Assign")}</button>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/25 transition-colors" style={{ fontSize: "0.75rem" }}>{t("Xử lý", "Handle")}</button>
                          <button className="p-1.5 rounded-lg hover:bg-white/8 text-white/30 hover:text-white/60 transition-colors"><MoreHorizontal size={15} /></button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── UTILITIES ─── */}
              {tab === "utilities" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 mb-2">
                    {[
                      { label: t("Tổng điện (kWh)", "Total Power (kWh)"), value: UTILITIES.reduce((a, u) => a + u.electricity, 0).toLocaleString(), icon: Zap,      color: "text-amber-400" },
                      { label: t("Tổng nước (m³)", "Total Water (m³)"),  value: UTILITIES.reduce((a, u) => a + u.water, 0).toFixed(1),                icon: Droplets, color: "text-blue-400" },
                      { label: t("Có WiFi", "WiFi Connected"),           value: `${UTILITIES.filter(u => u.wifi).length}/${UTILITIES.length}`,        icon: Wifi,     color: "text-emerald-400" },
                      { label: t("Chỗ đậu xe", "Parking Slots"),        value: `${UTILITIES.filter(u => u.parking).length}/${UTILITIES.length}`,      icon: Car,      color: "text-violet-400" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white/4 rounded-2xl border border-white/6 p-4 flex items-center gap-3">
                        <s.icon size={20} className={s.color} />
                        <div>
                          <p className="text-white text-lg font-bold">{s.value}</p>
                          <p className="text-white/40" style={{ fontSize: "0.72rem" }}>{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/3 rounded-2xl border border-white/6 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6">
                      <h3 className="text-white font-semibold" style={{ fontSize: "0.88rem" }}>{t("Chỉ số đồng hồ tháng 4/2026", "Meter Readings - April 2026")}</h3>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/25 transition-colors" style={{ fontSize: "0.78rem" }}>
                        <Download size={12} /> {t("Xuất Excel", "Export Excel")}
                      </button>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/6 bg-white/3">
                          {[t("Căn hộ", "Unit"), t("Cư dân", "Resident"), t("Điện (kWh)", "Power (kWh)"), t("Nước (m³)", "Water (m³)"), "WiFi", t("Bãi đậu xe", "Parking"), t("Thang máy", "Elevator")].map((h) => (
                            <th key={h} className="text-left px-4 py-3 text-white/40 font-semibold" style={{ fontSize: "0.72rem" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {UTILITIES.map((u) => (
                          <tr key={u.unit} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                            <td className="px-4 py-3 font-mono text-white/80" style={{ fontSize: "0.83rem" }}>{u.unit}</td>
                            <td className="px-4 py-3 text-white/70" style={{ fontSize: "0.82rem" }}>{u.resident}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 rounded-full bg-white/8">
                                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min((u.electricity / 700) * 100, 100)}%` }} />
                                </div>
                                <span className="text-white/70 font-mono" style={{ fontSize: "0.8rem" }}>{u.electricity}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-white/70 font-mono" style={{ fontSize: "0.8rem" }}>{u.water}</td>
                            <td className="px-4 py-3">
                              {u.wifi
                                ? <span className="flex items-center gap-1 text-emerald-400" style={{ fontSize: "0.78rem" }}><CheckCircle2 size={12} />{t("Kết nối", "Connected")}</span>
                                : <span className="flex items-center gap-1 text-red-400" style={{ fontSize: "0.78rem" }}><XCircle size={12} />{t("Ngắt", "Disconnected")}</span>
                              }
                            </td>
                            <td className="px-4 py-3 text-white/50 font-mono" style={{ fontSize: "0.8rem" }}>{u.parking || "—"}</td>
                            <td className="px-4 py-3">
                              <span className="text-emerald-400" style={{ fontSize: "0.78rem" }}>{u.elevStatus}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─── ACCESS CONTROL ─── */}
              {tab === "access" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: t("Lượt vào hôm nay", "Entries Today"),  value: ACCESS_LOG.filter(l=>l.status==="allowed").length, icon: CheckCircle2, color: "text-emerald-400" },
                      { label: t("Bị từ chối", "Denied"),               value: ACCESS_LOG.filter(l=>l.status==="denied").length,  icon: XCircle,      color: "text-red-400" },
                      { label: t("Khách thăm", "Visitors"),              value: ACCESS_LOG.filter(l=>l.type==="visitor").length,  icon: User,         color: "text-blue-400" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white/4 rounded-2xl border border-white/6 p-5 flex items-center gap-3">
                        <s.icon size={22} className={s.color} />
                        <div>
                          <p className="text-white text-2xl font-bold">{s.value}</p>
                          <p className="text-white/40" style={{ fontSize: "0.73rem" }}>{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/3 rounded-2xl border border-white/6 overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-white/6">
                      <h3 className="text-white font-semibold" style={{ fontSize: "0.88rem" }}>{t("Nhật ký kiểm soát vào ra", "Access Control Log")}</h3>
                    </div>
                    <div className="divide-y divide-white/4">
                      {ACCESS_LOG.map((log, i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors">
                          <span className="text-white/30 w-28 flex-shrink-0 font-mono" style={{ fontSize: "0.73rem" }}>{log.time}</span>
                          <span className={`px-2.5 py-0.5 rounded-full border text-xs flex-shrink-0 ${statusBadge[log.status]}`}>
                            {log.status === "allowed" ? t("Cho phép", "Allowed") : t("Từ chối", "Denied")}
                          </span>
                          <div className="flex-1">
                            <p className="text-white/80" style={{ fontSize: "0.83rem" }}>{log.person}</p>
                            <p className="text-white/35" style={{ fontSize: "0.7rem" }}>
                              {log.type === "visitor" ? t("Khách", "Visitor") : log.type === "resident" ? t("Cư dân", "Resident") : t("Không rõ", "Unknown")}
                              {log.unit !== "—" && ` • ${log.unit}`}
                            </p>
                          </div>
                          <span className="text-white/35 text-right" style={{ fontSize: "0.73rem" }}>{log.gate}</span>
                          <span className="text-white/25 text-right" style={{ fontSize: "0.7rem" }}>{log.method}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── ANNOUNCEMENTS ─── */}
              {tab === "announcements" && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button onClick={() => setShowAnnounceModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 rounded-xl text-white hover:bg-emerald-600 transition-colors" style={{ fontSize: "0.83rem" }}>
                      <PlusCircle size={14} /> {t("Tạo thông báo", "New Announcement")}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {ANNOUNCEMENTS.map((a) => (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/4 rounded-2xl border border-white/6 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="text-white font-semibold" style={{ fontSize: "0.9rem" }}>{a.title}</h3>
                              <span className={`px-2.5 py-0.5 rounded-full border text-xs ${statusBadge[a.status]}`}>
                                {a.status === "published" ? t("Đã đăng", "Published") : t("Nháp", "Draft")}
                              </span>
                            </div>
                            <p className="text-white/50 mb-3" style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>{a.body}</p>
                            <div className="flex items-center gap-4" style={{ fontSize: "0.72rem" }}>
                              <span className="text-white/30">{a.date}</span>
                              <span className="text-white/40">🎯 {a.target}</span>
                              <span className="text-white/30 flex items-center gap-1"><Eye size={11} /> {a.views} {t("lượt xem", "views")}</span>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button className="p-2 rounded-lg hover:bg-white/8 text-white/35 hover:text-blue-400 transition-colors"><Edit3 size={14} /></button>
                            <button className="p-2 rounded-lg hover:bg-white/8 text-white/35 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {showAnnounceModal && (
                      <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-[#0F1E30] rounded-2xl border border-white/10 p-6 w-full max-w-md" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                          <h3 className="text-white font-bold mb-4" style={{ fontSize: "1rem" }}>{t("Tạo thông báo mới", "New Announcement")}</h3>
                          <div className="space-y-3">
                            <input value={announceTitle} onChange={(e) => setAnnounceTitle(e.target.value)} placeholder={t("Tiêu đề thông báo", "Announcement title")}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/25 outline-none focus:border-emerald-500/40 transition-colors" style={{ fontSize: "0.85rem" }} />
                            <textarea value={announceBody} onChange={(e) => setAnnounceBody(e.target.value)} placeholder={t("Nội dung thông báo...", "Announcement body...")}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-white/25 outline-none focus:border-emerald-500/40 transition-colors resize-none" style={{ fontSize: "0.85rem" }} rows={4} />
                            <select value={announceTarget} onChange={(e) => setAnnounceTarget(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-emerald-500/40 transition-colors" style={{ fontSize: "0.85rem" }}>
                              <option value="Toàn toà">{t("Toàn toà nhà", "Entire Building")}</option>
                              <option value="Tầng 1-2">Tầng 1-2</option>
                              <option value="Tầng 3-5">Tầng 3-5</option>
                            </select>
                            <div className="flex gap-2 pt-2">
                              <button onClick={() => setShowAnnounceModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/12 text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors" style={{ fontSize: "0.83rem" }}>{t("Huỷ", "Cancel")}</button>
                              <button onClick={() => setShowAnnounceModal(false)} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5" style={{ fontSize: "0.83rem" }}>
                                <Send size={13} /> {t("Đăng thông báo", "Publish")}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ─── FINANCE ─── */}
              {tab === "finance" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: t("Doanh thu tháng 4", "April Revenue"),  value: "127.0 tr", change: "+4.2%", up: true,  color: "from-emerald-600 to-teal-700", icon: TrendingUp },
                      { label: t("Chi phí tháng 4", "April Expenses"),   value: "64.0 tr",  change: "+1.1%", up: false, color: "from-red-700 to-orange-700",    icon: DollarSign },
                      { label: t("Lợi nhuận ròng", "Net Profit"),        value: "63.0 tr",  change: "+7.3%", up: true,  color: "from-blue-600 to-indigo-700",   icon: BarChart3 },
                    ].map((s) => (
                      <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5`}>
                        <div className="flex items-center justify-between mb-3">
                          <s.icon size={18} className="text-white/70" />
                          <span className={`text-xs font-semibold flex items-center gap-0.5 ${s.up ? "text-emerald-200" : "text-red-200"}`}>
                            {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{s.change}
                          </span>
                        </div>
                        <p className="text-white text-2xl font-bold">{s.value}</p>
                        <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/4 rounded-2xl border border-white/6 p-5">
                      <h3 className="text-white font-semibold mb-4" style={{ fontSize: "0.88rem" }}>{t("Doanh thu theo tháng (triệu ₫)", "Monthly Revenue (million ₫)")}</h3>
                      <div className="space-y-3">
                        {FINANCE.income.map((m) => (
                          <div key={m.month} className="space-y-1.5">
                            <div className="flex justify-between" style={{ fontSize: "0.75rem" }}>
                              <span className="text-white/60">{t("Tháng", "Month")} {m.month}</span>
                              <span className="text-white/70 font-semibold">{m.rent + m.service + m.parking} tr</span>
                            </div>
                            <div className="h-2 bg-white/6 rounded-full overflow-hidden flex gap-0.5">
                              <div className="h-full bg-emerald-500 rounded-l" style={{ width: `${(m.rent / 130) * 100}%` }} />
                              <div className="h-full bg-blue-500" style={{ width: `${(m.service / 130) * 100}%` }} />
                              <div className="h-full bg-violet-500 rounded-r" style={{ width: `${(m.parking / 130) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-4 pt-2">
                          {[{c:"bg-emerald-500", l:t("Tiền thuê","Rent")},{c:"bg-blue-500",l:t("Dịch vụ","Service")},{c:"bg-violet-500",l:t("Bãi xe","Parking")}].map(s=>(
                            <div key={s.l} className="flex items-center gap-1.5" style={{ fontSize: "0.7rem" }}>
                              <div className={`w-2 h-2 rounded-full ${s.c}`} /><span className="text-white/40">{s.l}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/4 rounded-2xl border border-white/6 p-5">
                      <h3 className="text-white font-semibold mb-4" style={{ fontSize: "0.88rem" }}>{t("Phân bổ chi phí tháng 4", "April Expense Breakdown")}</h3>
                      <div className="space-y-2.5">
                        {FINANCE.expenses.map((e) => (
                          <div key={e.label}>
                            <div className="flex justify-between mb-1" style={{ fontSize: "0.75rem" }}>
                              <span className="text-white/65">{e.label}</span>
                              <span className="text-white/70 font-semibold">{fmt(e.amount)}₫</span>
                            </div>
                            <div className="h-1.5 bg-white/6 rounded-full">
                              <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" style={{ width: `${e.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── SETTINGS ─── */}
              {tab === "settings" && (
                <div className="max-w-xl space-y-4">
                  <div className="bg-white/4 rounded-2xl border border-white/6 p-5">
                    <h3 className="text-white font-semibold mb-4" style={{ fontSize: "0.9rem" }}>{t("Thông tin tài khoản", "Account Info")}</h3>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                        {session.name?.[0] || "M"}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{session.name || "Manager"}</p>
                        <p className="text-white/40" style={{ fontSize: "0.78rem" }}>{session.email || "manager@nestaviet.vn"}</p>
                        <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/20 rounded-full text-emerald-400 mt-1 inline-block" style={{ fontSize: "0.68rem" }}>{t("Quản lý toà nhà", "Building Manager")}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: t("Toà nhà quản lý", "Managed Building"), value: session.building || "Toà A - NestaViet Tower" },
                        { label: "Email", value: session.email || "manager@nestaviet.vn" },
                        { label: t("Điện thoại", "Phone"), value: "+84 901 234 567" },
                      ].map((f) => (
                        <div key={f.label} className="flex justify-between items-center py-2 border-b border-white/6">
                          <span className="text-white/40" style={{ fontSize: "0.8rem" }}>{f.label}</span>
                          <span className="text-white/70" style={{ fontSize: "0.83rem" }}>{f.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {[
                    { title: t("Cài đặt thông báo", "Notification Settings"), sub: t("Nhận alert qua email / SMS", "Receive alerts via email / SMS") },
                    { title: t("Bảo mật 2FA", "2FA Security"),                sub: t("Xác thực hai yếu tố", "Two-factor authentication") },
                    { title: t("Nhật ký hoạt động", "Activity Log"),           sub: t("Xem lịch sử thao tác", "View action history") },
                  ].map((s) => (
                    <button key={s.title} className="w-full bg-white/4 rounded-2xl border border-white/6 p-4 flex items-center justify-between hover:bg-white/6 transition-colors text-left">
                      <div>
                        <p className="text-white font-semibold" style={{ fontSize: "0.87rem" }}>{s.title}</p>
                        <p className="text-white/40" style={{ fontSize: "0.75rem" }}>{s.sub}</p>
                      </div>
                      <ChevronRight size={16} className="text-white/25" />
                    </button>
                  ))}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
