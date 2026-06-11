import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot, Send, MapPin, Home, Wrench, Receipt, User, Star, Heart,
  Calendar, CheckCircle2, Clock, Plus,
  Camera, ArrowUpRight, Wifi, PawPrint, Dumbbell, X,
  Building2, FileText, Banknote, Bell, LogOut, Settings,
  Search, AlertTriangle, TrendingUp, ChevronRight, ChevronDown,
  Filter, Grid, List, Phone, Mail, Shield, Moon, Sun,
  MessageSquare, Map, DollarSign, Globe, ScanLine
} from "lucide-react";
import { OnboardingTour } from "@shared/components/OnboardingTour";
import { ChatInbox } from "@features/chat/ChatInbox";
import { MapView } from "@features/apartment/components/MapView";
import { PriceEstimator } from "@features/listing/components/PriceEstimator";
import { RatingModal } from "@shared/components/RatingModal";

function getTenantUser() {
  try { return JSON.parse(localStorage.getItem("nv-tenant-user") || "{}"); } catch { return {}; }
}
function getListingsBoard() {
  try { return JSON.parse(localStorage.getItem("nv-listings-board") || "[]"); } catch { return []; }
}
function getBuildingTenants() {
  try { return JSON.parse(localStorage.getItem("nv-building-tenants") || "[]"); } catch { return []; }
}

type Tab = "home" | "chat" | "explore" | "services" | "invoices" | "profile" | "inbox" | "map" | "price";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  type: "text" | "cards" | "map";
  content?: string;
  cards?: ApartmentCard[];
}

interface ApartmentCard {
  id: string;
  name: string;
  address: string;
  price: string;
  area: string;
  rooms: string;
  rating: number;
  tags: string[];
  img: string;
  distance: string;
}

const MOCK_APARTMENTS: ApartmentCard[] = [
  {
    id: "a1", name: "Sunrise City North", address: "Quận 7, TP.HCM", price: "11.5M/tháng",
    area: "65m²", rooms: "2PN - 2WC", rating: 4.8,
    tags: ["Cách Q1 18p", "Pet-friendly", "Hồ bơi"],
    img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=400", distance: "3.2km từ Q1"
  },
  {
    id: "a2", name: "Vinhomes Grand Park", address: "TP. Thủ Đức, TP.HCM", price: "9.8M/tháng",
    area: "58m²", rooms: "2PN - 1WC", rating: 4.6,
    tags: ["Cách Q1 25p", "Gym", "An ninh 24/7"],
    img: "https://images.unsplash.com/photo-1585128792103-0b591f96512e?w=400", distance: "8.1km từ Q1"
  },
  {
    id: "a3", name: "The River Thủ Thiêm", address: "Quận 2, TP.HCM", price: "14.2M/tháng",
    area: "72m²", rooms: "2PN - 2WC", rating: 4.9,
    tags: ["View sông", "Trung tâm", "Nội thất cao cấp"],
    img: "https://images.unsplash.com/photo-1763401929055-43fd29000be3?w=400", distance: "1.5km từ Q1"
  },
  {
    id: "a4", name: "Masteri Centre Point", address: "TP. Thủ Đức, TP.HCM", price: "10.5M/tháng",
    area: "55m²", rooms: "1PN - 1WC", rating: 4.5,
    tags: ["Cách Q1 20p", "Hồ bơi", "Trung tâm thương mại"],
    img: "https://images.unsplash.com/photo-1774716925810-e923c8206ed5?w=400", distance: "6.2km từ Q1"
  },
  {
    id: "a5", name: "Landmark 81 Residences", address: "Quận Bình Thạnh, TP.HCM", price: "18.9M/tháng",
    area: "90m²", rooms: "3PN - 2WC", rating: 5.0,
    tags: ["View sông", "Sky pool", "Penthouse"],
    img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=400", distance: "2.8km từ Q1"
  },
  {
    id: "a6", name: "D'Edge Thảo Điền", address: "Quận 2, TP.HCM", price: "13.0M/tháng",
    area: "68m²", rooms: "2PN - 2WC", rating: 4.7,
    tags: ["Cách Q1 12p", "Gym", "Pet-friendly"],
    img: "https://images.unsplash.com/photo-1585128792103-0b591f96512e?w=400", distance: "4.1km từ Q1"
  },
];

const QUICK_PROMPTS = [
  "2PN gần Q1 dưới 12M", "Studio cho 1 người", "Có hồ bơi, pet-friendly", "Gần trường học Q3",
];

const TICKETS = [
  { id: "T001", title: "Máy lạnh không hoạt động", status: "in_progress", date: "20/04/2025", priority: "high", agent: "Smart Concierge" },
  { id: "T002", title: "Bóng đèn hành lang hỏng", status: "resolved", date: "15/04/2025", priority: "low", agent: "Smart Concierge" },
  { id: "T003", title: "Vòi nước rò rỉ phòng tắm", status: "pending", date: "22/04/2025", priority: "medium", agent: "Smart Concierge" },
];

const INVOICES = [
  { id: "INV-0425", month: "Tháng 4/2025", items: [{ label: "Tiền thuê", amount: "11,500,000" }, { label: "Điện", amount: "680,000" }, { label: "Nước", amount: "120,000" }, { label: "Phí dịch vụ", amount: "200,000" }], total: "12,500,000", status: "unpaid", due: "25/04/2025" },
  { id: "INV-0325", month: "Tháng 3/2025", items: [{ label: "Tiền thuê", amount: "11,500,000" }, { label: "Điện", amount: "720,000" }, { label: "Nước", amount: "130,000" }, { label: "Phí dịch vụ", amount: "200,000" }], total: "12,550,000", status: "paid", due: "25/03/2025" },
];

const TAG_ICONS: Record<string, React.ElementType> = {
  "Pet-friendly": PawPrint, "Gym": Dumbbell, "Hồ bơi": Wifi, "Trung tâm": MapPin,
  "Nội thất cao cấp": Star, "An ninh 24/7": CheckCircle2, "Cách Q1 18p": Clock,
  "Cách Q1 25p": Clock, "View sông": MapPin, "Cách Q1 12p": Clock, "Cách Q1 20p": Clock,
};

// ─── Notification Center ──────────────────────────────────────────────────────
interface NvNotif {
  id: string;
  type: "invoice" | "agent" | "alert" | "info";
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

const TENANT_NOTIFS: NvNotif[] = [
  { id: "t1", type: "invoice", title: "Hóa đơn T4/2025",   msg: "12.500.000 ₫ — Hạn thanh toán 25/04/2025",       time: "Hôm nay",   read: false },
  { id: "t2", type: "agent",   title: "Smart Concierge",   msg: "Ticket T001 đang xử lý — ETA 2h nữa",             time: "30p trước", read: false },
  { id: "t3", type: "alert",   title: "Hợp đồng sắp hết", msg: "Còn 245 ngày — hạn 31/12/2025. Cần gia hạn sớm", time: "1h trước",  read: false },
  { id: "t4", type: "info",    title: "Super Broker AI",   msg: "3 căn hộ mới phù hợp yêu cầu của bạn",           time: "3h trước",  read: true  },
  { id: "t5", type: "agent",   title: "Listing Verifier",  msg: "Phòng bạn quan tâm (a3) vừa được cập nhật giá",  time: "5h trước",  read: true  },
];

function NotificationCenter({ isDark }: { isDark: boolean }) {
  const [notifs, setNotifs] = useState<NvNotif[]>(TENANT_NOTIFS);
  const [open, setOpen] = useState(false);
  const unread = notifs.filter((n) => !n.read).length;
  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));

  const typeStyle: Record<NvNotif["type"], { cls: string; Icon: React.ElementType }> = {
    invoice: { cls: "bg-amber-100 text-amber-600",   Icon: Receipt       },
    agent:   { cls: "bg-emerald-100 text-emerald-600", Icon: Bot         },
    alert:   { cls: "bg-red-100 text-red-600",       Icon: AlertTriangle },
    info:    { cls: "bg-blue-100 text-blue-600",      Icon: FileText     },
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen((o) => !o); if (!open && unread > 0) markAllRead(); }}
        className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <Bell size={16} className="text-gray-600" />
        {unread > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
            style={{ fontSize: "0.55rem", fontWeight: 700 }}>
            {unread}
          </motion.span>
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
              className={`absolute right-0 top-11 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
            >
              <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-slate-700" : "border-gray-100"}`}>
                <p className="font-bold" style={{ fontSize: "0.875rem", color: isDark ? "#f1f5f9" : "#111827" }}>Thông báo</p>
                <button onClick={markAllRead} className="text-emerald-600 hover:text-emerald-700" style={{ fontSize: "0.72rem" }}>Đọc tất cả</button>
              </div>
              <div className={`divide-y max-h-72 overflow-y-auto ${isDark ? "divide-slate-700" : "divide-gray-50"}`}>
                {notifs.map((n, i) => {
                  const { cls, Icon } = typeStyle[n.type];
                  return (
                    <motion.div key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex gap-3 px-4 py-3 ${n.read ? "opacity-50" : ""}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cls}`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold" style={{ fontSize: "0.78rem", color: isDark ? "#e2e8f0" : "#1f2937" }}>{n.title}</p>
                        <p style={{ fontSize: "0.72rem", lineHeight: 1.4, color: isDark ? "#64748b" : "#6b7280" }}>{n.msg}</p>
                        <p style={{ fontSize: "0.65rem", color: isDark ? "#475569" : "#9ca3af", marginTop: 2 }}>{n.time}</p>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />}
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

// ─── Home Tab ─────────────────────────────────────────────────────────────────
function HomeTab({ onTabChange }: { onTabChange: (t: Tab) => void }) {
  const tenantUser = getTenantUser();
  const tenantName = tenantUser.name || "Cư dân";
  const now = new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

  const kpis = [
    { label: "Hóa đơn tháng 4", value: "12.5M ₫", sub: "Hạn: 25/04/2025", color: "from-amber-500 to-orange-500", icon: Receipt, urgent: true },
    { label: "Ngày còn lại HĐ", value: "245 ngày", sub: "Hết hạn: 31/12/2025", color: "from-violet-500 to-purple-600", icon: FileText, urgent: false },
    { label: "Ticket đang xử lý", value: "2 yêu cầu", sub: "Smart Concierge AI", color: "from-blue-500 to-cyan-600", icon: Wrench, urgent: false },
    { label: "Điểm cư dân", value: "⭐ 4.9/5", sub: "Top 5% tòa nhà", color: "from-emerald-500 to-teal-600", icon: Star, urgent: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Welcome header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>{now}</p>
            <h2 className="text-gray-900" style={{ fontSize: "1.25rem", fontWeight: 800 }}>
              Xin chào, {tenantName} 👋
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Building2 size={13} className="text-emerald-500" />
              <span className="text-gray-500" style={{ fontSize: "0.78rem" }}>
                {tenantUser.unit ? `Phòng ${tenantUser.unit}` : "Phòng 1204"} •{" "}
                {tenantUser.buildingName || "Sunrise City North"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Bell size={16} className="text-gray-600" />
              </button>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center" style={{ fontSize: "0.55rem", fontWeight: 700 }}>2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.09, type: "spring", stiffness: 220, damping: 22 }}
              whileHover={{ y: -5, scale: 1.03, transition: { duration: 0.18 } }}
              className={`bg-gradient-to-br ${k.color} rounded-2xl p-4 text-white shadow-md cursor-default`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <k.icon size={16} className="text-white" />
                </div>
                {k.urgent && (
                  <span className="px-2 py-0.5 rounded-full bg-white/25 text-white" style={{ fontSize: "0.6rem", fontWeight: 700 }}>⚠ Cần xử lý</span>
                )}
              </div>
              <motion.p
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.09 + 0.18, type: "spring", stiffness: 300, damping: 20 }}
                style={{ fontSize: "1.25rem", fontWeight: 900, letterSpacing: "-0.02em" }}
              >
                {k.value}
              </motion.p>
              <p className="text-white/80 mt-0.5" style={{ fontSize: "0.7rem" }}>{k.label}</p>
              <p className="text-white/50" style={{ fontSize: "0.65rem" }}>{k.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: tickets + invoice */}
          <div className="lg:col-span-2 space-y-5">
            {/* Upcoming invoice */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Hóa đơn sắp đến hạn</p>
                <button onClick={() => onTabChange("invoices")} className="text-emerald-600 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                  Xem tất cả <ChevronRight size={13} />
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500" style={{ fontSize: "0.8rem" }}>Tháng 4/2025 — INV-0425</p>
                    <p className="text-gray-900" style={{ fontSize: "1.6rem", fontWeight: 800 }}>12.500.000 ₫</p>
                    <p className="text-amber-600" style={{ fontSize: "0.78rem" }}>⏰ Hạn thanh toán: 25/04/2025</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onTabChange("invoices")}
                    className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl shadow-md"
                    style={{ fontSize: "0.85rem", fontWeight: 700 }}
                  >
                    Thanh toán
                  </motion.button>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {[{ label: "Tiền thuê", v: "11.5M" }, { label: "Điện", v: "680K" }, { label: "Nước", v: "120K" }, { label: "DV", v: "200K" }].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-gray-900 font-semibold" style={{ fontSize: "0.85rem" }}>{item.v}</p>
                      <p className="text-gray-400" style={{ fontSize: "0.65rem" }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tickets */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Yêu cầu gần nhất</p>
                <button onClick={() => onTabChange("services")} className="text-violet-600 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                  Tất cả <ChevronRight size={13} />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {TICKETS.slice(0, 3).map((ticket) => {
                  const s = { pending: { label: "Chờ xử lý", cls: "bg-amber-100 text-amber-700" }, in_progress: { label: "Đang xử lý", cls: "bg-blue-100 text-blue-700" }, resolved: { label: "Đã xong", cls: "bg-emerald-100 text-emerald-700" } }[ticket.status];
                  return (
                    <div key={ticket.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ticket.status === "resolved" ? "bg-emerald-100" : ticket.status === "in_progress" ? "bg-blue-100" : "bg-amber-100"}`}>
                        <Wrench size={15} className={ticket.status === "resolved" ? "text-emerald-600" : ticket.status === "in_progress" ? "text-blue-600" : "text-amber-600"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-semibold truncate" style={{ fontSize: "0.85rem" }}>{ticket.title}</p>
                        <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>{ticket.date} • {ticket.agent}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full flex-shrink-0 ${s?.cls}`} style={{ fontSize: "0.65rem", fontWeight: 600 }}>{s?.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: AI + quick actions */}
          <div className="space-y-5">
            {/* AI Super Broker */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTabChange("chat")}
              className="w-full bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl p-5 text-white border border-white/10 shadow-xl block"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p style={{ fontSize: "0.9rem", fontWeight: 700 }}>Super Broker AI</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-emerald-400" style={{ fontSize: "0.65rem" }}>Đang hoạt động</p>
                  </div>
                </div>
              </div>
              <p className="text-white/60 text-left" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
                Tìm căn hộ phù hợp, đặt lịch xem, tư vấn hợp đồng — tất cả trong một cuộc trò chuyện.
              </p>
              <div className="flex items-center gap-1 mt-4 text-emerald-400" style={{ fontSize: "0.75rem" }}>
                <span>Bắt đầu trò chuyện</span>
                <ArrowUpRight size={13} />
              </div>
            </motion.button>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-gray-700 font-bold mb-3" style={{ fontSize: "0.85rem" }}>Truy cập nhanh</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Báo sự cố", icon: Wrench, color: "bg-violet-50 text-violet-700 hover:bg-violet-100", tab: "services" as Tab },
                  { label: "Xem hóa đơn", icon: Receipt, color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100", tab: "invoices" as Tab },
                  { label: "Khám phá", icon: MapPin, color: "bg-amber-50 text-amber-700 hover:bg-amber-100", tab: "explore" as Tab },
                  { label: "Hồ sơ", icon: User, color: "bg-blue-50 text-blue-700 hover:bg-blue-100", tab: "profile" as Tab },
                ].map(({ label, icon: Icon, color, tab }) => (
                  <button
                    key={label}
                    onClick={() => onTabChange(tab)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl transition-colors ${color}`}
                  >
                    <Icon size={18} />
                    <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lease status */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={15} className="text-violet-600" />
                <p className="text-violet-900 font-bold" style={{ fontSize: "0.85rem" }}>Hợp đồng thuê</p>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Số HĐ", value: "HD-2025-001" },
                  { label: "Bắt đầu", value: "01/01/2025" },
                  { label: "Kết thúc", value: "31/12/2025" },
                  { label: "Giá thuê", value: "11.5M/tháng" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-violet-600" style={{ fontSize: "0.75rem" }}>{row.label}</span>
                    <span className="text-violet-900 font-semibold" style={{ fontSize: "0.75rem" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chat Tab ─────────────────────────────────────────────────────────────────
function ApartmentCarousel({ cards }: { cards: ApartmentCard[] }) {
  const [liked, setLiked] = useState<Set<string>>(new Set());
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {cards.map((card) => (
        <motion.div key={card.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="flex-shrink-0 w-56 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 cursor-pointer">
          <div className="relative h-32">
            <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
            <button onClick={(e) => { e.stopPropagation(); setLiked((prev) => { const next = new Set(prev); next.has(card.id) ? next.delete(card.id) : next.add(card.id); return next; }); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow">
              <Heart size={12} className={liked.has(card.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
          </div>
          <div className="p-3">
            <p className="text-gray-900 font-bold truncate" style={{ fontSize: "0.8rem" }}>{card.name}</p>
            <p className="text-gray-500 flex items-center gap-1 mb-2" style={{ fontSize: "0.68rem" }}><MapPin size={9} />{card.address}</p>
            <div className="flex justify-between items-center">
              <span className="text-emerald-600 font-bold" style={{ fontSize: "0.82rem" }}>{card.price}</span>
              <button className="bg-emerald-500 text-white px-2 py-1 rounded-lg" style={{ fontSize: "0.65rem", fontWeight: 600 }}>Đặt xem</button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MapPreview() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 h-36 relative bg-gradient-to-br from-slate-100 to-slate-200">
      <svg width="100%" height="100%" viewBox="0 0 300 144" className="opacity-60">
        <rect width="300" height="144" fill="#e8f0fe" />
        <line x1="0" y1="72" x2="300" y2="72" stroke="#c5d0e8" strokeWidth="12" />
        <line x1="150" y1="0" x2="150" y2="144" stroke="#c5d0e8" strokeWidth="8" />
        <line x1="0" y1="36" x2="300" y2="36" stroke="#d4dff0" strokeWidth="4" />
        <line x1="0" y1="108" x2="300" y2="108" stroke="#d4dff0" strokeWidth="4" />
        <rect x="30" y="18" width="40" height="25" rx="4" fill="#cbd5e1" />
        <rect x="200" y="45" width="60" height="35" rx="4" fill="#cbd5e1" />
        <rect x="80" y="85" width="50" height="30" rx="4" fill="#cbd5e1" />
        <circle cx="120" cy="63" r="11" fill="#10b981" opacity="0.9" /><circle cx="120" cy="63" r="4" fill="white" />
        <circle cx="185" cy="90" r="11" fill="#10b981" opacity="0.9" /><circle cx="185" cy="90" r="4" fill="white" />
        <circle cx="60" cy="100" r="11" fill="#10b981" opacity="0.9" /><circle cx="60" cy="100" r="4" fill="white" />
      </svg>
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full shadow text-gray-700" style={{ fontSize: "0.68rem", fontWeight: 600 }}>
        📍 3 căn hộ phù hợp
      </div>
    </div>
  );
}

function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "agent", type: "text", content: "Xin chào! Tôi là **Super Broker AI** 🤖\n\nTôi có thể giúp bạn tìm căn hộ phù hợp nhất. Hãy cho tôi biết:\n- 📍 Khu vực bạn muốn ở?\n- 💰 Ngân sách hàng tháng?\n- 🏠 Cần mấy phòng ngủ?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", type: "text", content: msg }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses: ChatMessage[] = [
        { id: (Date.now() + 1).toString(), role: "agent", type: "text", content: "Tuyệt! Dựa trên yêu cầu của bạn, tôi đã tìm được **3 căn hộ phù hợp**. Đây là kết quả:" },
        { id: (Date.now() + 2).toString(), role: "agent", type: "cards", cards: MOCK_APARTMENTS.slice(0, 3) },
        { id: (Date.now() + 3).toString(), role: "agent", type: "map" },
        { id: (Date.now() + 4).toString(), role: "agent", type: "text", content: "💡 **Gợi ý:** Sunrise City North (Quận 7) rất phù hợp — cách Q1 18 phút, có hồ bơi, pet-friendly, giá 11.5M/tháng.\n\nBạn có muốn đặt lịch xem không?" },
      ];
      let delay = 0;
      responses.forEach((r) => { delay += 700; setTimeout(() => { setMessages((prev) => [...prev, r]); }, delay); });
    }, 1400);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Agent header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow">
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <p className="text-gray-900 font-bold" style={{ fontSize: "0.95rem" }}>Super Broker AI</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-emerald-600" style={{ fontSize: "0.72rem" }}>Đang hoạt động • Powered by RAG + Agent SDK</p>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {QUICK_PROMPTS.slice(0, 2).map((p) => (
            <button key={p} onClick={() => sendMessage(p)}
              className="px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors hidden lg:block"
              style={{ fontSize: "0.72rem" }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-1">
        {messages.map((msg) => (
          msg.role === "user" ? (
            <motion.div key={msg.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex justify-end mb-3">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-md shadow-sm" style={{ fontSize: "0.875rem" }}>
                {msg.content}
              </div>
            </motion.div>
          ) : (
            <motion.div key={msg.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-white" />
              </div>
              <div className="flex-1 max-w-2xl">
                {msg.type === "text" && (
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm" style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.7 }}>
                    {msg.content?.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-1" : ""}>{line.split("**").map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}</p>
                    ))}
                  </div>
                )}
                {msg.type === "cards" && msg.cards && <div className="mt-1"><ApartmentCarousel cards={msg.cards} /></div>}
                {msg.type === "map" && <div className="mt-1"><MapPreview /></div>}
              </div>
            </motion.div>
          )
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts + input */}
      <div className="bg-white border-t border-gray-100">
        <div className="px-6 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {QUICK_PROMPTS.map((p) => (
            <button key={p} onClick={() => sendMessage(p)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              style={{ fontSize: "0.72rem" }}>{p}</button>
          ))}
        </div>
        <div className="px-6 pb-5 pt-2">
          <div className="flex items-end gap-3 bg-gray-100 rounded-2xl px-4 py-3">
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Nhập yêu cầu tìm nhà... (Enter để gửi)"
              className="flex-1 bg-transparent resize-none outline-none text-gray-800 placeholder-gray-400"
              style={{ fontSize: "0.875rem", maxHeight: "100px", minHeight: "20px" }} rows={1} />
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => sendMessage()}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow flex-shrink-0">
              <Send size={16} className="text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Explore Tab ──────────────────────────────────────────────────────────────
function ExploreTab() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDistrict, setSelectedDistrict] = useState("Tất cả");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const listings = getListingsBoard() as { id: string; title: string; price: string; area: string; district: string; description: string; type: string; postedAt: string }[];

  const districts = ["Tất cả", "Quận 1", "Quận 2", "Quận 7", "Quận 9", "Bình Thạnh", "TP. Thủ Đức"];
  const filtered = MOCK_APARTMENTS.filter((apt) => {
    const matchSearch = apt.name.toLowerCase().includes(search.toLowerCase()) || apt.address.toLowerCase().includes(search.toLowerCase());
    const matchDistrict = selectedDistrict === "Tất cả" || apt.address.includes(selectedDistrict);
    return matchSearch && matchDistrict;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Khám phá căn hộ</h2>
            <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>Tìm kiếm & lọc theo nhu cầu</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewMode("grid")} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
              <Grid size={16} />
            </button>
            <button onClick={() => setViewMode("list")} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
              <List size={16} />
            </button>
          </div>
        </div>
        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, địa chỉ, quận..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-gray-800 outline-none focus:border-emerald-400 transition-colors"
            style={{ fontSize: "0.875rem" }} />
        </div>
        {/* District filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {districts.map((d) => (
            <button key={d} onClick={() => setSelectedDistrict(d)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full transition-colors ${selectedDistrict === d ? "bg-emerald-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              style={{ fontSize: "0.75rem", fontWeight: selectedDistrict === d ? 600 : 400 }}>{d}</button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* AI Listings from board */}
        {listings.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Bot size={15} className="text-violet-600" />
              <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Tin đăng mới từ AI & Quản lý</p>
              <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700" style={{ fontSize: "0.65rem", fontWeight: 700 }}>Mới</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.slice(0, 3).map((listing) => (
                <motion.div key={listing.id} whileHover={{ y: -2 }}
                  className="bg-white rounded-2xl border border-violet-100 shadow-sm p-4 cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700" style={{ fontSize: "0.65rem", fontWeight: 600 }}>
                      {listing.type === "ai" ? "🤖 AI Đăng" : "🏢 Quản lý đăng"}
                    </span>
                    <span className="text-gray-400" style={{ fontSize: "0.65rem" }}>{listing.postedAt}</span>
                  </div>
                  <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>{listing.title}</p>
                  <p className="text-gray-500 mt-1 line-clamp-2" style={{ fontSize: "0.78rem" }}>{listing.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-emerald-600 font-bold" style={{ fontSize: "0.95rem" }}>{listing.price}</p>
                      <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>{listing.area} • {listing.district}</p>
                    </div>
                    <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl" style={{ fontSize: "0.75rem", fontWeight: 600 }}>Liên hệ</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Apartments grid */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-700 font-bold" style={{ fontSize: "0.9rem" }}>Căn hộ nổi bật ({filtered.length})</p>
          <div className="flex items-center gap-1 text-gray-500" style={{ fontSize: "0.75rem" }}>
            <Filter size={13} />Lọc nâng cao
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((apt) => (
              <motion.div key={apt.id} whileHover={{ y: -3 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer">
                <div className="relative h-44">
                  <img src={apt.img} alt={apt.name} className="w-full h-full object-cover" />
                  <button onClick={() => setLiked((prev) => { const next = new Set(prev); next.has(apt.id) ? next.delete(apt.id) : next.add(apt.id); return next; })}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow">
                    <Heart size={14} className={liked.has(apt.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                    <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>{apt.name}</p>
                    <p className="text-white/70 flex items-center gap-1" style={{ fontSize: "0.7rem" }}><MapPin size={9} />{apt.address}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {apt.tags.map((tag) => { const Icon = TAG_ICONS[tag] || CheckCircle2; return (
                      <span key={tag} className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full" style={{ fontSize: "0.65rem" }}>
                        <Icon size={8} />{tag}
                      </span>
                    ); })}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-emerald-600 font-bold" style={{ fontSize: "1rem" }}>{apt.price}</span>
                      <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>{apt.area} • {apt.rooms}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-gray-600 font-semibold" style={{ fontSize: "0.8rem" }}>{apt.rating}</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    <Calendar size={13} />Đặt lịch xem
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((apt) => (
              <motion.div key={apt.id} whileHover={{ x: 2 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex cursor-pointer">
                <img src={apt.img} alt={apt.name} className="w-40 h-32 object-cover flex-shrink-0" />
                <div className="p-4 flex-1 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>{apt.name}</p>
                      <div className="flex items-center gap-0.5"><Star size={11} className="fill-amber-400 text-amber-400" /><span className="text-gray-600" style={{ fontSize: "0.75rem" }}>{apt.rating}</span></div>
                    </div>
                    <p className="text-gray-500 flex items-center gap-1 mb-2" style={{ fontSize: "0.78rem" }}><MapPin size={11} />{apt.address}</p>
                    <div className="flex flex-wrap gap-1">
                      {apt.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full" style={{ fontSize: "0.65rem" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-emerald-600 font-bold" style={{ fontSize: "1rem" }}>{apt.price}</p>
                    <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>{apt.area}</p>
                    <button className="mt-2 bg-emerald-500 text-white px-4 py-1.5 rounded-xl" style={{ fontSize: "0.75rem", fontWeight: 600 }}>Đặt xem</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Services Tab ─────────────────────────────────────────────────────────────
function ServicesTab() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "", desc: "", photo: false });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); setFormData({ title: "", category: "", desc: "", photo: false }); }, 2000);
  };

  const statusConfig = {
    pending: { label: "Chờ xử lý", cls: "bg-amber-100 text-amber-700", icon: Clock },
    in_progress: { label: "Đang xử lý", cls: "bg-blue-100 text-blue-700", icon: Wrench },
    resolved: { label: "Đã xong", cls: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Yêu cầu dịch vụ</h2>
            <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>Smart Concierge AI xử lý 24/7</p>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-violet-500 text-white px-4 py-2.5 rounded-xl shadow-md"
            style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            <Plus size={16} />Tạo yêu cầu mới
          </motion.button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* AI status */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow">
            <Bot size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-violet-900 font-bold" style={{ fontSize: "0.875rem" }}>Smart Concierge AI</p>
            <p className="text-violet-600" style={{ fontSize: "0.78rem" }}>Đang phân công kỹ thuật viên cho ticket T001 — ETA 2h nữa</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-violet-600" style={{ fontSize: "0.7rem" }}>Hoạt động</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Tổng ticket", value: "3", color: "bg-white border border-gray-100" },
            { label: "Đang xử lý", value: "1", color: "bg-blue-50 border border-blue-100" },
            { label: "Đã giải quyết", value: "1", color: "bg-emerald-50 border border-emerald-100" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center shadow-sm`}>
              <p className="text-gray-900 font-bold" style={{ fontSize: "1.4rem" }}>{s.value}</p>
              <p className="text-gray-500" style={{ fontSize: "0.72rem" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Ticket list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Danh sách yêu cầu</p>
          </div>
          <div className="divide-y divide-gray-50">
            {TICKETS.map((ticket) => {
              const s = statusConfig[ticket.status as keyof typeof statusConfig];
              return (
                <motion.div key={ticket.id} whileHover={{ backgroundColor: "#f9fafb" }}
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.cls.split(" ")[0]}`}>
                    <s.icon size={16} className={s.cls.split(" ")[1]} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-gray-900 font-semibold" style={{ fontSize: "0.875rem" }}>{ticket.title}</p>
                      {ticket.priority === "high" && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600" style={{ fontSize: "0.6rem", fontWeight: 700 }}>Ưu tiên cao</span>
                      )}
                    </div>
                    <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>#{ticket.id} • {ticket.date} • {ticket.agent}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full flex-shrink-0 ${s.cls}`} style={{ fontSize: "0.7rem", fontWeight: 600 }}>{s.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {submitted ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <p className="text-gray-900 font-bold" style={{ fontSize: "1rem" }}>Đã gửi yêu cầu!</p>
                  <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>Smart Concierge AI đang tiếp nhận</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-gray-900 font-bold" style={{ fontSize: "1.05rem" }}>Tạo yêu cầu mới</h3>
                    <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"><X size={16} /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-700 block mb-1.5 font-semibold" style={{ fontSize: "0.8rem" }}>Tiêu đề sự cố *</label>
                      <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors"
                        style={{ fontSize: "0.875rem" }} placeholder="VD: Điều hòa không lạnh..." />
                    </div>
                    <div>
                      <label className="text-gray-700 block mb-1.5 font-semibold" style={{ fontSize: "0.8rem" }}>Danh mục</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[{ v: "electric", l: "Điện", e: "⚡" }, { v: "plumbing", l: "Nước", e: "🚿" }, { v: "ac", l: "Điều hòa", e: "❄️" }, { v: "internet", l: "Internet", e: "📡" }, { v: "security", l: "An ninh", e: "🔒" }, { v: "other", l: "Khác", e: "🔧" }].map((cat) => (
                          <button key={cat.v} onClick={() => setFormData({ ...formData, category: cat.v })}
                            className={`py-2.5 px-3 rounded-xl border text-center transition-all ${formData.category === cat.v ? "bg-violet-50 border-violet-400 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                            style={{ fontSize: "0.78rem" }}>
                            <div className="text-lg">{cat.e}</div>
                            <div style={{ fontWeight: formData.category === cat.v ? 600 : 400 }}>{cat.l}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-700 block mb-1.5 font-semibold" style={{ fontSize: "0.8rem" }}>Mô tả chi tiết</label>
                      <textarea value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-violet-400 transition-colors resize-none"
                        style={{ fontSize: "0.875rem" }} rows={3} placeholder="Mô tả chi tiết sự cố..." />
                    </div>
                    <button onClick={() => setFormData({ ...formData, photo: !formData.photo })}
                      className={`w-full border-2 border-dashed rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors ${formData.photo ? "border-violet-400 bg-violet-50 text-violet-600" : "border-gray-300 text-gray-500 hover:border-gray-400"}`}>
                      {formData.photo ? <><CheckCircle2 size={18} />Đã thêm ảnh</> : <><Camera size={18} />Thêm ảnh sự cố</>}
                    </button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3.5 rounded-xl shadow"
                      style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                      Gửi đến Smart Concierge AI
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Invoices Tab ─────────────────────────────────────────────────────────────
function InvoicesTab() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedInvoice = INVOICES.find((i) => i.id === selected);

  return (
    <div className="flex-1 overflow-hidden flex bg-gray-50">
      {/* Invoice list */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.05rem" }}>Hóa đơn</h2>
          <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Contract & Admin Agent</p>
        </div>
        {/* Summary */}
        <div className="mx-4 mt-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow">
          <p className="text-emerald-100" style={{ fontSize: "0.72rem" }}>Tháng 4/2025 - Cần thanh toán</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>12.500.000 ₫</p>
          <p className="text-emerald-100" style={{ fontSize: "0.68rem" }}>Hạn: 25/04/2025</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {INVOICES.map((inv) => (
            <motion.div key={inv.id} whileHover={{ x: 2 }} onClick={() => setSelected(inv.id)}
              className={`rounded-2xl p-4 border cursor-pointer transition-all ${selected === inv.id ? "border-emerald-300 bg-emerald-50" : "border-gray-100 bg-white shadow-sm hover:border-gray-200"}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <FileText size={13} className="text-gray-400" />
                  <span className="text-gray-500" style={{ fontSize: "0.72rem" }}>{inv.id}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full ${inv.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`} style={{ fontSize: "0.62rem", fontWeight: 600 }}>
                  {inv.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
              <p className="text-gray-900 font-semibold" style={{ fontSize: "0.875rem" }}>{inv.month}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>Hạn: {inv.due}</p>
                <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>{inv.total} ₫</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Invoice detail */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedInvoice ? (
            <motion.div key={selectedInvoice.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900 font-bold" style={{ fontSize: "1.2rem" }}>{selectedInvoice.month}</h3>
                  <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>{selectedInvoice.id}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full font-semibold ${selectedInvoice.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`} style={{ fontSize: "0.8rem" }}>
                  {selectedInvoice.status === "paid" ? "✓ Đã thanh toán" : "⚠ Chưa thanh toán"}
                </span>
              </div>

              {/* Line items */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
                <div className="px-5 py-4 border-b border-gray-50">
                  <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Chi tiết hóa đơn</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {selectedInvoice.items.map((item) => (
                    <div key={item.label} className="flex justify-between px-5 py-3.5">
                      <span className="text-gray-600" style={{ fontSize: "0.875rem" }}>{item.label}</span>
                      <span className="text-gray-900 font-semibold" style={{ fontSize: "0.875rem" }}>{item.amount} ₫</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-5 py-4 bg-gray-50">
                    <span className="text-gray-900 font-bold" style={{ fontSize: "0.95rem" }}>Tổng cộng</span>
                    <span className="text-emerald-600 font-bold" style={{ fontSize: "1.05rem" }}>{selectedInvoice.total} ₫</span>
                  </div>
                </div>
              </div>

              {/* VietQR payment */}
              {selectedInvoice.status === "unpaid" && (
                <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
                  <p className="text-gray-700 font-bold mb-4" style={{ fontSize: "0.95rem" }}>Quét mã VietQR để thanh toán</p>
                  <div className="w-44 h-44 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 border-2 border-gray-100 shadow-inner">
                    <svg width="120" height="120" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="white" />
                      <rect x="0" y="0" width="30" height="30" fill="#1a1a1a" /><rect x="5" y="5" width="20" height="20" fill="white" /><rect x="9" y="9" width="12" height="12" fill="#1a1a1a" />
                      <rect x="70" y="0" width="30" height="30" fill="#1a1a1a" /><rect x="75" y="5" width="20" height="20" fill="white" /><rect x="79" y="9" width="12" height="12" fill="#1a1a1a" />
                      <rect x="0" y="70" width="30" height="30" fill="#1a1a1a" /><rect x="5" y="75" width="20" height="20" fill="white" /><rect x="9" y="79" width="12" height="12" fill="#1a1a1a" />
                      {[35,45,55,65].map((x) => [35,45,55,65].map((y) => Math.sin(x * y) > 0 && (
                        <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#1a1a1a" />
                      )))}
                    </svg>
                  </div>
                  <p className="text-gray-600 font-semibold" style={{ fontSize: "0.85rem" }}>MB Bank — 0123 4567 8901</p>
                  <p className="text-gray-400 mb-1" style={{ fontSize: "0.75rem" }}>NestaViet PropTech JSC</p>
                  <div className="bg-emerald-50 rounded-xl p-2.5 mb-4">
                    <p className="text-emerald-700" style={{ fontSize: "0.78rem" }}>Nội dung: {selectedInvoice.id} THANH TOAN</p>
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl shadow-md"
                    style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                    <Banknote className="inline mr-2" size={18} />
                    Xác nhận đã chuyển khoản
                  </motion.button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center h-full text-center p-12">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Receipt size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-semibold" style={{ fontSize: "0.95rem" }}>Chọn hóa đơn để xem chi tiết</p>
              <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>Thông tin và mã QR thanh toán sẽ hiển thị ở đây</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ onLogout, isDark, toggleDark }: { onLogout: () => void; isDark: boolean; toggleDark: () => void }) {
  const tenantUser = getTenantUser();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelStep, setCancelStep] = useState<"confirm" | "reason" | "done">("confirm");
  const [reason, setReason] = useState("");

  const handleCancelResidence = () => {
    // Update tenant status in building-tenants
    const tenants = getBuildingTenants() as { email?: string; status: string; unit?: string; buildingName?: string }[];
    const updatedTenants = tenants.map((t) =>
      t.email === tenantUser.email ? { ...t, status: "cancelled" } : t
    );
    localStorage.setItem("nv-building-tenants", JSON.stringify(updatedTenants));

    // Auto-create a listing on the board
    const listings = getListingsBoard() as object[];
    const newListing = {
      id: `L-AUTO-${Date.now()}`,
      title: `Phòng trống: ${tenantUser.unit || "1204"} tại ${tenantUser.buildingName || "Sunrise City North"}`,
      price: "11.5M/tháng",
      area: "65m²",
      district: tenantUser.district || "Quận 7",
      description: `Phòng vừa được trả lại. AI đã tự động đăng tin tìm cư dân mới. Lý do trả: ${reason || "Cư dân hủy hợp đồng"}`,
      type: "ai",
      postedAt: new Date().toLocaleDateString("vi-VN"),
    };
    localStorage.setItem("nv-listings-board", JSON.stringify([...listings, newListing]));
    setCancelStep("done");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Hồ sơ cư dân</h2>
        <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>Thông tin tài khoản & hợp đồng</p>
      </div>

      <div className="p-6 max-w-3xl space-y-5">
        {/* User card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <User size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>{tenantUser.name || "Nguyễn Văn An"}</p>
            <p className="text-gray-500 flex items-center gap-1.5 mt-0.5" style={{ fontSize: "0.82rem" }}>
              <Mail size={13} />{tenantUser.email || "tenant@example.com"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 text-gray-500" style={{ fontSize: "0.78rem" }}>
              <Building2 size={13} />
              {tenantUser.unit ? `Phòng ${tenantUser.unit}` : "Phòng 1204"} • {tenantUser.buildingName || "Sunrise City North"}
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold" style={{ fontSize: "0.78rem" }}>
            ✓ Đang thuê
          </span>
        </div>

        {/* Info sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Thông tin cá nhân</p>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { icon: User, label: "Họ và tên", value: tenantUser.name || "Nguyễn Văn An" },
                { icon: Mail, label: "Email", value: tenantUser.email || "tenant@example.com" },
                { icon: Phone, label: "Điện thoại", value: "0901 234 567" },
                { icon: Shield, label: "CCCD", value: "079 *** *** 001" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 px-5 py-3.5">
                  <row.icon size={15} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>{row.label}</p>
                    <p className="text-gray-900 font-semibold" style={{ fontSize: "0.875rem" }}>{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contract */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Hợp đồng thuê</p>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { icon: FileText, label: "Số hợp đồng", value: "HD-2025-001" },
                { icon: Building2, label: "Tòa nhà", value: tenantUser.buildingName || "Sunrise City North" },
                { icon: MapPin, label: "Phòng", value: tenantUser.unit ? `Phòng ${tenantUser.unit}` : "Phòng 1204" },
                { icon: Calendar, label: "Hiệu lực", value: "01/01/2025 – 31/12/2025" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 px-5 py-3.5">
                  <row.icon size={15} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>{row.label}</p>
                    <p className="text-gray-900 font-semibold" style={{ fontSize: "0.875rem" }}>{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-gray-900 font-bold" style={{ fontSize: "0.9rem" }}>Cài đặt tài khoản</p>
          </div>
          <div className="divide-y divide-gray-50">
            {/* Dark mode toggle */}
            <div className="flex items-center gap-3 px-5 py-3.5">
              {isDark ? <Moon size={15} className="text-violet-500" /> : <Sun size={15} className="text-amber-500" />}
              <span className="flex-1 text-gray-700" style={{ fontSize: "0.875rem" }}>Giao diện tối</span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={toggleDark}
                className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? "bg-emerald-500" : "bg-gray-200"}`}>
                <motion.div animate={{ x: isDark ? 24 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </motion.button>
            </div>
            {[
              { label: "Đổi mật khẩu", icon: Shield },
              { label: "Thông báo & nhắc nhở", icon: Bell },
              { label: "Ngôn ngữ: Tiếng Việt", icon: Settings },
              { label: "Điều khoản sử dụng", icon: FileText },
            ].map(({ label, icon: Icon }) => (
              <button key={label} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left">
                <Icon size={15} className="text-gray-400" />
                <span className="flex-1 text-gray-700" style={{ fontSize: "0.875rem" }}>{label}</span>
                <ChevronRight size={15} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Cancel residence — danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-red-50">
            <p className="text-red-700 font-bold" style={{ fontSize: "0.9rem" }}>Vùng nguy hiểm</p>
          </div>
          <div className="p-5 space-y-3">
            <div className="bg-red-50 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold" style={{ fontSize: "0.875rem" }}>Hủy chỗ ở</p>
                <p className="text-red-600" style={{ fontSize: "0.78rem" }}>Khi hủy, AI sẽ tự động thông báo quản lý và đăng tin tìm cư dân mới. Hành động này không thể hoàn tác.</p>
              </div>
            </div>
            <button onClick={() => { setShowCancelModal(true); setCancelStep("confirm"); }}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors"
              style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              <X size={17} />Hủy chỗ ở & kết thúc hợp đồng
            </button>
            <button onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 text-gray-600 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              style={{ fontSize: "0.875rem" }}>
              <LogOut size={16} />Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Cancel modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowCancelModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {cancelStep === "confirm" && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle size={30} className="text-red-500" />
                    </div>
                    <h3 className="text-gray-900 font-bold" style={{ fontSize: "1.05rem" }}>Xác nhận hủy chỗ ở?</h3>
                    <p className="text-gray-500 mt-2" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                      AI sẽ tự động thông báo tới quản lý tòa nhà và tạo tin đăng tìm cư dân mới. Hợp đồng hiện tại sẽ được kết thúc sớm.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowCancelModal(false)} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors" style={{ fontSize: "0.9rem" }}>Giữ lại</button>
                    <button onClick={() => setCancelStep("reason")} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors" style={{ fontSize: "0.9rem" }}>Tiếp tục</button>
                  </div>
                </>
              )}
              {cancelStep === "reason" && (
                <>
                  <div className="mb-5">
                    <h3 className="text-gray-900 font-bold mb-1" style={{ fontSize: "1.05rem" }}>Lý do hủy</h3>
                    <p className="text-gray-500" style={{ fontSize: "0.82rem" }}>Thông tin này giúp AI cải thiện dịch vụ</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {["Chuyển thành phố", "Mua nhà riêng", "Giá tăng cao", "Thay đổi công việc", "Sự cố chưa giải quyết", "Lý do khác"].map((r) => (
                      <button key={r} onClick={() => setReason(r)}
                        className={`py-2.5 px-3 rounded-xl border text-left transition-all ${reason === r ? "border-red-400 bg-red-50 text-red-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        style={{ fontSize: "0.78rem", fontWeight: reason === r ? 600 : 400 }}>{r}</button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCancelStep("confirm")} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold" style={{ fontSize: "0.9rem" }}>Quay lại</button>
                    <button onClick={handleCancelResidence} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors" style={{ fontSize: "0.9rem" }}>Xác nhận hủy</button>
                  </div>
                </>
              )}
              {cancelStep === "done" && (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={30} className="text-emerald-500" />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-2" style={{ fontSize: "1.05rem" }}>Đã hủy thành công</h3>
                  <p className="text-gray-500" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                    AI đã thông báo tới quản lý và tự động đăng tin tìm cư dân mới. Chúc bạn may mắn trên hành trình mới!
                  </p>
                  <div className="mt-4 bg-violet-50 border border-violet-100 rounded-xl p-3 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot size={13} className="text-violet-600" />
                      <span className="text-violet-700 font-semibold" style={{ fontSize: "0.75rem" }}>AI Listing Verifier</span>
                    </div>
                    <p className="text-violet-600" style={{ fontSize: "0.72rem" }}>Đã tạo tin đăng tự động và đang kiểm duyệt. Phòng sẽ được hiển thị trên sàn trong vài phút.</p>
                  </div>
                  <button onClick={() => { setShowCancelModal(false); }} className="mt-5 w-full bg-gray-900 text-white py-3 rounded-xl font-semibold" style={{ fontSize: "0.9rem" }}>
                    Đóng
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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

  // Real-time cross-tab sync: re-render when landlord approves/updates tenant data
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      const watched = ["nv-building-tenants", "nv-listings-board", "nv-tenant-user"];
      if (watched.includes(e.key ?? "")) setSyncVersion(v => v + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const tenantUser = getTenantUser();
  void syncVersion; // consumed by re-render
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

      {/* Onboarding Tour — first visit only */}
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
