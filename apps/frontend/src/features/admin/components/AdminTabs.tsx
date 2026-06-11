import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity, AlertTriangle, Bot, BarChart3,
  ArrowUpRight, ArrowDownRight, Users,
  Key, Lock, Network, Database, Globe, Sliders,
  ChevronRight, Search, Filter, MoreHorizontal,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { LogsPanel, NodeGraph, AgentsGrid, SystemNodesTable } from "./SharedAdminComponents";
import { TRAFFIC_DATA, SYSTEM_NODES, USERS_DATA } from "./adminData";

export type AdminTab = "overview" | "agents" | "users" | "logs" | "settings";

export interface AdminTabsProps {
  activeTab: AdminTab;
  accentColor: string;
  bgCard: string;
}

export function AdminTabs({ activeTab, accentColor, bgCard }: AdminTabsProps) {
  const [searchUser, setSearchUser] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = USERS_DATA.filter((u) =>
    (u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())) &&
    (roleFilter === "all" || u.role === roleFilter) &&
    (statusFilter === "all" || u.status === statusFilter)
  );

  return (
    <AnimatePresence mode="wait">
      {activeTab === "overview" && (
        <motion.div key="a-ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total API Req/24h", value: "48,420", change: "+8.2%",  up: true,  color: "#ef4444", icon: Activity      },
              { label: "Active Users",       value: "1,284",  change: "+12",    up: true,  color: "#10b981", icon: Users         },
              { label: "Agents Online",      value: "4/4",    change: "1 warn", up: false, color: "#f59e0b", icon: Bot           },
              { label: "Error Rate",         value: "0.08%",  change: "-0.02%", up: true,  color: "#a78bfa", icon: AlertTriangle },
            ].map((kpi, i) => (
              <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-4 border border-white/8" style={{ background: bgCard }}>
                <div className="flex items-center justify-between mb-3">
                  <kpi.icon size={16} className="text-white/35" />
                  <span className={`flex items-center gap-0.5 ${kpi.up ? "text-emerald-400" : "text-amber-400"}`} style={{ fontSize: "0.65rem" }}>
                    {kpi.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{kpi.change}
                  </span>
                </div>
                <p style={{ fontSize: "1.4rem", fontWeight: 800, color: kpi.color }}>{kpi.value}</p>
                <p className="text-white/40" style={{ fontSize: "0.68rem" }}>{kpi.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="rounded-2xl p-5 border border-white/8 mb-5" style={{ background: bgCard }}>
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontSize: "0.875rem", fontWeight: 700 }}>API Request Traffic (24h)</p>
              <div className="flex items-center gap-4" style={{ fontSize: "0.68rem" }}>
                <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded bg-cyan-500" />Requests</span>
                <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded bg-red-500" />Errors</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={TRAFFIC_DATA}>
                <defs>
                  <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#6b7280" }} axisLine={false} tickLine={false} interval={3} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#0f1829", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "0.72rem" }} />
                <Area type="monotone" dataKey="requests" stroke="#06b6d4" strokeWidth={2} fill="url(#tg)" />
                <Area type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={1.5} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <SystemNodesTable bgCard={bgCard} accentVariant="admin" />
        </motion.div>
      )}

      {activeTab === "agents" && (
        <motion.div key="a-ag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <NodeGraph />
          <AgentsGrid />
          <div className="mt-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-amber-300" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Smart Concierge — High CPU Load (91%)</p>
              <p className="text-amber-400/70" style={{ fontSize: "0.72rem" }}>18 lỗi trong 1 giờ qua. Cân nhắc scale-up hoặc kiểm tra queue tắc nghẽn.</p>
            </div>
            <button className="flex-shrink-0 bg-amber-500 text-black px-3 py-1.5 rounded-xl" style={{ fontSize: "0.72rem", fontWeight: 600 }}>Xem Log</button>
          </div>
        </motion.div>
      )}

      {activeTab === "users" && (
        <motion.div key="a-us" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex items-center gap-2 border border-white/10 rounded-xl px-3 py-2 flex-1 min-w-[200px] max-w-xs" style={{ background: bgCard }}>
              <Search size={14} className="text-white/40" />
              <input value={searchUser} onChange={(e) => setSearchUser(e.target.value)} placeholder="Tìm người dùng..." className="flex-1 bg-transparent outline-none text-white placeholder-white/30" style={{ fontSize: "0.8rem" }} />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-white/40" />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border border-white/10 rounded-xl px-3 py-2 text-white outline-none" style={{ background: bgCard, fontSize: "0.78rem" }}>
                <option value="all">Tất cả vai trò</option><option value="tenant">Khách thuê</option><option value="landlord">Chủ nhà</option><option value="admin">Admin</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-white/10 rounded-xl px-3 py-2 text-white outline-none" style={{ background: bgCard, fontSize: "0.78rem" }}>
                <option value="all">Tất cả trạng thái</option><option value="active">Đang hoạt động</option><option value="suspended">Bị khóa</option>
              </select>
            </div>
            <span className="text-white/40" style={{ fontSize: "0.72rem" }}>{filteredUsers.length}/{USERS_DATA.length} users</span>
          </div>
          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: bgCard }}>
            <div className="grid grid-cols-12 px-5 py-2.5 border-b border-white/8 text-white/40" style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em" }}>
              <div className="col-span-1">#ID</div><div className="col-span-3">TÊN</div><div className="col-span-3">EMAIL</div>
              <div className="col-span-1">ROLE</div><div className="col-span-1">ĐƠN VỊ</div><div className="col-span-1">NGÀY ĐK</div>
              <div className="col-span-1">STATUS</div><div className="col-span-1" />
            </div>
            <AnimatePresence>
              {filteredUsers.map((u, i) => (
                <motion.div key={u.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-12 px-5 py-3 border-b border-white/5 hover:bg-white/3 transition-colors items-center">
                  <div className="col-span-1 text-white/35" style={{ fontSize: "0.72rem" }}>{u.id}</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-700 to-rose-900 flex items-center justify-center flex-shrink-0" style={{ fontSize: "0.7rem", fontWeight: 700 }}>{u.name.charAt(0)}</div>
                    <span className="text-white" style={{ fontSize: "0.8rem", fontWeight: 600 }}>{u.name}</span>
                  </div>
                  <div className="col-span-3 text-white/45 truncate" style={{ fontSize: "0.75rem" }}>{u.email}</div>
                  <div className="col-span-1">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${u.role === "admin" ? "bg-red-500/15 text-red-400" : u.role === "landlord" ? "bg-violet-500/15 text-violet-400" : "bg-cyan-500/15 text-cyan-400"}`} style={{ fontSize: "0.6rem" }}>
                      {u.role === "admin" ? "ADMIN" : u.role === "landlord" ? "LANDLORD" : "TENANT"}
                    </span>
                  </div>
                  <div className="col-span-1 text-white/45" style={{ fontSize: "0.72rem" }}>{u.unit}</div>
                  <div className="col-span-1 text-white/35" style={{ fontSize: "0.68rem" }}>{u.joined}</div>
                  <div className="col-span-1">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${u.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`} style={{ fontSize: "0.6rem" }}>
                      {u.status === "active" ? "ACTIVE" : "SUSPENDED"}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/35 hover:text-white/70 transition-colors"><MoreHorizontal size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredUsers.length === 0 && <div className="py-12 text-center text-white/30" style={{ fontSize: "0.8rem" }}>Không tìm thấy người dùng phù hợp</div>}
          </div>
        </motion.div>
      )}

      {activeTab === "logs" && <LogsPanel key="a-lg" accent={accentColor} />}

      {activeTab === "settings" && (
        <motion.div key="a-st" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            {[
              { icon: Key,      title: "API Keys & Secrets",  desc: "Quản lý API keys cho các service tích hợp",    color: "#f59e0b" },
              { icon: Lock,     title: "Phân quyền RBAC",     desc: "Cấu hình roles và permissions toàn hệ thống",  color: "#a78bfa" },
              { icon: Network,  title: "Agent Configuration", desc: "Tuning parameters cho 4 AI Agents",            color: "#22d3ee" },
              { icon: Database, title: "Database & Backup",   desc: "Quản lý PostgreSQL, Redis và lịch backup",     color: "#34d399" },
              { icon: Globe,    title: "Domain & SSL",        desc: "Cấu hình DNS, SSL và CDN settings",            color: "#60a5fa" },
              { icon: Sliders,  title: "Rate Limiting",       desc: "Giới hạn request per user và IP throttling",   color: "#ef4444" },
            ].map((item) => (
              <motion.div key={item.title} whileHover={{ y: -2 }} className="rounded-2xl p-5 border border-white/8 hover:border-white/18 cursor-pointer transition-all flex items-start gap-4" style={{ background: bgCard }}>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0"><item.icon size={18} style={{ color: item.color }} /></div>
                <div><p className="text-white mb-1" style={{ fontSize: "0.875rem", fontWeight: 600 }}>{item.title}</p><p className="text-white/40" style={{ fontSize: "0.75rem" }}>{item.desc}</p></div>
                <ChevronRight size={16} className="text-white/20 ml-auto flex-shrink-0 mt-1" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
