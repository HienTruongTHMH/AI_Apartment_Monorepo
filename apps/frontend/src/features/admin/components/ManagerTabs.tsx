import { motion, AnimatePresence } from "motion/react";
import {
  Building2, FileText, DollarSign, PieChart,
  ArrowUpRight, AlertCircle, CheckCircle2, Eye, MoreHorizontal,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { MGR_LISTINGS, MGR_CONTRACTS, MGR_REVENUE, USERS_DATA } from "./adminData";

export type ManagerTab = "dashboard" | "listings" | "contracts" | "finances" | "tenants";

export interface ManagerTabsProps {
  activeTab: ManagerTab;
  bgCard: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRev: number;
  pendingCt: number;
}

export function ManagerTabs({ activeTab, bgCard, totalUnits, occupiedUnits, monthlyRev, pendingCt }: ManagerTabsProps) {
  return (
    <AnimatePresence mode="wait">
      {activeTab === "dashboard" && (
        <motion.div key="m-dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <div className="mb-6">
            <h2 className="text-white mb-1" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Tổng quan quản lý BĐS</h2>
            <p className="text-white/40" style={{ fontSize: "0.78rem" }}>{new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Tổng căn hộ",    value: `${totalUnits}`,                                sub: `${occupiedUnits} đang thuê`, color: "#10b981", icon: Building2  },
              { label: "Tỷ lệ lấp đầy",  value: `${Math.round(occupiedUnits/totalUnits*100)}%`, sub: "Trên toàn bộ BDS",           color: "#22d3ee", icon: PieChart   },
              { label: "Doanh thu/tháng",value: `${(monthlyRev/1e6).toFixed(0)}M`,              sub: "VND (ước tính)",             color: "#f59e0b", icon: DollarSign },
              { label: "HĐ chờ ký",      value: `${pendingCt}`,                                 sub: "Cần xử lý ngay",             color: "#f97316", icon: FileText   },
            ].map((kpi, i) => (
              <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-4 border border-emerald-500/10" style={{ background: bgCard }}>
                <div className="flex items-center justify-between mb-3">
                  <kpi.icon size={16} className="text-white/35" />
                  <ArrowUpRight size={13} className="text-emerald-400" />
                </div>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, color: kpi.color }}>{kpi.value}</p>
                <p className="text-white/70 mt-0.5" style={{ fontSize: "0.78rem", fontWeight: 600 }}>{kpi.label}</p>
                <p className="text-white/35" style={{ fontSize: "0.65rem" }}>{kpi.sub}</p>
              </motion.div>
            ))}
          </div>
          <div className="rounded-2xl p-5 border border-emerald-500/10 mb-5" style={{ background: bgCard }}>
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontSize: "0.875rem", fontWeight: 700 }}>Doanh thu hàng tháng (triệu VND)</p>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400" style={{ fontSize: "0.68rem", fontWeight: 600 }}>7 tháng gần nhất</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MGR_REVENUE}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[250, 420]} />
                <Tooltip contentStyle={{ background: bgCard, border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", color: "white", fontSize: "0.72rem" }} formatter={(v: number) => [`${v}M VND`]} />
                <Bar dataKey="target" fill="#10b98118" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-emerald-500/10 overflow-hidden" style={{ background: bgCard }}>
            <div className="px-5 py-3 border-b border-white/8"><p style={{ fontSize: "0.875rem", fontWeight: 700 }}>Tỷ lệ lấp đầy theo tòa nhà</p></div>
            {MGR_LISTINGS.map((l) => {
              const pct = l.occupied / l.units;
              return (
                <div key={l.id} className="px-5 py-3 border-b border-white/5 hover:bg-white/3 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-white" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{l.name}</p>
                    <span className="text-white/50" style={{ fontSize: "0.72rem" }}>{l.occupied}/{l.units} căn</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full"
                      style={{ background: pct > 0.9 ? "#10b981" : pct > 0.75 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {activeTab === "listings" && (
        <motion.div key="m-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Danh sách Bất động sản</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white" style={{ fontSize: "0.8rem", fontWeight: 600 }}>+ Thêm BDS</button>
          </div>
          <div className="space-y-3">
            {MGR_LISTINGS.map((l, i) => {
              const pct = l.occupied / l.units;
              return (
                <motion.div key={l.id} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}
                  className="rounded-2xl p-5 border border-emerald-500/10 hover:border-emerald-500/25 transition-all" style={{ background: bgCard }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0"><Building2 size={22} className="text-emerald-400" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-white" style={{ fontSize: "0.9rem", fontWeight: 700 }}>{l.name}</p>
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${l.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`} style={{ fontSize: "0.6rem" }}>
                          {l.status === "active" ? "ĐANG HOẠT ĐỘNG" : "ĐANG XEM XÉT"}
                        </span>
                      </div>
                      <p className="text-white/50" style={{ fontSize: "0.78rem" }}>{l.district} • {l.type}</p>
                      <div className="flex items-center gap-4 mt-2" style={{ fontSize: "0.72rem" }}>
                        <span className="text-white/55">{l.occupied}/{l.units} căn đang thuê</span>
                        <span className="text-emerald-400 font-semibold">{(l.rent/1e6).toFixed(1)}M/tháng</span>
                        <span className="text-white/35">{l.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-white/35 hover:text-white/70 transition-colors"><Eye size={15} /></button>
                      <button className="p-2 rounded-lg hover:bg-white/10 text-white/35 hover:text-white/70 transition-colors"><MoreHorizontal size={15} /></button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-white/40" style={{ fontSize: "0.65rem" }}>Tỷ lệ lấp đầy</span>
                      <span style={{ fontSize: "0.65rem", color: pct > 0.9 ? "#10b981" : "#f59e0b" }}>{Math.round(pct*100)}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct*100}%`, background: pct > 0.9 ? "#10b981" : "#f59e0b" }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {activeTab === "contracts" && (
        <motion.div key="m-cont" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Quản lý Hợp đồng</h2>
            <div className="flex gap-2">
              {[{ k: "active", l: "Hiệu lực", c: "#10b981" }, { k: "pending", l: "Chờ ký", c: "#f59e0b" }, { k: "expired", l: "Hết hạn", c: "rgba(255,255,255,0.3)" }].map((f) => (
                <span key={f.k} className="px-2.5 py-1 rounded-full" style={{ background: f.c + "15", border: `1px solid ${f.c}30`, color: f.c, fontSize: "0.68rem" }}>
                  {MGR_CONTRACTS.filter((c) => c.status === f.k).length} {f.l}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/10 overflow-hidden" style={{ background: bgCard }}>
            <div className="divide-y divide-white/5">
              {MGR_CONTRACTS.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-white/3 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.status === "active" ? "bg-emerald-500/10" : c.status === "pending" ? "bg-amber-500/10" : "bg-white/5"}`}>
                    <FileText size={18} className={c.status === "active" ? "text-emerald-400" : c.status === "pending" ? "text-amber-400" : "text-white/30"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-white" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{c.tenant}</p>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${c.status === "active" ? "bg-emerald-500/15 text-emerald-400" : c.status === "pending" ? "bg-amber-500/15 text-amber-400" : "bg-white/10 text-white/40"}`} style={{ fontSize: "0.58rem" }}>
                        {c.status === "active" ? "HIỆU LỰC" : c.status === "pending" ? "CHỜ KÝ" : "HẾT HẠN"}
                      </span>
                    </div>
                    <p className="text-white/45" style={{ fontSize: "0.72rem" }}>{c.id} • {c.unit} • {c.start} → {c.end}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-emerald-400 font-bold" style={{ fontSize: "0.85rem" }}>{(c.rent/1e6).toFixed(1)}M</p>
                    <p className="text-white/35" style={{ fontSize: "0.62rem" }}>/ tháng</p>
                  </div>
                  <div className="flex-shrink-0">
                    {c.paid
                      ? <span className="flex items-center gap-1 text-emerald-400" style={{ fontSize: "0.7rem" }}><CheckCircle2 size={12} />Đã TT</span>
                      : <span className="flex items-center gap-1 text-red-400" style={{ fontSize: "0.7rem" }}><AlertCircle size={12} />Chưa TT</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "finances" && (
        <motion.div key="m-fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <h2 className="text-white mb-6" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Báo cáo Tài chính</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Doanh thu T4/2025", value: "392M",  sub: "+6.5% so T3",  color: "#10b981" },
              { label: "Chưa thu",           value: "26.5M", sub: "2 hợp đồng",  color: "#f59e0b" },
              { label: "Lợi nhuận ròng",     value: "~74%",  sub: "Sau chi phí", color: "#a78bfa" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-5 border border-emerald-500/10" style={{ background: bgCard }}>
                <p style={{ fontSize: "2rem", fontWeight: 800, color: s.color }}>{s.value}</p>
                <p className="text-white/80 mt-1" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{s.label}</p>
                <p className="text-white/40" style={{ fontSize: "0.68rem" }}>{s.sub}</p>
              </motion.div>
            ))}
          </div>
          <div className="rounded-2xl p-5 border border-emerald-500/10" style={{ background: bgCard }}>
            <p className="text-white mb-4" style={{ fontSize: "0.875rem", fontWeight: 700 }}>Xu hướng doanh thu 7 tháng (triệu VND)</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MGR_REVENUE}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: bgCard, border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", color: "white", fontSize: "0.72rem" }} formatter={(v: number) => [`${v}M VND`]} />
                <Area type="monotone" dataKey="target" stroke="#10b98135" strokeWidth={1} fill="none" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#rg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {activeTab === "tenants" && (
        <motion.div key="m-ten" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <h2 className="text-white mb-5" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Danh sách Khách thuê</h2>
          <div className="rounded-2xl border border-emerald-500/10 overflow-hidden" style={{ background: bgCard }}>
            <div className="divide-y divide-white/5">
              {USERS_DATA.filter((u) => u.role === "tenant").map((u, i) => (
                <motion.div key={u.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-white/3 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center flex-shrink-0 text-white" style={{ fontSize: "0.85rem", fontWeight: 700 }}>{u.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{u.name}</p>
                    <p className="text-white/45" style={{ fontSize: "0.72rem" }}>{u.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70" style={{ fontSize: "0.78rem" }}>Căn {u.unit}</p>
                    <p className="text-white/35" style={{ fontSize: "0.65rem" }}>Từ {u.joined}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full font-semibold ${u.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`} style={{ fontSize: "0.62rem" }}>
                    {u.status === "active" ? "ĐANG THUÊ" : "DỪNG"}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
