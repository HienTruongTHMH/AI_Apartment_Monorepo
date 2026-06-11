import { motion } from "motion/react";
import {
  Bot, MapPin, Wrench, Receipt, Star,
  Calendar, CheckCircle2, Clock,
  ArrowUpRight, Building2, FileText, Bell,
  Shield, ChevronRight, User,
} from "lucide-react";

type Tab = "home" | "chat" | "explore" | "services" | "invoices" | "profile" | "inbox" | "map" | "price";

function getTenantUser() {
  try { return JSON.parse(localStorage.getItem("nv-tenant-user") || "{}"); } catch { return {}; }
}

const TICKETS = [
  { id: "T001", title: "Máy lạnh không hoạt động", status: "in_progress", date: "20/04/2025", priority: "high", agent: "Smart Concierge" },
  { id: "T002", title: "Bóng đèn hành lang hỏng", status: "resolved", date: "15/04/2025", priority: "low", agent: "Smart Concierge" },
  { id: "T003", title: "Vòi nước rò rỉ phòng tắm", status: "pending", date: "22/04/2025", priority: "medium", agent: "Smart Concierge" },
];

export interface HomeTabProps {
  onTabChange: (t: Tab) => void;
}

export default function HomeTab({ onTabChange }: HomeTabProps) {
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
