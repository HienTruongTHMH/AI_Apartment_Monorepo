import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { verifyListing, buildRawText, checkAgentHealth, type VerifyListingData } from "@features/ai-service/listingVerifier";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart3, Building2, TrendingUp, Users,
  Bell, Plus, Upload, CheckCircle2, AlertTriangle, X, ChevronRight,
  Home, FileText, Settings, LogOut, Sparkles,
  DollarSign, Eye, Camera, Info, RefreshCw, ArrowUpRight, ArrowDownRight,
  Search, MoreHorizontal, UserCheck, UserX, Clock,
  ChevronLeft, Mail, Phone, Hash, MapPin, Shield, Download,
  PlusCircle, Zap, Bot, Cpu, Moon, Sun, Wrench, Network,
  Calendar, ScanLine, Star, Globe, BellOff
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { useCountUp } from "@shared/hooks/useCountUp";
import { DocScanner } from "@features/landlord/components/DocScanner";
import { MaintenanceCalendar } from "@features/landlord/components/MaintenanceCalendar";
import { RatingModal } from "@shared/components/RatingModal";

type LandlordTab = "dashboard" | "properties" | "tenants" | "listing" | "reports" | "settings" | "agents" | "calendar" | "docs";

const REVENUE_DATA = [
  { month: "T10", revenue: 38.5, target: 40 },
  { month: "T11", revenue: 41.2, target: 42 },
  { month: "T12", revenue: 43.8, target: 42 },
  { month: "T1", revenue: 39.1, target: 43 },
  { month: "T2", revenue: 44.5, target: 43 },
  { month: "T3", revenue: 46.2, target: 45 },
  { month: "T4", revenue: 45.2, target: 45 },
];

const OCCUPANCY_DATA = [
  { month: "T10", rate: 83 },
  { month: "T11", rate: 88 },
  { month: "T12", rate: 91 },
  { month: "T1", rate: 87 },
  { month: "T2", rate: 92 },
  { month: "T3", rate: 94 },
  { month: "T4", rate: 92 },
];

const PIE_DATA = [
  { name: "Đã thuê", value: 11, color: "#10b981" },
  { name: "Trống", value: 1, color: "#f59e0b" },
];

const SLA_ALERTS = [
  { id: 1, type: "warning", msg: "Ticket T001 chưa phân công kỹ thuật viên — SLA 4h còn 1h30p", agent: "Smart Concierge" },
  { id: 2, type: "info", msg: "Hợp đồng phòng 805 sẽ hết hạn trong 30 ngày — cần gia hạn", agent: "Contract Agent" },
  { id: 3, type: "success", msg: "Kiểm duyệt tin đăng #L-2204 hoàn tất — Đã đăng lên sàn", agent: "Listing Verifier" },
];

const PROPERTIES = [
  { id: "P01", name: "Sunrise City North - Tầng 12", rooms: 3, occupied: 3, revenue: "34.5M", img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=200", district: "Quận 7" },
  { id: "P02", name: "Vinhomes Grand Park - Block A", rooms: 5, occupied: 4, revenue: "42.2M", img: "https://images.unsplash.com/photo-1585128792103-0b591f96512e?w=200", district: "TP. Thủ Đức" },
  { id: "P03", name: "The River Thủ Thiêm - T15", rooms: 4, occupied: 4, revenue: "56.8M", img: "https://images.unsplash.com/photo-1763401929055-43fd29000be3?w=200", district: "Quận 2" },
];

function getLandlordUser() {
  try { return JSON.parse(localStorage.getItem("nv-landlord-user") || "{}"); } catch { return {}; }
}
function getBuildingTenants() {
  try { return JSON.parse(localStorage.getItem("nv-building-tenants") || "[]"); } catch { return []; }
}

// ─── Notification Center ──────────────────────────────────────────────────────
interface NvNotif {
  id: string;
  type: "agent" | "tenant" | "invoice" | "alert";
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

const LANDLORD_NOTIFS: NvNotif[] = [
  { id: "n1", type: "alert",   title: "Smart Concierge",  msg: "Ticket T001 chưa phân công — SLA còn 1h30p",     time: "2p trước",  read: false },
  { id: "n2", type: "tenant",  title: "Cư dân mới",       msg: "Phạm Quốc Tuấn đăng ký phòng 703 — chờ duyệt",   time: "15p trước", read: false },
  { id: "n3", type: "agent",   title: "Listing Verifier", msg: "Duyệt tin #L-2204 thành công — đã đăng lên sàn", time: "1h trước",  read: false },
  { id: "n4", type: "invoice", title: "Contract Agent",   msg: "Xuất 156 hóa đơn T4 hoàn tất — 0 sai sót",       time: "3h trước",  read: true  },
  { id: "n5", type: "agent",   title: "Super Broker",     msg: "8 phiên tư vấn hôm nay — tỷ lệ chốt 62%",        time: "5h trước",  read: true  },
];

function NotificationCenter() {
  const [notifs, setNotifs] = useState<NvNotif[]>(LANDLORD_NOTIFS);
  const [open, setOpen] = useState(false);
  const unread = notifs.filter((n) => !n.read).length;
  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));

  const typeStyle: Record<NvNotif["type"], { cls: string; Icon: React.ElementType }> = {
    agent:   { cls: "bg-blue-100 text-blue-600",    Icon: Bot           },
    tenant:  { cls: "bg-amber-100 text-amber-600",  Icon: Users         },
    invoice: { cls: "bg-emerald-100 text-emerald-600", Icon: FileText   },
    alert:   { cls: "bg-red-100 text-red-600",      Icon: AlertTriangle },
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen((o) => !o); if (!open && unread > 0) markAllRead(); }}
        className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <Bell size={16} className="text-gray-600" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
            style={{ fontSize: "0.55rem", fontWeight: 700 }}
          >{unread}</motion.span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="font-bold text-gray-900" style={{ fontSize: "0.875rem" }}>Thông báo</p>
                <button onClick={markAllRead} className="text-violet-600 hover:text-violet-700" style={{ fontSize: "0.72rem" }}>Đọc tất cả</button>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifs.map((n, i) => {
                  const { cls, Icon } = typeStyle[n.type];
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex gap-3 px-4 py-3 ${n.read ? "opacity-50" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cls}`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800" style={{ fontSize: "0.78rem" }}>{n.title}</p>
                        <p className="text-gray-500" style={{ fontSize: "0.72rem", lineHeight: 1.4 }}>{n.msg}</p>
                        <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.65rem" }}>{n.time}</p>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── KPI card with number counter ───────────────────────────────────────────
function KpiCard({ label, numTarget, numSuffix, change, up, color, icon: Icon, delay }: {
  label: string; numTarget: number; numSuffix: string; change: string;
  up: boolean; color: string; icon: React.ElementType; delay: number;
}) {
  const count = useCountUp(numTarget, 1000 + delay * 200);
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.92 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.09, type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ y: -5, scale: 1.03, transition: { duration: 0.18 } }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white shadow-md cursor-default nv-tilt-card`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
          <Icon size={16} className="text-white" />
        </div>
        <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white/20" style={{ fontSize: "0.65rem" }}>
          {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {change}
        </div>
      </div>
      <p style={{ fontSize: "1.45rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
        {count}{numSuffix}
      </p>
      <p className="text-white/70 mt-0.5" style={{ fontSize: "0.7rem" }}>{label}</p>
    </motion.div>
  );
}

// ─── Dashboard Tab ──────────────────────────────────────────────────────────
function DashboardTab({ pendingCount }: { pendingCount: number }) {
  const [alerts, setAlerts] = useState(SLA_ALERTS);
  const today = new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Welcome bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <h2 className="text-gray-900" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Tổng quan</h2>
        <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>{today}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards with number counter */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Doanh thu T4" numTarget={45} numSuffix=".2M ₫" change="+12%" up color="from-emerald-500 to-teal-600" icon={DollarSign} delay={0} />
          <KpiCard label="Tỷ lệ lấp đầy" numTarget={92} numSuffix="%" change="+3%" up color="from-violet-500 to-purple-600" icon={Home} delay={1} />
          <KpiCard label="Căn đang thuê" numTarget={11} numSuffix="/12" change="—" up color="from-blue-500 to-cyan-600" icon={Building2} delay={2} />
          <KpiCard label="Cư dân chờ duyệt" numTarget={pendingCount} numSuffix="" change={pendingCount > 0 ? "Mới" : "—"} up={pendingCount === 0} color="from-amber-500 to-orange-500" icon={Users} delay={3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Doanh thu 7 tháng</p>
                <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>Triệu đồng • So với mục tiêu</p>
              </div>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "12px", color: "white", fontSize: "0.75rem" }} formatter={(v: number) => [`${v}M ₫`]} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ r: 3, fill: "#10b981" }} />
                <Area type="monotone" dataKey="target" stroke="#d1d5db" strokeDasharray="5 5" fill="none" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Occupancy pie */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-gray-900 font-bold mb-1" style={{ fontSize: "0.9rem" }}>Lấp đầy tháng này</p>
            <p className="text-gray-400 mb-3" style={{ fontSize: "0.72rem" }}>Tổng {PIE_DATA.reduce((a, b) => a + b.value, 0)} căn</p>
            <div className="flex justify-center">
              <PieChart width={140} height={140}>
                <Pie data={PIE_DATA} cx={70} cy={70} innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={0}>
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-2 mt-2">
              {PIE_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-gray-600" style={{ fontSize: "0.78rem" }}>{d.name}</span>
                  </div>
                  <span className="text-gray-900 font-semibold" style={{ fontSize: "0.78rem" }}>{d.value} căn</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SLA Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-violet-500" />
              <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Thông báo từ AI Agents</p>
            </div>
            <Bell size={16} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id} layout
                initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -16, opacity: 0 }}
                className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                  alert.type === "warning" ? "bg-amber-50 border-amber-200" :
                  alert.type === "success" ? "bg-emerald-50 border-emerald-200" : "bg-blue-50 border-blue-200"
                }`}
              >
                {alert.type === "warning" ? <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" /> :
                 alert.type === "success" ? <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" /> :
                 <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: "0.8rem", color: "#374151", lineHeight: 1.45 }}>{alert.msg}</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.65rem" }}>via {alert.agent}</p>
                </div>
                <button onClick={() => setAlerts((a) => a.filter((x) => x.id !== alert.id))}>
                  <X size={13} className="text-gray-400 hover:text-gray-600" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tenants Tab ─────────────────────────────────────────────────────────────
function TenantsTab({ landlordBuilding }: { landlordBuilding: string }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "cancelled">("all");
  const raw: Array<{
    name: string; email: string; phone?: string; unit: string;
    buildingName: string; registeredAt: string; status: string;
  }> = getBuildingTenants();

  // Combine localStorage tenants with sample data for demo
  const DEMO_TENANTS = [
    { name: "Nguyễn Thị Lan", email: "lan.nguyen@gmail.com", phone: "0901 234 567", unit: "1204", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-01-05T08:00:00Z", status: "active" },
    { name: "Trần Văn Minh", email: "minh.tran@gmail.com", phone: "0912 345 678", unit: "805", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-02-10T09:30:00Z", status: "active" },
    { name: "Lê Thị Hoa", email: "hoa.le@gmail.com", phone: "0903 456 789", unit: "1501", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-03-15T10:00:00Z", status: "pending" },
    { name: "Phạm Quốc Tuấn", email: "tuan.pham@gmail.com", phone: "0934 567 890", unit: "703", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-04-01T14:00:00Z", status: "pending" },
    { name: "Hoàng Thị Mai", email: "mai.hoang@gmail.com", phone: "0945 678 901", unit: "1002", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2024-12-20T08:00:00Z", status: "active" },
    { name: "Đỗ Văn Long", email: "long.do@gmail.com", phone: "0956 789 012", unit: "601", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-01-28T11:00:00Z", status: "cancelled" },
  ];

  const allTenants = [...raw, ...DEMO_TENANTS.filter(d => !raw.find(r => r.email === d.email))];
  const filtered = allTenants.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.email.includes(search) || t.unit.includes(search);
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: allTenants.length,
    active: allTenants.filter(t => t.status === "active").length,
    pending: allTenants.filter(t => t.status === "pending").length,
    cancelled: allTenants.filter(t => t.status === "cancelled").length,
  };

  const statusCfg: Record<string, { label: string; class: string }> = {
    active: { label: "Đang ở", class: "bg-emerald-100 text-emerald-700" },
    pending: { label: "Chờ duyệt", class: "bg-amber-100 text-amber-700" },
    cancelled: { label: "Đã hủy", class: "bg-red-100 text-red-600" },
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Quản lý cư dân</h2>
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>{allTenants.length} cư dân trong toà nhà</p>
          </div>
          <motion.button whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl shadow-sm"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}>
            <PlusCircle size={15} />Thêm cư dân
          </motion.button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1" style={{ minWidth: "200px" }}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm cư dân, email, phòng..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-violet-400 transition-colors bg-white"
              style={{ fontSize: "0.85rem" }} />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "pending", "cancelled"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl border transition-all ${filter === f ? "bg-violet-50 border-violet-300 text-violet-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}
                style={{ fontSize: "0.78rem" }}>
                {f === "all" ? "Tất cả" : f === "active" ? "Đang ở" : f === "pending" ? "Chờ duyệt" : "Đã hủy"}
                <span className="ml-1.5 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full" style={{ fontSize: "0.65rem" }}>{counts[f]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tenants table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid border-b border-gray-100 px-5 py-3 bg-gray-50" style={{ gridTemplateColumns: "1fr 1.5fr 1fr 1fr auto" }}>
            {["Cư dân", "Email / SĐT", "Phòng", "Trạng thái", ""].map(h => (
              <span key={h} className="text-gray-500" style={{ fontSize: "0.73rem", fontWeight: 600, textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-400" style={{ fontSize: "0.85rem" }}>
              Không có cư dân phù hợp
            </div>
          ) : (
            filtered.map((t, i) => (
              <motion.div key={t.email + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="grid px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors items-center"
                style={{ gridTemplateColumns: "1fr 1.5fr 1fr 1fr auto" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold" style={{ fontSize: "0.8rem" }}>{t.name.split(" ").pop()?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold" style={{ fontSize: "0.82rem" }}>{t.name}</p>
                    <p className="text-gray-400" style={{ fontSize: "0.67rem" }}>
                      {new Date(t.registeredAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700" style={{ fontSize: "0.78rem" }}>{t.email}</p>
                  {t.phone && <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>{t.phone}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                  <Hash size={12} className="text-gray-400" />
                  <span className="text-gray-800 font-semibold" style={{ fontSize: "0.82rem" }}>{t.unit}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusCfg[t.status]?.class || "bg-gray-100 text-gray-600"}`}
                  style={{ fontSize: "0.72rem", fontWeight: 600, width: "fit-content" }}>
                  {t.status === "active" ? <UserCheck size={11} /> : t.status === "pending" ? <Clock size={11} /> : <UserX size={11} />}
                  {statusCfg[t.status]?.label || t.status}
                </span>
                <div className="flex items-center gap-1">
                  {t.status === "pending" && (
                    <button className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      style={{ fontSize: "0.7rem", fontWeight: 600 }}>Duyệt</button>
                  )}
                  <button className="p-1.5 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Listing Tab ──────────────────────────────────────────────────────────────
type ExtractedData = {
  entities: { label: string; value: string; confidence: number }[];
  seoTitle: string;
  seoDescription: string;
  seoScore: number;
  // Extended fields from real Gemini API
  amenities?: VerifyListingData["apartment_meta"]["amenities"];
  imageTags?: string[];
  validationStatus?: "Pass" | "Fail";
  feedback?: string;
  issues?: string[];
  missingFields?: string[];
  isReal?: boolean; // true = from actual Gemini, false = local simulation
};

function ListingTab() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: "", address: "", price: "", area: "", rooms: "2", description: "" });
  const [images, setImages] = useState<Array<{ id: string; name: string; status: string; errorMsg?: string }>>([]);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; type: string; message: string; suggestion?: string }>>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [agentOnline, setAgentOnline] = useState<boolean | null>(null); // null = checking

  // Check if the AI Agent backend is reachable on mount
  useEffect(() => {
    checkAgentHealth().then(setAgentOnline);
  }, []);

  // Local simulation fallback (used when backend is offline)
  const runSimulation = useCallback((fd: typeof formData) => {
    const mockErrors: typeof validationErrors = [];
    if (fd.title.length < 15) mockErrors.push({ field: "title", type: "warning", message: "Tiêu đề quá ngắn — AI gợi ý thêm chi tiết", suggestion: `${fd.title || "Căn hộ"} 2PN full nội thất, view đẹp, Quận 7` });
    if (fd.price && parseInt(fd.price) < 5000) mockErrors.push({ field: "price", type: "error", message: "Giá có vẻ quá thấp so với thị trường khu vực này" });
    if (fd.description.length < 50) mockErrors.push({ field: "description", type: "warning", message: "Mô tả quá ngắn — cần ít nhất 50 từ để tối ưu tìm kiếm", suggestion: "Căn hộ 2 phòng ngủ, 2 vệ sinh, đầy đủ nội thất cao cấp. Tầng cao view thoáng. Có hồ bơi, gym, bảo vệ 24/7..." });
    const genTitle = fd.title.length >= 15 ? fd.title : `Cho thuê ${fd.rooms || "2"}PN ${fd.area ? fd.area + "m² " : ""}– ${fd.address?.split(",").slice(-2).join(",").trim() || "TP.HCM"} – Full nội thất cao cấp`;
    const genDesc = fd.description.length >= 80 ? fd.description : `Căn hộ ${fd.rooms || "2"} phòng ngủ, diện tích ${fd.area || "65"}m², đầy đủ nội thất cao cấp. Tọa lạc tại ${fd.address || "trung tâm TP.HCM"}, thuận tiện di chuyển, gần tiện ích. Hợp đồng linh hoạt 12–24 tháng.`;
    let score = 45;
    if (fd.title.length >= 15) score += 15;
    if (fd.description.length >= 80) score += 20;
    if (fd.price) score += 8;
    if (fd.area) score += 7;
    if (mockErrors.length === 0) score += 5;
    setExtractedData({
      entities: [
        { label: "Loại BĐS", value: "Căn hộ chung cư", confidence: 98 },
        { label: "Số phòng ngủ", value: `${fd.rooms || "2"} PN`, confidence: 96 },
        { label: "Diện tích", value: fd.area ? `${fd.area}m²` : "Chưa phát hiện", confidence: fd.area ? 93 : 28 },
        { label: "Giá thuê", value: fd.price ? `${Number(fd.price).toLocaleString()} ₫/th` : "Chưa rõ", confidence: fd.price ? 95 : 22 },
        { label: "Trạng thái NT", value: fd.description.includes("nội thất") ? "Full nội thất" : "Chưa xác định", confidence: fd.description.includes("nội thất") ? 84 : 40 },
        { label: "Chính sách thú cưng", value: "Không đề cập", confidence: 45 },
      ],
      seoTitle: genTitle, seoDescription: genDesc, seoScore: Math.min(score, 95), isReal: false,
    });
    setValidationErrors(mockErrors);
  }, []);

  const triggerAIVerification = async () => {
    setIsVerifying(true);
    setVerificationDone(false);
    setExtractedData(null);

    const rawText = buildRawText(formData);

    // Try real Gemini API first
    const result = await verifyListing({
      rawText,
      owner_id: `landlord-${Date.now()}`,
    });

    if (result && result.success && result.data) {
      // ── Map Gemini response → UI state ──────────────────────────
      const { listing, apartment_meta, image_tags_suggested, validation } = result.data;
      const apiErrors: typeof validationErrors = [];
      if (validation.missing_fields.includes("price"))
        apiErrors.push({ field: "price", type: "error", message: "Gemini: Chưa phát hiện giá thuê trong mô tả" });
      if (validation.missing_fields.includes("area"))
        apiErrors.push({ field: "area", type: "warning", message: "Gemini: Chưa phát hiện diện tích" });
      if (validation.issues.length > 0)
        apiErrors.push({ field: "description", type: "warning", message: validation.issues[0], suggestion: validation.feedback_to_owner });

      setExtractedData({
        entities: [
          { label: "Loại BĐS", value: "Căn hộ chung cư", confidence: 98 },
          { label: "Số phòng ngủ", value: apartment_meta.room_number ? `${apartment_meta.room_number} PN` : `${formData.rooms || "2"} PN`, confidence: 94 },
          { label: "Diện tích", value: apartment_meta.area_m2 ? `${apartment_meta.area_m2}m²` : "Chưa phát hiện", confidence: apartment_meta.area_m2 ? 93 : 25 },
          { label: "Giá thuê", value: listing.price_per_month ? `${listing.price_per_month.toLocaleString()} ₫/th` : "Chưa rõ", confidence: listing.price_per_month ? 96 : 20 },
          { label: "Tiện ích", value: `${apartment_meta.amenities.length} mục`, confidence: apartment_meta.amenities.length > 0 ? 92 : 30 },
          { label: "Trạng thái", value: listing.status === "Published" ? "Sẵn sàng đăng" : "Bản nháp", confidence: 90 },
        ],
        seoTitle: listing.title,
        seoDescription: listing.description,
        seoScore: validation.score,
        amenities: apartment_meta.amenities,
        imageTags: image_tags_suggested,
        validationStatus: validation.status,
        feedback: validation.feedback_to_owner,
        issues: validation.issues,
        missingFields: validation.missing_fields,
        isReal: true,
      });
      setValidationErrors(apiErrors);
      setAgentOnline(true);
    } else {
      // ── Fallback: backend offline or returned error ──────────────
      setAgentOnline(false);
      setTimeout(() => runSimulation(formData), 800);
    }

    setIsVerifying(false);
    setVerificationDone(true);
  };

  const addMockImages = () => {
    setImages([
      { id: "img1", name: "phong-ngu.jpg", status: "ok" },
      { id: "img2", name: "phong-khach-toi.jpg", status: "error", errorMsg: "Ảnh quá tối (độ sáng < 30%) — AI khuyên chụp lại" },
      { id: "img3", name: "nha-bep.jpg", status: "warning", errorMsg: "Ảnh hơi mờ — cân nhắc chụp lại" },
      { id: "img4", name: "bathroom.jpg", status: "ok" },
    ]);
  };

  const errorForField = (field: string) => validationErrors.find(e => e.field === field);
  const applyAISuggestion = (field: string, suggestion: string) => {
    setFormData(f => ({ ...f, [field]: suggestion }));
    setValidationErrors(e => e.filter(v => v.field !== field));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Đăng tin cho thuê</h2>
        <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Listing Verifier AI kiểm duyệt tự động</p>
      </div>
      <div className="p-6 max-w-2xl">
        {/* Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-700 font-semibold" style={{ fontSize: "0.875rem" }}>Bước {step}/3</p>
            <span className="text-violet-600" style={{ fontSize: "0.75rem" }}>{step === 1 ? "Thông tin cơ bản" : step === 2 ? "Tải ảnh" : "Xem lại"}</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(s => <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? "bg-violet-500" : "bg-gray-200"}`} />)}
          </div>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-gray-700 mb-1.5 font-semibold" style={{ fontSize: "0.82rem" }}>Tiêu đề tin *</label>
              <input value={formData.title} onChange={e => { setFormData({ ...formData, title: e.target.value }); setValidationErrors(v => v.filter(x => x.field !== "title")); }}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${errorForField("title") ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50 focus:border-violet-400"}`}
                style={{ fontSize: "0.875rem" }} placeholder="VD: Căn hộ 2PN full nội thất, view đẹp, Q7" />
              {errorForField("title")?.suggestion && (
                <button onClick={() => applyAISuggestion("title", errorForField("title")!.suggestion!)}
                  className="mt-2 text-violet-600 hover:text-violet-700 underline" style={{ fontSize: "0.72rem" }}>
                  ✨ Dùng gợi ý: "{errorForField("title")!.suggestion}"
                </button>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-1.5 font-semibold" style={{ fontSize: "0.82rem" }}>Địa chỉ *</label>
              <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-violet-400" style={{ fontSize: "0.875rem" }} placeholder="Số nhà, đường, phường, quận..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1.5 font-semibold" style={{ fontSize: "0.82rem" }}>Giá thuê (K/tháng)</label>
                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${errorForField("price") ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-violet-400"}`}
                  style={{ fontSize: "0.875rem" }} placeholder="12000" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1.5 font-semibold" style={{ fontSize: "0.82rem" }}>Diện tích (m²)</label>
                <input value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-violet-400" style={{ fontSize: "0.875rem" }} placeholder="65" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1.5 font-semibold" style={{ fontSize: "0.82rem" }}>Mô tả chi tiết *</label>
              <textarea value={formData.description} onChange={e => { setFormData({ ...formData, description: e.target.value }); setValidationErrors(v => v.filter(x => x.field !== "description")); }}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all resize-none ${errorForField("description") ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50 focus:border-violet-400"}`}
                style={{ fontSize: "0.875rem" }} rows={4} placeholder="Mô tả căn hộ, tiện ích..." />
              {errorForField("description")?.suggestion && (
                <button onClick={() => applyAISuggestion("description", errorForField("description")!.suggestion!)}
                  className="mt-2 text-violet-600 hover:text-violet-700 underline" style={{ fontSize: "0.72rem" }}>
                  ✨ Dùng mô tả AI
                </button>
              )}
            </div>
            {/* Agent status indicator */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={agentOnline === null ? { opacity: [1, 0.3, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className={`w-2 h-2 rounded-full ${agentOnline === null ? "bg-amber-400" : agentOnline ? "bg-emerald-500" : "bg-gray-400"}`}
                />
                <span className="text-gray-400" style={{ fontSize: "0.68rem" }}>
                  {agentOnline === null ? "Đang kiểm tra AI agent…" : agentOnline ? "Gemini 2.5-Flash • Online" : "Demo Mode • Backend offline"}
                </span>
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.96 }} onClick={triggerAIVerification} disabled={isVerifying}
              className={`w-full py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all ${isVerifying ? "border-violet-300 bg-violet-50 text-violet-500" : verificationDone && validationErrors.length === 0 ? "border-emerald-400 bg-emerald-50 text-emerald-600" : "border-violet-300 hover:border-violet-400 text-violet-600 hover:bg-violet-50"}`}
              style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              {isVerifying ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><RefreshCw size={16} /></motion.div>Listing Verifier đang xử lý NLP...</> :
               verificationDone && validationErrors.length === 0 ? <><CheckCircle2 size={16} />Đã xác thực — Không có lỗi!</> :
               <><Sparkles size={16} />Kiểm tra bằng Listing Verifier AI</>}
            </motion.button>

            {/* NLP Extraction Results panel */}
            {extractedData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-violet-200 overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.04), rgba(99,102,241,0.02))" }}
              >
                {/* Panel header */}
                <div className="px-5 py-3 border-b border-violet-100 flex items-center justify-between"
                  style={{ background: "rgba(139,92,246,0.06)" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                      <Bot size={12} className="text-violet-600" />
                    </div>
                    <span className="text-violet-700 font-bold" style={{ fontSize: "0.8rem" }}>
                      Listing Verifier — NLP Extraction
                    </span>
                    {/* isReal badge */}
                    <span
                      className="px-2 py-0.5 rounded-full font-bold"
                      style={{
                        fontSize: "0.6rem",
                        background: extractedData.isReal ? "linear-gradient(90deg,#7c3aed,#4f46e5)" : "#e5e7eb",
                        color: extractedData.isReal ? "#fff" : "#6b7280",
                      }}
                    >
                      {extractedData.isReal ? "✦ AI Thật • Gemini 2.5-Flash" : "Demo Mode"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Validation Pass/Fail badge */}
                    {extractedData.validationStatus && (
                      <span
                        className="px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                        style={{
                          fontSize: "0.65rem",
                          background: extractedData.validationStatus === "Pass" ? "#dcfce7" : "#fee2e2",
                          color: extractedData.validationStatus === "Pass" ? "#166534" : "#991b1b",
                        }}
                      >
                        {extractedData.validationStatus === "Pass" ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                        {extractedData.validationStatus === "Pass" ? "Hợp lệ" : "Cần sửa"}
                      </span>
                    )}
                    <span className="text-violet-500" style={{ fontSize: "0.65rem" }}>SEO</span>
                    <span
                      className="px-2 py-0.5 rounded-full font-bold"
                      style={{
                        fontSize: "0.72rem",
                        background: extractedData.seoScore >= 80 ? "#dcfce7" : extractedData.seoScore >= 60 ? "#fef9c3" : "#fee2e2",
                        color: extractedData.seoScore >= 80 ? "#166534" : extractedData.seoScore >= 60 ? "#854d0e" : "#991b1b",
                      }}
                    >
                      {extractedData.seoScore}/100
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Gemini feedback to owner */}
                  {extractedData.feedback && (
                    <div className="rounded-xl border px-4 py-3 flex items-start gap-3"
                      style={{
                        background: extractedData.validationStatus === "Pass" ? "rgba(16,185,129,0.05)" : "rgba(245,158,11,0.05)",
                        borderColor: extractedData.validationStatus === "Pass" ? "#a7f3d0" : "#fde68a",
                      }}>
                      <Info size={14} className="flex-shrink-0 mt-0.5" style={{ color: extractedData.validationStatus === "Pass" ? "#059669" : "#d97706" }} />
                      <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: extractedData.validationStatus === "Pass" ? "#065f46" : "#92400e" }}>
                        <span className="font-bold">Gemini: </span>{extractedData.feedback}
                      </p>
                    </div>
                  )}

                  {/* Extracted entities */}
                  <div>
                    <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                      THỰC THỂ TRÍCH XUẤT (NLP)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {extractedData.entities.map(({ label, value, confidence }) => (
                        <div key={label} className="rounded-xl bg-white border border-gray-100 px-3 py-2.5 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-400" style={{ fontSize: "0.62rem" }}>{label}</span>
                            <span
                              className="font-bold"
                              style={{
                                fontSize: "0.6rem",
                                color: confidence >= 80 ? "#10b981" : confidence >= 50 ? "#f59e0b" : "#ef4444",
                              }}
                            >
                              {confidence}%
                            </span>
                          </div>
                          <p className="text-gray-800 font-semibold" style={{ fontSize: "0.78rem" }}>{value}</p>
                          <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-1 rounded-full transition-all"
                              style={{
                                width: `${confidence}%`,
                                background: confidence >= 80
                                  ? "linear-gradient(90deg,#10b981,#34d399)"
                                  : confidence >= 50
                                  ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                                  : "linear-gradient(90deg,#ef4444,#f87171)",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities grouped by category */}
                  {extractedData.amenities && extractedData.amenities.length > 0 && (
                    <div>
                      <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                        TIỆN ÍCH PHÁT HIỆN (GEMINI)
                      </p>
                      {(["Furniture", "Building", "Policy"] as const).map((cat) => {
                        const items = extractedData.amenities!.filter((a) => a.category === cat);
                        if (!items.length) return null;
                        const catLabel = cat === "Furniture" ? "Nội thất" : cat === "Building" ? "Toà nhà" : "Chính sách";
                        const catColor = cat === "Furniture" ? "#7c3aed" : cat === "Building" ? "#0284c7" : "#059669";
                        const catBg = cat === "Furniture" ? "rgba(124,58,237,0.08)" : cat === "Building" ? "rgba(2,132,199,0.08)" : "rgba(5,150,105,0.08)";
                        return (
                          <div key={cat} className="mb-2">
                            <span className="inline-flex items-center gap-1 mb-1.5 px-2 py-0.5 rounded-full font-semibold"
                              style={{ fontSize: "0.6rem", background: catBg, color: catColor }}>
                              {catLabel}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {items.map((a) => (
                                <span key={a.amenities_name}
                                  className="px-2.5 py-1 rounded-lg bg-white border text-gray-700 font-medium"
                                  style={{ fontSize: "0.72rem", borderColor: `${catColor}30` }}>
                                  {a.amenities_name}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Image tags as chips */}
                  {extractedData.imageTags && extractedData.imageTags.length > 0 && (
                    <div>
                      <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                        GỢI Ý TAG ẢNH (AI)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {extractedData.imageTags.map((tag) => (
                          <span key={tag}
                            className="px-2.5 py-1 rounded-lg font-medium"
                            style={{ fontSize: "0.7rem", background: "rgba(139,92,246,0.1)", color: "#5b21b6" }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Auto SEO title */}
                  <div>
                    <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                      TIÊU ĐỀ SEO TỰ ĐỘNG
                    </p>
                    <div className="rounded-xl bg-white border border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
                      <p className="text-gray-800 font-semibold flex-1" style={{ fontSize: "0.82rem", lineHeight: 1.4 }}>
                        {extractedData.seoTitle}
                      </p>
                      <button
                        onClick={() => applyAISuggestion("title", extractedData.seoTitle)}
                        className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Dùng ngay
                      </button>
                    </div>
                  </div>

                  {/* Auto SEO description */}
                  <div>
                    <p className="text-gray-400 font-bold mb-2" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                      MÔ TẢ SEO TỰ ĐỘNG
                    </p>
                    <div className="rounded-xl bg-white border border-emerald-200 px-4 py-3 flex items-start justify-between gap-3">
                      <p className="text-gray-700 flex-1" style={{ fontSize: "0.78rem", lineHeight: 1.65 }}>
                        {extractedData.seoDescription}
                      </p>
                      <button
                        onClick={() => applyAISuggestion("description", extractedData.seoDescription)}
                        className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors mt-0.5"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Dùng ngay
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <button onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-sm" style={{ fontSize: "0.9rem" }}>
              Tiếp theo — Tải ảnh
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600"><ChevronLeft size={18} /></button>
              <p className="text-gray-600 font-medium" style={{ fontSize: "0.85rem" }}>Tải ảnh — AI kiểm duyệt theo thời gian thực</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
              <Sparkles size={15} className="text-blue-500 flex-shrink-0" />
              <p className="text-blue-700" style={{ fontSize: "0.78rem" }}>AI kiểm tra độ sáng, độ nét và nội dung ảnh</p>
            </div>
            <button onClick={addMockImages}
              className="w-full border-2 border-dashed border-violet-300 rounded-2xl py-8 flex flex-col items-center gap-2 hover:border-violet-400 hover:bg-violet-50/50 transition-all">
              <Upload size={24} className="text-violet-400" />
              <p className="text-gray-700 font-semibold" style={{ fontSize: "0.875rem" }}>Chọn ảnh từ máy</p>
              <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>JPG, PNG — Tối đa 10 ảnh</p>
            </button>
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {images.map(img => (
                  <div key={img.id} className={`relative rounded-xl overflow-hidden border-2 ${img.status === "ok" ? "border-emerald-400" : img.status === "error" ? "border-red-400" : img.status === "warning" ? "border-amber-400" : "border-gray-200"}`}>
                    <div className="aspect-square bg-gray-100 flex items-center justify-center"><Camera size={22} className="text-gray-400" /></div>
                    {img.status === "ok" && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"><CheckCircle2 size={12} className="text-white" /></div>}
                    {(img.status === "error" || img.status === "warning") && img.errorMsg && (
                      <div className={`absolute bottom-0 left-0 right-0 p-2 text-white ${img.status === "error" ? "bg-red-500/90" : "bg-amber-500/90"}`} style={{ fontSize: "0.6rem" }}>{img.errorMsg}</div>
                    )}
                    <p className="absolute top-2 left-2 bg-black/50 text-white px-1.5 py-0.5 rounded" style={{ fontSize: "0.6rem" }}>{img.name.split('.')[0]}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600" style={{ fontSize: "0.875rem" }}>Quay lại</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-2.5 rounded-xl font-semibold" style={{ fontSize: "0.875rem" }}>Tiếp theo</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setStep(2)} className="text-gray-400 hover:text-gray-600"><ChevronLeft size={18} /></button>
              <p className="text-gray-600 font-medium" style={{ fontSize: "0.85rem" }}>Xem lại & Xuất bản</p>
            </div>
            <div className="space-y-3">
              {[["Tiêu đề", formData.title || "—"], ["Địa chỉ", formData.address || "—"], ["Giá thuê", formData.price ? `${Number(formData.price).toLocaleString()} ₫/tháng` : "—"], ["Diện tích", formData.area ? `${formData.area}m²` : "—"]].map(([l, v]) => (
                <div key={l} className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-gray-500" style={{ fontSize: "0.82rem" }}>{l}</span>
                  <span className="text-gray-900 font-semibold" style={{ fontSize: "0.82rem" }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-500" />
              <p className="text-emerald-700" style={{ fontSize: "0.78rem" }}>{images.filter(i => i.status === "ok").length} ảnh đạt chuẩn • Listing Verifier đã duyệt</p>
            </div>
            <button onClick={() => setStep(1)} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl font-bold shadow-md" style={{ fontSize: "1rem" }}>
              🚀 Đăng tin ngay
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Reports Tab ──────────────────────────────────────────────────────────────
function ReportsTab() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Báo cáo tài chính</h2>
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Tổng hợp doanh thu & hiệu suất</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50" style={{ fontSize: "0.8rem" }}>
            <Download size={14} />Xuất báo cáo
          </button>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-gray-900 font-bold mb-4" style={{ fontSize: "0.9rem" }}>Doanh thu theo tháng</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revenueGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`${v}M ₫`]} />
              <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="url(#revenueGrad2)" />
              <Area type="monotone" dataKey="target" stroke="#d1d5db" strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-gray-900 font-bold mb-4" style={{ fontSize: "0.9rem" }}>Tỷ lệ lấp đầy (%)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={OCCUPANCY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[70, 100]} />
              <Tooltip formatter={(v: number) => [`${v}%`]} />
              <Bar dataKey="rate" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-gray-900 font-bold mb-3" style={{ fontSize: "0.9rem" }}>Tóm tắt tháng 4/2025</p>
          <div className="space-y-3">
            {[["Doanh thu thực", "45.200.000 ₫", "text-emerald-600"], ["Mục tiêu", "45.000.000 ₫", "text-gray-600"], ["Chênh lệch", "+200.000 ₫ (+0.4%)", "text-emerald-600"], ["Số căn đang thuê", "11 / 12 căn", "text-gray-900"], ["Tỷ lệ lấp đầy", "91.7%", "text-violet-600"]].map(([l, v, cls]) => (
              <div key={l} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500" style={{ fontSize: "0.82rem" }}>{l}</span>
                <span className={`font-semibold ${cls}`} style={{ fontSize: "0.85rem" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ landlordName, landlordEmail, isDark, toggleDark }: { landlordName: string; landlordEmail: string; isDark: boolean; toggleDark: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Cài đặt</h2>
        <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Quản lý tài khoản và cấu hình hệ thống</p>
      </div>
      <div className="p-6 max-w-2xl space-y-5">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-gray-700 font-semibold mb-4" style={{ fontSize: "0.9rem" }}>Thông tin tài khoản</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
              <Users size={22} className="text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-bold" style={{ fontSize: "1rem" }}>{landlordName}</p>
              <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>{landlordEmail || "—"}</p>
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full mt-1" style={{ fontSize: "0.65rem", fontWeight: 600 }}>
                <Shield size={10} />Verified
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {[{ icon: Mail, label: "Email", value: landlordEmail || "—" }, { icon: Phone, label: "Điện thoại", value: "—" }, { icon: Building2, label: "Toà nhà", value: "—" }].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex items-center gap-2 text-gray-500"><Icon size={14} /><span style={{ fontSize: "0.82rem" }}>{label}</span></div>
                <span className="text-gray-700 font-medium" style={{ fontSize: "0.82rem" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dark mode toggle */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={16} className="text-violet-500" /> : <Sun size={16} className="text-amber-500" />}
            <div>
              <p className="text-gray-800 font-medium" style={{ fontSize: "0.875rem" }}>Giao diện tối</p>
              <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>{isDark ? "Đang bật — dark mode" : "Đang tắt — light mode"}</p>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={toggleDark}
            className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? "bg-violet-500" : "bg-gray-200"}`}>
            <motion.div animate={{ x: isDark ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
          </motion.button>
        </div>

        {/* Settings items */}
        {[
          { label: "Cài đặt thông báo", desc: "Nhận alert qua email / SMS" },
          { label: "Kết nối ngân hàng", desc: "Nhận thanh toán tự động" },
          { label: "API & Webhooks", desc: "Tích hợp hệ thống bên ngoài" },
          { label: "Bảo mật 2FA", desc: "Xác thực hai yếu tố" },
        ].map(({ label, desc }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex justify-between items-center cursor-pointer hover:border-violet-200 transition-colors shadow-sm">
            <div>
              <p className="text-gray-800 font-medium" style={{ fontSize: "0.875rem" }}>{label}</p>
              <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>{desc}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Properties Tab ───────────────────────────────────────────────────────────
function PropertiesTab() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Bất động sản</h2>
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>{PROPERTIES.length} tài sản đang quản lý</p>
          </div>
          <button className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2 rounded-xl shadow-sm" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
            <Plus size={15} />Thêm BĐS
          </button>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PROPERTIES.map((p) => (
          <motion.div key={p.id} whileHover={{ y: -4 }} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer">
            <img src={p.img} alt={p.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 flex items-center gap-1" style={{ fontSize: "0.7rem" }}><MapPin size={10} />{p.district}</span>
                <span className={`px-2 py-0.5 rounded-full text-white text-xs font-semibold ${p.occupied === p.rooms ? "bg-emerald-500" : "bg-amber-500"}`}>{Math.round((p.occupied / p.rooms) * 100)}%</span>
              </div>
              <p className="text-gray-900 font-bold mb-3" style={{ fontSize: "0.9rem" }}>{p.name}</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div className={`h-1.5 rounded-full ${p.occupied === p.rooms ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${(p.occupied / p.rooms) * 100}%` }} />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-emerald-600 font-bold" style={{ fontSize: "1rem" }}>{p.revenue} ₫</span>
                  <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>{p.occupied}/{p.rooms} phòng đang thuê</p>
                </div>
                <button className="flex items-center gap-1 text-violet-600 hover:text-violet-700" style={{ fontSize: "0.75rem" }}><Eye size={13} />Chi tiết</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Agents Tab ───────────────────────────────────────────────────────────────
const AGENT_DEFS = [
  {
    name: "Listing Verifier", desc: "Kiểm duyệt tin đăng bằng NLP & CV",
    gradient: "from-blue-500 to-cyan-500", color: "#3b82f6",
    Icon: FileText,
    metrics: [{ k: "Hôm nay", v: "234 tin" }, { k: "Chính xác", v: "98.2%" }, { k: "Tốc độ", v: "1.8s" }],
    logs: ["Duyệt #L-2204 — NLP OK, 4/4 ảnh đạt", "Từ chối #L-2205 — thiếu ảnh toilet", "Đang xử lý #L-2206..."],
  },
  {
    name: "Super Broker", desc: "Tư vấn tìm nhà bằng RAG + Semantic",
    gradient: "from-emerald-500 to-teal-500", color: "#10b981",
    Icon: Bot,
    metrics: [{ k: "Phiên hôm nay", v: "1,204" }, { k: "Chốt HĐ", v: "62%" }, { k: "Reply", v: "1.2s" }],
    logs: ["Tư vấn 2PN Q7 → 3 gợi ý RAG", "Chốt lịch hẹn T7 cho Nguyễn An", "Query: pet-friendly <12M/tháng"],
  },
  {
    name: "Smart Concierge", desc: "Xử lý sự cố & ticket vận hành 24/7",
    gradient: "from-violet-500 to-purple-500", color: "#8b5cf6",
    Icon: Wrench,
    metrics: [{ k: "Hôm nay", v: "89 tickets" }, { k: "SLA đạt", v: "97.8%" }, { k: "Chờ", v: "3" }],
    logs: ["T001: Gán kỹ thuật Minh — ETA 2h", "T002: Điện thoại xác nhận", "SLA alert: T003 còn 30p"],
  },
  {
    name: "Contract Agent", desc: "Quản lý HĐ, hóa đơn & VietQR",
    gradient: "from-amber-500 to-orange-500", color: "#f59e0b",
    Icon: DollarSign,
    metrics: [{ k: "HĐ tháng", v: "156" }, { k: "Đã TT", v: "142" }, { k: "Lỗi", v: "0" }],
    logs: ["Xuất INV-0425 → 156 hóa đơn", "VietQR gửi email xong 100%", "HĐ phòng 805 hết hạn 30 ngày"],
  },
];

function AgentsTab() {
  const [aiTick, setAiTick] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setAiTick((i) => i + 1), 2200);
    return () => clearInterval(t);
  }, []);

  const activeIdx = aiTick % 4;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Network size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Multi-Agent System</h2>
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>4 AI Agents — LangGraph + Agent SDK</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-700" style={{ fontSize: "0.68rem", fontWeight: 600 }}>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Agent cards 2×2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {AGENT_DEFS.map((ag, i) => {
            const { Icon } = ag;
            const isActive = activeIdx === i;
            const isSelected = selected === i;
            return (
              <motion.div key={ag.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09, type: "spring", stiffness: 200, damping: 22 }}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                onClick={() => setSelected(isSelected ? null : i)}
                className="bg-white rounded-2xl border shadow-sm cursor-pointer overflow-hidden"
                style={{ borderColor: isSelected ? ag.color : undefined, borderWidth: isSelected ? 2 : 1 }}
              >
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${ag.gradient} p-5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center"
                        animate={isActive ? { boxShadow: [`0 0 0px ${ag.color}00`, `0 0 18px ${ag.color}99`, `0 0 0px ${ag.color}00`] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Icon size={18} className="text-white" />
                      </motion.div>
                      <div>
                        <p className="text-white font-bold" style={{ fontSize: "0.95rem" }}>{ag.name}</p>
                        <p className="text-white/70" style={{ fontSize: "0.7rem" }}>{ag.desc}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isActive ? "bg-white/30" : "bg-white/15"}`}
                      style={{ fontSize: "0.62rem", color: "white", fontWeight: 600 }}>
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-white"
                        animate={isActive ? { opacity: [1, 0.2, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 0.8 }} />
                      {isActive ? "PROC..." : "ONLINE"}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    {ag.metrics.map(({ k, v }) => (
                      <div key={k} className="text-center">
                        <p className="font-bold" style={{ fontSize: "0.9rem", color: isActive ? ag.color : "#111827" }}>{v}</p>
                        <p className="text-gray-400" style={{ fontSize: "0.62rem" }}>{k}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-center" style={{ fontSize: "0.68rem" }}>
                    {isSelected ? "Nhấn để thu gọn" : "Nhấn để xem live log"}
                  </p>

                  {/* Live log (expanded) */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-3"
                      >
                        <div className="bg-gray-950 rounded-xl p-3 space-y-1.5">
                          <p style={{ fontSize: "0.58rem", fontFamily: "monospace", color: "#4b5563", marginBottom: 6 }}>▶ LIVE LOG</p>
                          {ag.logs.map((log, li) => (
                            <motion.p key={li} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1 - li * 0.25, x: 0 }}
                              transition={{ delay: li * 0.08 }}
                              style={{ fontSize: "0.68rem", fontFamily: "monospace", color: `${ag.color}${li === 0 ? "ff" : li === 1 ? "cc" : "66"}` }}>
                              [{["08:12", "08:09", "08:04"][li]}] {log}
                            </motion.p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global event stream terminal */}
        <div className="bg-gray-950 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1.5">
              {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
                <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <p style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#6b7280" }}>
              NestaVietAI — Multi-Agent Event Stream
            </p>
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: 6 }, (_, i) => {
              const agIdx = (aiTick + i) % 4;
              const logIdx = (Math.floor((aiTick + i) / 2)) % 3;
              const ag = AGENT_DEFS[agIdx];
              const log = ag.logs[logIdx % ag.logs.length];
              const hr = 8 + ((aiTick + i) % 12);
              const mn = ((aiTick * 3 + i * 7) % 60).toString().padStart(2, "0");
              return (
                <motion.p key={`${aiTick}-${i}`}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1 - i * 0.13, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ fontSize: "0.7rem", fontFamily: "monospace", color: `${ag.color}${i < 2 ? "ee" : i < 4 ? "88" : "33"}` }}>
                  [0{hr}:{mn}] <span style={{ color: "#6b7280" }}>{ag.name} »</span> {log}
                </motion.p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
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

  // Real-time cross-tab sync: re-render when another tab writes to shared storage
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
  void syncVersion; // consumed by re-render

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
          {/* Language toggle */}
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
              <motion.div key="listing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col max-w-3xl w-full mx-auto">
                <ListingTab />
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

          {/* Rating Modal */}
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
