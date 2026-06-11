import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  BarChart3, ChevronLeft, Download, TrendingUp,
  DollarSign, Building2, Users, Calendar, FileText,
  ArrowUpRight, ArrowDownRight, Filter, Share2,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ─── Monthly data ─────────────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: "T10/24", revenue: 284, expense: 42, profit: 242 },
  { month: "T11/24", revenue: 312, expense: 48, profit: 264 },
  { month: "T12/24", revenue: 298, expense: 45, profit: 253 },
  { month: "T1/25",  revenue: 325, expense: 51, profit: 274 },
  { month: "T2/25",  revenue: 341, expense: 53, profit: 288 },
  { month: "T3/25",  revenue: 368, expense: 58, profit: 310 },
  { month: "T4/25",  revenue: 392, expense: 61, profit: 331 },
];

// ─── Quarterly data ───────────────────────────────────────────────
const QUARTERLY_REVENUE = [
  { month: "Q3/23", revenue: 710,  expense: 98,  profit: 612 },
  { month: "Q4/23", revenue: 830,  expense: 115, profit: 715 },
  { month: "Q1/24", revenue: 890,  expense: 128, profit: 762 },
  { month: "Q2/24", revenue: 956,  expense: 140, profit: 816 },
  { month: "Q3/24", revenue: 894,  expense: 133, profit: 761 },
  { month: "Q4/24", revenue: 908,  expense: 136, profit: 772 },
  { month: "Q1/25", revenue: 1034, expense: 162, profit: 872 },
];

// ─── Yearly data ──────────────────────────────────────────────────
const YEARLY_REVENUE = [
  { month: "2020",  revenue: 1820, expense: 285, profit: 1535 },
  { month: "2021",  revenue: 2140, expense: 324, profit: 1816 },
  { month: "2022",  revenue: 2780, expense: 412, profit: 2368 },
  { month: "2023",  revenue: 3320, expense: 487, profit: 2833 },
  { month: "2024",  revenue: 3752, expense: 536, profit: 3216 },
  { month: "2025*", revenue: 4200, expense: 610, profit: 3590 },
];

const MONTHLY_OCC   = [{ name: "Vinhomes GP", occ: 92 }, { name: "Masteri CP", occ: 87 }, { name: "Estella Hts", occ: 88 }, { name: "Eco Green", occ: 75 }, { name: "Tropic Garden", occ: 75 }];
const QUARTERLY_OCC = [{ name: "Vinhomes GP", occ: 94 }, { name: "Masteri CP", occ: 89 }, { name: "Estella Hts", occ: 91 }, { name: "Eco Green", occ: 82 }, { name: "Tropic Garden", occ: 79 }];
const YEARLY_OCC    = [{ name: "Vinhomes GP", occ: 90 }, { name: "Masteri CP", occ: 85 }, { name: "Estella Hts", occ: 87 }, { name: "Eco Green", occ: 79 }, { name: "Tropic Garden", occ: 76 }];

const MONTHLY_PIE   = [{ name: "Tiền thuê", value: 82, color: "#22d3ee" }, { name: "Phí dịch vụ", value: 11, color: "#10b981" }, { name: "Tiền cọc", value: 5, color: "#a78bfa" }, { name: "Khác", value: 2, color: "#f59e0b" }];
const QUARTERLY_PIE = [{ name: "Tiền thuê", value: 79, color: "#22d3ee" }, { name: "Phí dịch vụ", value: 13, color: "#10b981" }, { name: "Tiền cọc", value: 6, color: "#a78bfa" }, { name: "Khác", value: 2, color: "#f59e0b" }];
const YEARLY_PIE    = [{ name: "Tiền thuê", value: 76, color: "#22d3ee" }, { name: "Phí dịch vụ", value: 15, color: "#10b981" }, { name: "Tiền cọc", value: 7, color: "#a78bfa" }, { name: "Khác", value: 2, color: "#f59e0b" }];

const KPIS_BY_PERIOD = {
  month: [
    { label: "Doanh thu T4/25",  value: "392M",   unit: "VND",   change: "+6.5%", up: true,  color: "#22d3ee", icon: DollarSign },
    { label: "Tỷ suất LN",      value: "84.4%",  unit: "",      change: "+1.2%", up: true,  color: "#10b981", icon: TrendingUp },
    { label: "Tỷ lệ lấp đầy",  value: "84%",    unit: "",      change: "-2%",   up: false, color: "#f59e0b", icon: Building2  },
    { label: "Khách thuê HĐ",   value: "92",     unit: "người", change: "+7",    up: true,  color: "#a78bfa", icon: Users      },
  ],
  quarter: [
    { label: "Doanh thu Q1/25",  value: "1,034M", unit: "VND",   change: "+8.1%", up: true,  color: "#22d3ee", icon: DollarSign },
    { label: "Tỷ suất LN",      value: "84.3%",  unit: "",      change: "+0.8%", up: true,  color: "#10b981", icon: TrendingUp },
    { label: "Tỷ lệ lấp đầy",  value: "87%",    unit: "",      change: "+1%",   up: true,  color: "#f59e0b", icon: Building2  },
    { label: "Khách thuê HĐ",   value: "94",     unit: "người", change: "+5",    up: true,  color: "#a78bfa", icon: Users      },
  ],
  year: [
    { label: "Doanh thu 2025*",  value: "4,200M", unit: "VND",   change: "+12%",  up: true,  color: "#22d3ee", icon: DollarSign },
    { label: "Tỷ suất LN",      value: "85.5%",  unit: "",      change: "+1.5%", up: true,  color: "#10b981", icon: TrendingUp },
    { label: "Tỷ lệ lấp đầy",  value: "83%",    unit: "",      change: "+3%",   up: true,  color: "#f59e0b", icon: Building2  },
    { label: "Khách thuê HĐ",   value: "107",    unit: "người", change: "+15",   up: true,  color: "#a78bfa", icon: Users      },
  ],
};

const REPORT_TEMPLATES = [
  { id: "monthly",   title: "Báo cáo tháng",    desc: "Doanh thu, chi phí, lợi nhuận T4/2025",    icon: Calendar,  color: "#22d3ee", pages: 8  },
  { id: "quarterly", title: "Báo cáo quý",       desc: "Tổng hợp Q1/2025 theo từng bất động sản",  icon: BarChart3, color: "#10b981", pages: 24 },
  { id: "occupancy", title: "Báo cáo lấp đầy",   desc: "Tỷ lệ lấp đầy và xu hướng 6 tháng qua",  icon: Building2, color: "#a78bfa", pages: 12 },
  { id: "tax",       title: "Báo cáo thuế",      desc: "Tổng hợp thuế TNCN và VAT theo quý",       icon: FileText,  color: "#f59e0b", pages: 6  },
];

const PERIOD_LABELS = { month: "Tháng", quarter: "Quý", year: "Năm" };
const CHART_LABEL = { month: "7 tháng gần nhất", quarter: "7 quý gần nhất", year: "6 năm gần nhất" };
const PIE_LABEL   = { month: "T4/2025", quarter: "Q1/2025", year: "2024–2025" };

export function ReportsPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");

  const revenueData  = period === "month" ? MONTHLY_REVENUE : period === "quarter" ? QUARTERLY_REVENUE : YEARLY_REVENUE;
  const occupancyData = period === "month" ? MONTHLY_OCC : period === "quarter" ? QUARTERLY_OCC : YEARLY_OCC;
  const pieData      = period === "month" ? MONTHLY_PIE : period === "quarter" ? QUARTERLY_PIE : YEARLY_PIE;
  const kpis         = KPIS_BY_PERIOD[period];

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #070e1c 0%, #0a0f1e 50%, #07101c 100%)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(148,163,184,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 70% 20%, rgba(139,92,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(34,211,238,0.04) 0%, transparent 55%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontSize: "0.82rem" }}>
          <ChevronLeft size={16} />Trang chủ
        </button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/8 mb-6">
            <BarChart3 size={13} className="text-violet-400" />
            <span className="text-violet-400 font-semibold" style={{ fontSize: "0.75rem" }}>Báo cáo tài chính</span>
          </div>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-white mb-3" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, lineHeight: 1.15 }}>
                Dashboard tài chính<br />
                <span style={{ background: "linear-gradient(90deg,#a78bfa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>thời gian thực</span>
              </h1>
              <p className="text-white/45" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
                Theo dõi doanh thu, chi phí, tỷ lệ lấp đầy và lợi nhuận trên toàn bộ danh mục bất động sản.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex bg-white/5 rounded-xl border border-white/8 overflow-hidden">
                {(["month", "quarter", "year"] as const).map((k) => (
                  <button key={k} onClick={() => setPeriod(k)}
                    className="px-4 py-2 transition-all"
                    style={{ background: period === k ? "rgba(167,139,250,0.18)" : "transparent", color: period === k ? "#a78bfa" : "rgba(255,255,255,0.4)", fontSize: "0.78rem", fontWeight: period === k ? 600 : 400 }}>
                    {PERIOD_LABELS[k]}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/55 hover:text-white hover:border-white/25 transition-all" style={{ fontSize: "0.8rem" }}>
                <Filter size={14} />Lọc
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-400 hover:bg-violet-500/25 transition-all" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                <Download size={14} />Xuất PDF
              </button>
            </div>
          </div>
        </motion.div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.07 }}
              className="rounded-2xl p-4 border border-white/8" style={{ background: "rgba(15,24,41,0.8)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <kpi.icon size={16} className="text-white/30" />
                <span className={`flex items-center gap-0.5 font-semibold ${kpi.up ? "text-emerald-400" : "text-red-400"}`} style={{ fontSize: "0.68rem" }}>
                  {kpi.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{kpi.change}
                </span>
              </div>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: kpi.color }}>{kpi.value}<span className="text-white/35 ml-1" style={{ fontSize: "0.75rem", fontWeight: 400 }}>{kpi.unit}</span></p>
              <p className="text-white/50" style={{ fontSize: "0.72rem" }}>{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

          {/* Revenue area chart */}
          <div className="lg:col-span-2 rounded-2xl p-5 border border-white/8" style={{ background: "rgba(15,24,41,0.8)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>Doanh thu & Lợi nhuận (triệu VND)</p>
                <p className="text-white/35" style={{ fontSize: "0.72rem" }}>{CHART_LABEL[period]}</p>
              </div>
              <div className="flex items-center gap-4" style={{ fontSize: "0.68rem" }}>
                <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded bg-cyan-400" />Doanh thu</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded bg-violet-400" />Lợi nhuận</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient>
                  <linearGradient id="profG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a78bfa" stopOpacity={0.25}/><stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={{ background: "#0f1829", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "0.72rem" }} formatter={(v: number) => [`${v}M VND`]} />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} fill="url(#revG)" />
                <Area type="monotone" dataKey="profit"  stroke="#a78bfa" strokeWidth={2} fill="url(#profG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(15,24,41,0.8)" }}>
            <p className="text-white font-bold mb-1" style={{ fontSize: "0.9rem" }}>Cơ cấu doanh thu</p>
            <p className="text-white/35 mb-4" style={{ fontSize: "0.72rem" }}>{PIE_LABEL[period]}</p>
            <div className="flex justify-center mb-4">
              <PieChart width={160} height={160}>
                <Pie data={pieData} cx={76} cy={76} innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-2">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                    <span className="text-white/55" style={{ fontSize: "0.72rem" }}>{d.name}</span>
                  </div>
                  <span className="font-bold" style={{ fontSize: "0.78rem", color: d.color }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Occupancy bar chart */}
        <div className="rounded-2xl p-5 border border-white/8 mb-8" style={{ background: "rgba(15,24,41,0.8)" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>Tỷ lệ lấp đầy theo tòa nhà (%)</p>
              <p className="text-white/35" style={{ fontSize: "0.72rem" }}>{PERIOD_LABELS[period]} — cập nhật 27/04/2025</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 font-semibold" style={{ fontSize: "0.68rem" }}>Mục tiêu: 90%</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={occupancyData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ background: "#0f1829", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "0.72rem" }} formatter={(v: number) => [`${v}%`, "Lấp đầy"]} />
              <Bar dataKey="occ" radius={[0, 6, 6, 0]}>
                {occupancyData.map((d, i) => <Cell key={i} fill={d.occ >= 90 ? "#10b981" : d.occ >= 80 ? "#f59e0b" : "#ef4444"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Report templates */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold" style={{ fontSize: "1.1rem" }}>Mẫu báo cáo</h2>
            <button className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors" style={{ fontSize: "0.78rem" }}>
              <Share2 size={13} />Chia sẻ dashboard
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {REPORT_TEMPLATES.map((r, i) => (
              <motion.div key={r.id} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.07 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl p-5 border border-white/8 hover:border-white/18 cursor-pointer transition-all" style={{ background: "rgba(15,24,41,0.7)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: r.color + "18" }}>
                  <r.icon size={22} style={{ color: r.color }} />
                </div>
                <p className="text-white font-semibold mb-1" style={{ fontSize: "0.85rem" }}>{r.title}</p>
                <p className="text-white/40 mb-4" style={{ fontSize: "0.7rem", lineHeight: 1.55 }}>{r.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/30" style={{ fontSize: "0.65rem" }}>{r.pages} trang</span>
                  <button className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors" style={{ fontSize: "0.72rem" }}>
                    <Download size={12} />PDF
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-10 rounded-2xl p-8 border border-violet-500/15 text-center"
          style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.08),rgba(34,211,238,0.05))" }}>
          <TrendingUp size={28} className="text-violet-400 mx-auto mb-3" />
          <p className="text-white font-bold mb-2" style={{ fontSize: "1.2rem" }}>Muốn xem báo cáo đầy đủ?</p>
          <p className="text-white/45 mb-5" style={{ fontSize: "0.88rem" }}>Đăng ký tài khoản quản lý để truy cập toàn bộ analytics real-time.</p>
          <button onClick={() => navigate("/landlord/register")} className="px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(135deg,#a78bfa,#22d3ee)", fontSize: "0.9rem" }}>
            Đăng ký làm chủ nhà
          </button>
        </motion.div>

      </div>
    </div>
  );
}
