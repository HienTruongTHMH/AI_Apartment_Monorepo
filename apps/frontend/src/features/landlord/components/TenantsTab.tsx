import { useState } from "react";
import { motion } from "motion/react";
import {
  Search, PlusCircle, Hash,
  UserCheck, UserX, Clock, MoreHorizontal,
  Users, Home, AlertCircle, Ban,
} from "lucide-react";

function getBuildingTenants() {
  try { return JSON.parse(localStorage.getItem("nv-building-tenants") || "[]"); } catch { return []; }
}

export interface TenantsTabProps {
  landlordBuilding: string;
}

const AVATAR_GRADIENTS = [
  "from-violet-400 to-purple-500",
  "from-blue-400 to-cyan-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
];

function avatarGradient(name: string) {
  const code = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[code];
}

const FILTER_CFG = {
  all:       { label: "Tất cả",   activeClass: "bg-violet-600 text-white border-violet-600",   inactiveClass: "bg-white border-gray-200 text-gray-600 hover:border-violet-300" },
  active:    { label: "Đang ở",   activeClass: "bg-emerald-500 text-white border-emerald-500",  inactiveClass: "bg-white border-gray-200 text-gray-600 hover:border-emerald-300" },
  pending:   { label: "Chờ duyệt", activeClass: "bg-amber-500 text-white border-amber-500",     inactiveClass: "bg-white border-gray-200 text-gray-600 hover:border-amber-300" },
  cancelled: { label: "Đã hủy",   activeClass: "bg-red-500 text-white border-red-500",          inactiveClass: "bg-white border-gray-200 text-gray-600 hover:border-red-300" },
} as const;

const STATUS_LEFT_BORDER: Record<string, string> = {
  active:    "#34d399",
  pending:   "#fbbf24",
  cancelled: "#fca5a5",
};

const STATUS_BADGE: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  active:    { label: "Đang ở",    class: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: <UserCheck size={11} /> },
  pending:   { label: "Chờ duyệt", class: "bg-amber-50 text-amber-700 border border-amber-200",      icon: <Clock size={11} /> },
  cancelled: { label: "Đã hủy",    class: "bg-red-50 text-red-600 border border-red-200",            icon: <UserX size={11} /> },
};

export default function TenantsTab({ landlordBuilding }: TenantsTabProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "cancelled">("all");
  const raw: Array<{
    name: string; email: string; phone?: string; unit: string;
    buildingName: string; registeredAt: string; status: string;
  }> = getBuildingTenants();

  const DEMO_TENANTS = [
    { name: "Nguyễn Thị Lan",  email: "lan.nguyen@gmail.com",  phone: "0901 234 567", unit: "1204", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-01-05T08:00:00Z", status: "active" },
    { name: "Trần Văn Minh",   email: "minh.tran@gmail.com",   phone: "0912 345 678", unit: "805",  buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-02-10T09:30:00Z", status: "active" },
    { name: "Lê Thị Hoa",      email: "hoa.le@gmail.com",      phone: "0903 456 789", unit: "1501", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-03-15T10:00:00Z", status: "pending" },
    { name: "Phạm Quốc Tuấn",  email: "tuan.pham@gmail.com",   phone: "0934 567 890", unit: "703",  buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-04-01T14:00:00Z", status: "pending" },
    { name: "Hoàng Thị Mai",   email: "mai.hoang@gmail.com",   phone: "0945 678 901", unit: "1002", buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2024-12-20T08:00:00Z", status: "active" },
    { name: "Đỗ Văn Long",     email: "long.do@gmail.com",     phone: "0956 789 012", unit: "601",  buildingName: landlordBuilding || "Vinhomes Grand Park", registeredAt: "2025-01-28T11:00:00Z", status: "cancelled" },
  ];

  const allTenants = [...raw, ...DEMO_TENANTS.filter(d => !raw.find(r => r.email === d.email))];
  const filtered = allTenants.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.email.includes(search) || t.unit.includes(search);
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:       allTenants.length,
    active:    allTenants.filter(t => t.status === "active").length,
    pending:   allTenants.filter(t => t.status === "pending").length,
    cancelled: allTenants.filter(t => t.status === "cancelled").length,
  };

  const statCards = [
    { key: "all",       label: "Tổng cư dân",  icon: Users,        count: counts.all,       color: "text-violet-600",  bg: "bg-violet-50",  border: "border-l-4 border-violet-400" },
    { key: "active",    label: "Đang ở",        icon: Home,         count: counts.active,    color: "text-emerald-600", bg: "bg-emerald-50", border: "border-l-4 border-emerald-400" },
    { key: "pending",   label: "Chờ duyệt",     icon: AlertCircle,  count: counts.pending,   color: "text-amber-700",   bg: "bg-amber-60",   border: "border-l-4 border-amber-400" },
    { key: "cancelled", label: "Đã hủy",        icon: Ban,          count: counts.cancelled, color: "text-red-500",     bg: "bg-red-50",     border: "border-l-4 border-red-400" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontSize: "1.1rem" }}>Quản lý cư dân</h2>
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>{allTenants.length} cư dân trong toà nhà</p>
          </div>
          <motion.button whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-violet-700 transition-colors"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}>
            <PlusCircle size={15} />Thêm cư dân
          </motion.button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statCards.map(({ key, label, icon: Icon, count, color, bg, border }) => (
            <div key={key}
              className={`bg-white rounded-2xl shadow-sm px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow ${border}`}
              onClick={() => setFilter(key as typeof filter)}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon size={16} className={color} />
              </div>
              <div>
                <p className={`font-bold leading-none ${color}`} style={{ fontSize: "1.35rem" }}>{count}</p>
                <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.68rem" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1" style={{ minWidth: "200px" }}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm cư dân, email, phòng..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-2xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-white"
              style={{ fontSize: "0.85rem" }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "active", "pending", "cancelled"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3.5 py-2 rounded-xl border transition-all font-medium ${filter === f ? FILTER_CFG[f].activeClass : FILTER_CFG[f].inactiveClass}`}
                style={{ fontSize: "0.78rem" }}>
                {FILTER_CFG[f].label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full ${filter === f ? "bg-white/25" : "bg-gray-100 text-gray-500"}`}
                  style={{ fontSize: "0.65rem" }}>{counts[f]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pending section — separate UI to avoid layout conflict */}
        {filtered.some(t => t.status === "pending") && (
          <div className="rounded-2xl border border-amber-100 overflow-hidden" style={{ background: "#fffbf0" }}>
            <div className="flex items-center gap-2 px-5 py-3 border-b border-amber-100">
              <Clock size={13} className="text-amber-500" />
              <span className="text-amber-700 font-semibold" style={{ fontSize: "0.8rem" }}>Chờ duyệt</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600" style={{ fontSize: "0.65rem", fontWeight: 700 }}>
                {filtered.filter(t => t.status === "pending").length}
              </span>
            </div>
            <div className="divide-y divide-amber-50">
              {filtered.filter(t => t.status === "pending").map((t, i) => (
                <motion.div key={t.email + i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-amber-50/60 transition-colors"
                  style={{ borderLeft: "3px solid #fbbf24" }}>
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient(t.name)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <span className="text-white font-bold" style={{ fontSize: "0.8rem" }}>{t.name.split(" ").pop()?.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold truncate" style={{ fontSize: "0.82rem" }}>{t.name}</p>
                    <p className="text-gray-400 truncate" style={{ fontSize: "0.7rem" }}>{t.email}{t.phone ? ` · ${t.phone}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 flex-shrink-0">
                    <Hash size={11} className="text-amber-400" />
                    <span className="text-amber-700 font-semibold" style={{ fontSize: "0.8rem" }}>{t.unit}</span>
                  </div>
                  <p className="text-gray-400 flex-shrink-0" style={{ fontSize: "0.7rem" }}>
                    {new Date(t.registeredAt).toLocaleDateString("vi-VN")}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="px-3.5 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                      style={{ fontSize: "0.75rem", fontWeight: 600 }}>Duyệt</button>
                    <button className="px-3 py-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                      style={{ fontSize: "0.75rem", fontWeight: 600 }}>Từ chối</button>
                    <button className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Main table — active + cancelled only */}
        {filtered.some(t => t.status !== "pending") && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid border-b border-gray-100 px-5 py-3 bg-gray-50/70" style={{ gridTemplateColumns: "1fr 1.5fr 1fr 1fr 40px" }}>
              {["Cư dân", "Email / SĐT", "Phòng", "Trạng thái", ""].map(h => (
                <span key={h} className="text-gray-400" style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
              ))}
            </div>

            {filtered.filter(t => t.status !== "pending").map((t, i) => (
              <motion.div key={t.email + i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid px-5 py-4 border-b border-gray-100 hover:bg-gray-50/60 transition-colors items-center"
                style={{
                  gridTemplateColumns: "1fr 1.5fr 1fr 1fr 40px",
                  borderLeft: `3px solid ${STATUS_LEFT_BORDER[t.status] ?? "transparent"}`,
                  opacity: t.status === "cancelled" ? 0.7 : 1,
                }}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient(t.name)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <span className="text-white font-bold" style={{ fontSize: "0.8rem" }}>{t.name.split(" ").pop()?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold" style={{ fontSize: "0.82rem" }}>{t.name}</p>
                    <p className="text-gray-400" style={{ fontSize: "0.67rem" }}>{new Date(t.registeredAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700" style={{ fontSize: "0.78rem" }}>{t.email}</p>
                  {t.phone && <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>{t.phone}</p>}
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100">
                    <Hash size={11} className="text-gray-400" />
                    <span className="text-gray-700 font-semibold" style={{ fontSize: "0.8rem" }}>{t.unit}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${STATUS_BADGE[t.status]?.class ?? "bg-gray-100 text-gray-600"}`}
                  style={{ fontSize: "0.72rem", fontWeight: 600, width: "fit-content" }}>
                  {STATUS_BADGE[t.status]?.icon}
                  {STATUS_BADGE[t.status]?.label ?? t.status}
                </span>
                <button className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal size={15} />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Users size={22} className="text-gray-300" />
            </div>
            <div>
              <p className="text-gray-400 font-medium" style={{ fontSize: "0.88rem" }}>Không tìm thấy cư dân</p>
              <p className="text-gray-300" style={{ fontSize: "0.75rem" }}>Thử tìm kiếm với từ khóa khác</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
