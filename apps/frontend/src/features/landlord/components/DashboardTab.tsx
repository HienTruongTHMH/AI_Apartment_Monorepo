import { useState } from "react";
import { motion } from "motion/react";
import {
  BarChart3, Building2, TrendingUp, Users,
  Bell, CheckCircle2, AlertTriangle, X,
  Home, FileText,
  DollarSign, Info, ArrowUpRight, ArrowDownRight,
  Bot,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { useCountUp } from "@shared/hooks/useCountUp";

const REVENUE_DATA = [
  { month: "T10", revenue: 38.5, target: 40 },
  { month: "T11", revenue: 41.2, target: 42 },
  { month: "T12", revenue: 43.8, target: 42 },
  { month: "T1", revenue: 39.1, target: 43 },
  { month: "T2", revenue: 44.5, target: 43 },
  { month: "T3", revenue: 46.2, target: 45 },
  { month: "T4", revenue: 45.2, target: 45 },
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

export interface DashboardTabProps {
  pendingCount: number;
}

export default function DashboardTab({ pendingCount }: DashboardTabProps) {
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
