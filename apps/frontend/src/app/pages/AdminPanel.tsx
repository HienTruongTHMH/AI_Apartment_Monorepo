import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity, AlertTriangle, Bot, BarChart3, Building2, CheckCircle2,
  ChevronLeft, ChevronRight, Clock, Cpu, Database, Filter,
  Globe, Key, Layers, Lock, LogOut, Network, RefreshCw,
  Search, Server, Settings, Shield, Sliders, Terminal,
  Users, Zap, ArrowUpRight, ArrowDownRight, Eye, MoreHorizontal,
  FileText, DollarSign, PieChart, Wifi, Code2, GitBranch,
  Package, AlertCircle, CheckSquare, XCircle, BarChart2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";

// ─── Static data ─────────────────────────────────────────────────────────────
const AGENT_NODES = [
  { id: "a1", name: "Listing Verifier",  status: "online",  load: 34, requests: 1240, errors: 2,  latency: 120, color: "#3b82f6", icon: Shield,   desc: "Python • LangChain • Image CV",     metrics: [45,60,55,70,34,40,38,34] },
  { id: "a2", name: "Super Broker",      status: "online",  load: 78, requests: 8430, errors: 5,  latency: 380, color: "#10b981", icon: Bot,      desc: "Python • RAG • pgvector",           metrics: [60,70,80,75,78,82,80,78] },
  { id: "a3", name: "Smart Concierge",   status: "warning", load: 91, requests: 3200, errors: 18, latency: 245, color: "#f59e0b", icon: Zap,      desc: "Python • LangGraph • Scheduler",    metrics: [70,75,85,90,91,88,92,91] },
  { id: "a4", name: "Contract & Admin",  status: "online",  load: 22, requests: 980,  errors: 0,  latency: 95,  color: "#8b5cf6", icon: Database, desc: "Python • Rust API • QR Gen",        metrics: [30,25,28,22,20,24,22,22] },
];

const SYSTEM_NODES = [
  { id: "rust-api", name: "Rust API Gateway",       status: "online",  type: "Backend",  load: 45, version: "v2.4.1"  },
  { id: "py-core",  name: "Python AI Core",          status: "online",  type: "AI Engine",load: 67, version: "v1.8.3"  },
  { id: "pg-db",    name: "PostgreSQL + pgvector",   status: "online",  type: "Database", load: 38, version: "16.2"    },
  { id: "redis",    name: "Redis Cache",             status: "online",  type: "Cache",    load: 12, version: "7.2"     },
  { id: "minio",    name: "MinIO Object Storage",    status: "warning", type: "Storage",  load: 88, version: "2024-Q1" },
  { id: "nginx",    name: "Nginx Load Balancer",     status: "online",  type: "Proxy",    load: 23, version: "1.25"   },
];

const API_LOGS = [
  { id: "L001", time: "10:42:18", method: "POST",   path: "/api/v2/agents/broker/chat",        status: 200, latency: "382ms", user: "tenant_2841"  },
  { id: "L002", time: "10:42:15", method: "GET",    path: "/api/v2/properties/list",           status: 200, latency: "95ms",  user: "tenant_1092"  },
  { id: "L003", time: "10:42:12", method: "POST",   path: "/api/v2/listings/verify",           status: 200, latency: "1.2s",  user: "landlord_441" },
  { id: "L004", time: "10:42:10", method: "POST",   path: "/api/v2/invoices/generate",         status: 200, latency: "210ms", user: "system"       },
  { id: "L005", time: "10:42:08", method: "GET",    path: "/api/v2/maintenance/tickets",       status: 200, latency: "88ms",  user: "tenant_5521"  },
  { id: "L006", time: "10:42:05", method: "POST",   path: "/api/v2/agents/concierge/assign",   status: 503, latency: "5.1s",  user: "system"       },
  { id: "L007", time: "10:41:55", method: "DELETE", path: "/api/v2/listings/L-2199",           status: 204, latency: "45ms",  user: "admin_1"      },
  { id: "L008", time: "10:41:48", method: "PUT",    path: "/api/v2/users/tenant_2841/contract",status: 200, latency: "178ms", user: "landlord_441" },
];

const USERS_DATA = [
  { id: "U1001", name: "Nguyễn Văn An",   email: "van.an@email.com",    role: "tenant",   status: "active",    joined: "12/01/2025", unit: "SC-1204" },
  { id: "U1002", name: "Trần Minh Khoa",  email: "khoa.tran@biz.vn",    role: "landlord", status: "active",    joined: "05/12/2024", unit: "Owner"   },
  { id: "U1003", name: "Lê Thị Hương",    email: "huong.le@gmail.com",  role: "tenant",   status: "active",    joined: "20/02/2025", unit: "VGP-803" },
  { id: "U1004", name: "Phạm Đức Huy",    email: "huy.pham@company.vn", role: "landlord", status: "suspended", joined: "10/11/2024", unit: "Owner"   },
  { id: "U1005", name: "Võ Thị Kim Ngân", email: "ngan.vo@email.com",   role: "tenant",   status: "active",    joined: "01/03/2025", unit: "TR-1502" },
  { id: "U1006", name: "Đỗ Quang Minh",   email: "minh.do@startup.io",  role: "admin",    status: "active",    joined: "01/01/2024", unit: "—"       },
];

const TRAFFIC_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  requests: [420,310,220,180,160,200,380,560,720,840,920,880,950,910,870,820,780,730,650,590,520,470,440,400][i],
  errors:   [3,2,1,1,1,2,4,6,8,9,10,8,11,9,8,7,6,5,4,3,3,2,2,2][i],
}));

const MGR_LISTINGS = [
  { id: "BDS-001", name: "Vinhomes Grand Park",   district: "TP. Thủ Đức", units: 24, occupied: 22, rent: 10500000, status: "active", type: "Chung cư cao cấp"   },
  { id: "BDS-002", name: "Masteri Centre Point",  district: "TP. Thủ Đức", units: 16, occupied: 14, rent: 17000000, status: "active", type: "Căn hộ hạng sang"   },
  { id: "BDS-003", name: "The Estella Heights",   district: "TP.HCM",      units: 8,  occupied: 7,  rent: 26000000, status: "active", type: "Penthouse / Duplex"  },
  { id: "BDS-004", name: "Eco Green Saigon",      district: "TP.HCM",      units: 32, occupied: 28, rent: 9000000,  status: "review", type: "Chung cư trung cấp" },
  { id: "BDS-005", name: "Tropic Garden",         district: "TP. Thủ Đức", units: 12, occupied: 9,  rent: 13500000, status: "active", type: "Biệt thự / Nhà phố" },
];

const MGR_CONTRACTS = [
  { id: "HD-2025-001", tenant: "Nguyễn Văn An",   unit: "VGP-SC-1204", start: "01/01/2025", end: "31/12/2025", rent: 10500000, status: "active",  paid: true  },
  { id: "HD-2025-002", tenant: "Lê Thị Hương",    unit: "VGP-803",     start: "01/02/2025", end: "31/01/2026", rent: 10500000, status: "active",  paid: true  },
  { id: "HD-2025-003", tenant: "Võ Thị Kim Ngân", unit: "TR-1502",     start: "15/03/2025", end: "14/03/2026", rent: 13500000, status: "active",  paid: false },
  { id: "HD-2024-018", tenant: "Bùi Thanh Tùng",  unit: "MCP-401",     start: "01/06/2024", end: "31/05/2025", rent: 17000000, status: "expired", paid: true  },
  { id: "HD-2025-004", tenant: "Hoàng Thị Mai",   unit: "EH-PH-02",    start: "01/04/2025", end: "31/03/2026", rent: 26000000, status: "pending", paid: false },
];

const MGR_REVENUE = [
  { month: "T10", revenue: 284, target: 300 }, { month: "T11", revenue: 312, target: 310 },
  { month: "T12", revenue: 298, target: 310 }, { month: "T1",  revenue: 325, target: 320 },
  { month: "T2",  revenue: 341, target: 330 }, { month: "T3",  revenue: 368, target: 350 },
  { month: "T4",  revenue: 392, target: 370 },
];

const DEPLOY_HISTORY = [
  { id: "dep-081", env: "Production", branch: "main",        commit: "a3f19c2", by: "CI/CD",     time: "10:15",   status: "success", duration: "3m 42s" },
  { id: "dep-080", env: "Staging",    branch: "feat/search", commit: "7bc0d41", by: "dev@nv.vn", time: "09:52",   status: "success", duration: "2m 18s" },
  { id: "dep-079", env: "Production", branch: "main",        commit: "e2a84f0", by: "CI/CD",     time: "Hôm qua", status: "failed",  duration: "1m 05s" },
  { id: "dep-078", env: "Staging",    branch: "fix/auth",    commit: "c91b3d8", by: "dev@nv.vn", time: "Hôm qua", status: "success", duration: "2m 55s" },
  { id: "dep-077", env: "Production", branch: "main",        commit: "d55a210", by: "CI/CD",     time: "2 ngày",  status: "success", duration: "4m 01s" },
];

const DEV_PKGS = [
  { name: "React",       version: "19.1.0",  ok: true },
  { name: "TypeScript",  version: "5.8.3",   ok: true },
  { name: "Vite",        version: "6.4.2",   ok: true },
  { name: "motion/react",version: "12.x",    ok: true },
  { name: "recharts",    version: "2.15.3",  ok: true },
  { name: "Tailwind CSS",version: "4.x",     ok: true },
];

// ─── Shared components ────────────────────────────────────────────────────────
function AgentCard({ agent }: { agent: typeof AGENT_NODES[0] }) {
  const [open, setOpen] = useState(false);
  const sc = agent.status === "online" ? "#10b981" : agent.status === "warning" ? "#f59e0b" : "#ef4444";
  return (
    <motion.div layout whileHover={{ y: -2 }} onClick={() => setOpen(!open)}
      className="bg-[#0f1829] border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${agent.color}22`, border: `1px solid ${agent.color}44` }}>
            <agent.icon size={20} style={{ color: agent.color }} />
          </div>
          <div>
            <p className="text-white" style={{ fontSize: "0.875rem", fontWeight: 700 }}>{agent.name}</p>
            <p className="text-white/40" style={{ fontSize: "0.68rem" }}>{agent.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div animate={{ scale: [1,1.4,1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full" style={{ background: sc }} />
          <span style={{ fontSize: "0.65rem", color: sc, fontWeight: 700, textTransform: "uppercase" }}>{agent.status}</span>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-white/40" style={{ fontSize: "0.68rem" }}>CPU Load</span>
          <span style={{ fontSize: "0.68rem", color: agent.load > 80 ? "#f59e0b" : "#10b981", fontWeight: 700 }}>{agent.load}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${agent.load}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full" style={{ background: agent.load > 80 ? "#f59e0b" : agent.color }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[{ l: "Req/hr", v: agent.requests.toLocaleString() }, { l: "Lỗi", v: `${agent.errors}` }, { l: "Latency", v: `${agent.latency}ms` }].map((m) => (
          <div key={m.l} className="text-center bg-white/5 rounded-xl py-1.5">
            <p className="text-white" style={{ fontSize: "0.78rem", fontWeight: 700 }}>{m.v}</p>
            <p className="text-white/35" style={{ fontSize: "0.6rem" }}>{m.l}</p>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-0.5 h-8">
        {agent.metrics.map((v, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: `${v}%`, background: `${agent.color}66`, minHeight: "4px" }} />
        ))}
      </div>
      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-white/10 space-y-2">
          {[["Memory","2.4 GB / 8 GB"],["Uptime","99.98% (30d)"],["Last restart","3 ngày trước"]].map(([k,v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-white/40" style={{ fontSize: "0.72rem" }}>{k}</span>
              <span className={k === "Uptime" ? "text-emerald-400" : "text-white"} style={{ fontSize: "0.72rem" }}>{v}</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function NodeGraph() {
  return (
    <div className="bg-[#080d18] rounded-2xl p-6 border border-white/10 mb-5">
      <p className="text-white mb-4" style={{ fontSize: "0.875rem", fontWeight: 700 }}>Agent Network Topology</p>
      <div className="relative h-52 flex items-center justify-center">
        <div className="absolute w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center z-10" style={{ boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}>
          <Cpu size={24} className="text-white" />
          <span className="absolute -bottom-5 text-white/60 whitespace-nowrap" style={{ fontSize: "0.6rem" }}>Python AI Core</span>
        </div>
        {AGENT_NODES.map((agent, i) => {
          const angle = (i / AGENT_NODES.length) * 2 * Math.PI - Math.PI / 4;
          const r = 95; const x = Math.cos(angle) * r; const y = Math.sin(angle) * r;
          return (
            <div key={agent.id}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <line x1="50%" y1="50%" x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`} stroke={agent.color} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
              </svg>
              <motion.div animate={{ scale: [1,1.05,1] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.7 }} className="absolute flex flex-col items-center"
                style={{ left: `calc(50% + ${x}px - 20px)`, top: `calc(50% + ${y}px - 20px)`, zIndex: 10 }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${agent.color}22`, border: `1.5px solid ${agent.color}66` }}>
                  <agent.icon size={17} style={{ color: agent.color }} />
                </div>
                <span className="text-white/50 mt-1 text-center" style={{ fontSize: "0.55rem", lineHeight: 1.2, maxWidth: "60px" }}>{agent.name.split(" ").slice(0,2).join(" ")}</span>
              </motion.div>
            </div>
          );
        })}
        <div className="absolute" style={{ bottom: 8, left: 8 }}>
          <div className="flex items-center gap-1.5 bg-white/5 rounded-xl px-2.5 py-1.5 border border-white/10">
            <Server size={12} className="text-orange-400" /><span className="text-white/60" style={{ fontSize: "0.62rem" }}>Rust API</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
        <div className="absolute" style={{ bottom: 8, right: 8 }}>
          <div className="flex items-center gap-1.5 bg-white/5 rounded-xl px-2.5 py-1.5 border border-white/10">
            <Globe size={12} className="text-cyan-400" /><span className="text-white/60" style={{ fontSize: "0.62rem" }}>React FE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LogsPanel({ accent }: { accent: string }) {
  const [logFilter, setLogFilter] = useState("all");
  const filtered = API_LOGS.filter((l) => {
    if (logFilter === "errors") return l.status >= 400;
    if (logFilter === "slow") return parseInt(l.latency) > 1000 || l.latency.includes("s");
    return true;
  });
  return (
    <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex gap-2">
          {[{ v: "all", l: "Tất cả" }, { v: "errors", l: "Lỗi (4xx/5xx)" }, { v: "slow", l: "Chậm (>1s)" }].map((f) => (
            <button key={f.v} onClick={() => setLogFilter(f.v)} className="px-3 py-1.5 rounded-xl border transition-all"
              style={{ fontSize: "0.75rem", borderColor: logFilter === f.v ? accent + "60" : "rgba(255,255,255,0.1)", background: logFilter === f.v ? accent + "18" : "transparent", color: logFilter === f.v ? accent : "rgba(255,255,255,0.4)" }}>
              {f.l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto text-emerald-400" style={{ fontSize: "0.72rem" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live streaming
        </div>
      </div>
      <div className="bg-[#040810] rounded-2xl border border-white/8 font-mono overflow-hidden">
        <div className="px-5 py-2 border-b border-white/8 flex items-center gap-2">
          <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-amber-500" /><div className="w-3 h-3 rounded-full bg-emerald-500" /></div>
          <span className="text-white/30 ml-2" style={{ fontSize: "0.72rem" }}>Rust API Gateway — Request Logs</span>
          <span className="ml-auto" style={{ fontSize: "0.65rem", color: accent }}>ENV: production</span>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className={`px-5 py-3 flex items-center gap-4 hover:bg-white/3 transition-colors ${log.status >= 400 ? "bg-red-500/5" : ""}`}
            >
              <span className="text-white/30 flex-shrink-0" style={{ fontSize: "0.68rem" }}>{log.time}</span>
              <span className={`flex-shrink-0 px-2 py-0.5 rounded font-bold ${log.method === "GET" ? "bg-blue-500/20 text-blue-400" : log.method === "POST" ? "bg-emerald-500/20 text-emerald-400" : log.method === "DELETE" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`} style={{ fontSize: "0.65rem" }}>{log.method}</span>
              <span className="flex-1 text-white/70 truncate" style={{ fontSize: "0.78rem" }}>{log.path}</span>
              <span className={`flex-shrink-0 font-semibold ${log.status >= 400 ? "text-red-400" : "text-emerald-400"}`} style={{ fontSize: "0.78rem" }}>{log.status}</span>
              <span className={`flex-shrink-0 ${parseInt(log.latency) > 1000 || log.latency.includes("s") ? "text-amber-400" : "text-white/40"}`} style={{ fontSize: "0.68rem" }}>{log.latency}</span>
              <span className="text-white/30 flex-shrink-0" style={{ fontSize: "0.65rem" }}>{log.user}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PANEL
// ═════════════════════════════════════════════════════════════════════════════
export function AdminPanel() {
  const navigate = useNavigate();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [searchUser, setSearchUser] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const session = (() => {
    try {
      const s = sessionStorage.getItem("nv_admin_session") ?? sessionStorage.getItem("nv_manager_session") ?? sessionStorage.getItem("nv_dev_session");
      return s ? JSON.parse(s) as { name: string; role: string } : null;
    }
    catch { return null; }
  })();
  const role     = session?.role ?? "";
  const userName = session?.name ?? "Unknown";

  // ── Role config ─────────────────────────────────────────────────────────
  const isAdmin   = role === "admin";
  const isManager = role === "manager";
  const isDev     = role === "dev";

  const accentColor = isAdmin ? "#ef4444" : isManager ? "#10b981" : "#8b5cf6";
  const accentGrad  = isAdmin ? "from-red-500 to-rose-700" : isManager ? "from-emerald-500 to-teal-600" : "from-violet-600 to-purple-800";
  const roleLabel   = isAdmin ? "SUPER ADMIN" : isManager ? "MANAGER" : "DEV TEAM";
  const bgCard      = isManager ? "#0d1f18" : "#0f1829";

  type AdminTab = "overview"|"agents"|"users"|"logs"|"settings";
  type MgrTab   = "dashboard"|"listings"|"contracts"|"finances"|"tenants";
  type DevTab   = "logs"|"system"|"agents"|"deploys"|"config";
  type AnyTab   = AdminTab | MgrTab | DevTab;

  const adminNav: { id: AdminTab; icon: React.ElementType; label: string; badge?: boolean }[] = [
    { id: "overview",  icon: BarChart3,  label: "Overview"  },
    { id: "agents",    icon: Bot,        label: "AI Agents", badge: true },
    { id: "users",     icon: Users,      label: "Users"     },
    { id: "logs",      icon: Terminal,   label: "API Logs"  },
    { id: "settings",  icon: Settings,   label: "Settings"  },
  ];
  const mgrNav: { id: MgrTab; icon: React.ElementType; label: string; badge?: boolean }[] = [
    { id: "dashboard",  icon: BarChart2,   label: "Tổng quan"      },
    { id: "listings",   icon: Building2,   label: "Bất động sản"   },
    { id: "contracts",  icon: FileText,    label: "Hợp đồng", badge: true },
    { id: "finances",   icon: DollarSign,  label: "Tài chính"      },
    { id: "tenants",    icon: Users,       label: "Khách thuê"     },
  ];
  const devNav: { id: DevTab; icon: React.ElementType; label: string }[] = [
    { id: "logs",    icon: Terminal,  label: "API Logs"     },
    { id: "system",  icon: Server,    label: "System Health"},
    { id: "agents",  icon: Bot,       label: "AI Agents"   },
    { id: "deploys", icon: GitBranch, label: "Deployments" },
    { id: "config",  icon: Code2,     label: "Config / Env"},
  ];

  const initialTab: AnyTab = isAdmin ? "overview" : isManager ? "dashboard" : "logs";
  const [activeTab, setActiveTab] = useState<AnyTab>(initialTab);

  useEffect(() => {
    if (!autoRefresh) return;
    const iv = setInterval(() => setLastRefresh(new Date()), 5000);
    return () => clearInterval(iv);
  }, [autoRefresh]);

  const filteredUsers = USERS_DATA.filter((u) =>
    (u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())) &&
    (roleFilter === "all" || u.role === roleFilter) &&
    (statusFilter === "all" || u.status === statusFilter)
  );

  const totalUnits    = MGR_LISTINGS.reduce((s, l) => s + l.units, 0);
  const occupiedUnits = MGR_LISTINGS.reduce((s, l) => s + l.occupied, 0);
  const monthlyRev    = MGR_LISTINGS.reduce((s, l) => s + l.occupied * l.rent, 0);
  const pendingCt     = MGR_CONTRACTS.filter((c) => c.status === "pending").length;

  const currentNav = isAdmin ? adminNav : isManager ? mgrNav : devNav;

  return (
    <div className="flex h-screen bg-[#080d18] text-white overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <div className="flex flex-col w-56 border-r border-white/8 flex-shrink-0" style={{ background: isAdmin ? "#09101e" : isManager ? "#081510" : "#060a14" }}>

        {/* Logo */}
        <div className="p-4 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accentGrad} flex items-center justify-center shadow-lg`}>
              <Layers size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white" style={{ fontSize: "0.82rem", fontWeight: 800 }}>NestaVietAI</p>
              <span className="inline-block px-1.5 py-0.5 rounded-md text-white font-bold" style={{ background: accentColor + "30", color: accentColor, fontSize: "0.52rem", letterSpacing: "0.1em" }}>{roleLabel}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="px-4 py-2.5 border-b border-white/8">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accentColor }} />
            <span className="text-white/50" style={{ fontSize: "0.65rem" }}>Systems operational</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-white/25" style={{ fontSize: "0.6rem" }}>
            <Clock size={9} />
            <span>{lastRefresh.toLocaleTimeString("vi-VN")}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {currentNav.map((item) => {
            const active = activeTab === item.id;
            return (
              <motion.button key={item.id} whileHover={{ x: 3 }}
                onClick={() => setActiveTab(item.id as AnyTab)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  background: active ? accentColor + "18" : "transparent",
                  border: `1px solid ${active ? accentColor + "35" : "transparent"}`,
                  color: active ? accentColor : "rgba(255,255,255,0.38)",
                }}
              >
                <item.icon size={15} strokeWidth={active ? 2.5 : 1.8} />
                <span style={{ fontSize: "0.8rem", fontWeight: active ? 700 : 400 }}>{item.label}</span>
                {"badge" in item && item.badge && (
                  <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center text-black" style={{ background: "#f59e0b", fontSize: "0.52rem", fontWeight: 900 }}>!</div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User + controls */}
        <div className="p-3 border-t border-white/8 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${accentGrad} flex items-center justify-center flex-shrink-0`} style={{ fontSize: "0.7rem", fontWeight: 800 }}>
              {userName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white truncate" style={{ fontSize: "0.78rem", fontWeight: 600 }}>{userName}</p>
              <p style={{ fontSize: "0.6rem", color: accentColor, opacity: 0.8 }}>{roleLabel.toLowerCase()}</p>
            </div>
          </div>
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
            <ChevronLeft size={13} /><span style={{ fontSize: "0.72rem" }}>Trang chủ</span>
          </button>
          <button onClick={() => {
            sessionStorage.removeItem("nv_admin_session");
            sessionStorage.removeItem("nv_manager_session");
            sessionStorage.removeItem("nv_dev_session");
            navigate(isAdmin ? "/admin/login" : isManager ? "/manager/login" : "/dev/login");
          }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/8 transition-all"
          >
            <LogOut size={13} /><span style={{ fontSize: "0.72rem" }}>Logout</span>
          </button>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="border-b border-white/8 px-5 py-2.5 flex items-center justify-between flex-shrink-0" style={{ background: isAdmin ? "#09101e" : isManager ? "#081510" : "#060a14" }}>
          <div className="flex items-center gap-2 text-white/40" style={{ fontSize: "0.72rem" }}>
            <span>NestaVietAI</span><span className="text-white/20">/</span>
            <span style={{ color: accentColor, fontWeight: 600 }}>{role}</span><span className="text-white/20">/</span>
            <span className="text-white/60">{currentNav.find((n) => n.id === activeTab)?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all"
              style={{ borderColor: autoRefresh ? accentColor + "40" : "rgba(255,255,255,0.1)", background: autoRefresh ? accentColor + "12" : "transparent", color: autoRefresh ? accentColor : "rgba(255,255,255,0.35)", fontSize: "0.7rem" }}
            >
              <motion.div animate={autoRefresh ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                <RefreshCw size={12} />
              </motion.div>
              Auto-refresh
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10" style={{ fontSize: "0.68rem" }}>
              <div className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? "animate-pulse" : ""}`} style={{ background: autoRefresh ? "#10b981" : "rgba(255,255,255,0.2)" }} />
              <span className="text-white/40">{autoRefresh ? "Live" : "Paused"}</span>
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ══ ADMIN: Overview ══ */}
            {isAdmin && activeTab === "overview" && (
              <motion.div key="a-ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Total API Req/24h", value: "48,420", change: "+8.2%", up: true,  color: "#ef4444", icon: Activity      },
                    { label: "Active Users",       value: "1,284",  change: "+12",   up: true,  color: "#10b981", icon: Users         },
                    { label: "Agents Online",      value: "4/4",    change: "1 warn",up: false, color: "#f59e0b", icon: Bot           },
                    { label: "Error Rate",         value: "0.08%",  change: "-0.02%",up: true,  color: "#a78bfa", icon: AlertTriangle },
                  ].map((kpi, i) => (
                    <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                      className="rounded-2xl p-4 border border-white/8" style={{ background: bgCard }}
                    >
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
                <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: bgCard }}>
                  <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
                    <p style={{ fontSize: "0.875rem", fontWeight: 700 }}>Infrastructure Nodes</p>
                    <span className="text-white/40" style={{ fontSize: "0.72rem" }}>{SYSTEM_NODES.filter((n) => n.status === "online").length}/{SYSTEM_NODES.length} online</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {SYSTEM_NODES.map((node) => (
                      <div key={node.id} className="px-5 py-3 flex items-center gap-4 hover:bg-white/3 transition-colors">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${node.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white" style={{ fontSize: "0.8rem", fontWeight: 600 }}>{node.name}</p>
                          <p className="text-white/40" style={{ fontSize: "0.65rem" }}>{node.type} • {node.version}</p>
                        </div>
                        <div className="w-24">
                          <div className="flex justify-between mb-1">
                            <span className="text-white/40" style={{ fontSize: "0.62rem" }}>Load</span>
                            <span style={{ fontSize: "0.62rem", color: node.load > 80 ? "#f59e0b" : "#6ee7b7" }}>{node.load}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${node.load}%`, background: node.load > 80 ? "#f59e0b" : "#10b981" }} />
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${node.status === "online" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`} style={{ fontSize: "0.65rem" }}>
                          {node.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ ADMIN: Agents ══ */}
            {isAdmin && activeTab === "agents" && (
              <motion.div key="a-ag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <NodeGraph />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {AGENT_NODES.map((ag) => <AgentCard key={ag.id} agent={ag} />)}
                </div>
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

            {/* ══ ADMIN: Users ══ */}
            {isAdmin && activeTab === "users" && (
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
                        className="grid grid-cols-12 px-5 py-3 border-b border-white/5 hover:bg-white/3 transition-colors items-center"
                      >
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

            {/* ══ ADMIN: Logs ══ */}
            {isAdmin && activeTab === "logs" && <LogsPanel key="a-lg" accent={accentColor} />}

            {/* ══ ADMIN: Settings ══ */}
            {isAdmin && activeTab === "settings" && (
              <motion.div key="a-st" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                  {[
                    { icon: Key,      title: "API Keys & Secrets",   desc: "Quản lý API keys cho các service tích hợp",      color: "#f59e0b" },
                    { icon: Lock,     title: "Phân quyền RBAC",      desc: "Cấu hình roles và permissions toàn hệ thống",    color: "#a78bfa" },
                    { icon: Network,  title: "Agent Configuration",  desc: "Tuning parameters cho 4 AI Agents",              color: "#22d3ee" },
                    { icon: Database, title: "Database & Backup",    desc: "Quản lý PostgreSQL, Redis và lịch backup",       color: "#34d399" },
                    { icon: Globe,    title: "Domain & SSL",         desc: "Cấu hình DNS, SSL và CDN settings",             color: "#60a5fa" },
                    { icon: Sliders,  title: "Rate Limiting",        desc: "Giới hạn request per user và IP throttling",    color: "#ef4444" },
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

            {/* ══ MANAGER: Dashboard ══ */}
            {isManager && activeTab === "dashboard" && (
              <motion.div key="m-dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <div className="mb-6">
                  <h2 className="text-white mb-1" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Tổng quan quản lý BĐS</h2>
                  <p className="text-white/40" style={{ fontSize: "0.78rem" }}>{new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Tổng căn hộ",      value: `${totalUnits}`,                                  sub: `${occupiedUnits} đang thuê`, color: "#10b981", icon: Building2  },
                    { label: "Tỷ lệ lấp đầy",    value: `${Math.round(occupiedUnits/totalUnits*100)}%`,   sub: "Trên toàn bộ BDS",           color: "#22d3ee", icon: PieChart   },
                    { label: "Doanh thu/tháng",   value: `${(monthlyRev/1e6).toFixed(0)}M`,               sub: "VND (ước tính)",             color: "#f59e0b", icon: DollarSign },
                    { label: "HĐ chờ ký",         value: `${pendingCt}`,                                  sub: "Cần xử lý ngay",             color: "#f97316", icon: FileText   },
                  ].map((kpi, i) => (
                    <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                      className="rounded-2xl p-4 border border-emerald-500/10" style={{ background: bgCard }}
                    >
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
                      <Bar dataKey="target" fill="#10b98118" radius={[4,4,0,0]} />
                      <Bar dataKey="revenue" fill="#10b981" radius={[4,4,0,0]} />
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

            {/* ══ MANAGER: Listings ══ */}
            {isManager && activeTab === "listings" && (
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
                        className="rounded-2xl p-5 border border-emerald-500/10 hover:border-emerald-500/25 transition-all" style={{ background: bgCard }}
                      >
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

            {/* ══ MANAGER: Contracts ══ */}
            {isManager && activeTab === "contracts" && (
              <motion.div key="m-cont" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Quản lý Hợp đồng</h2>
                  <div className="flex gap-2">
                    {[{ k:"active",l:"Hiệu lực",c:"#10b981"},{k:"pending",l:"Chờ ký",c:"#f59e0b"},{k:"expired",l:"Hết hạn",c:"rgba(255,255,255,0.3)"}].map((f)=>(
                      <span key={f.k} className="px-2.5 py-1 rounded-full" style={{ background: f.c+"15", border:`1px solid ${f.c}30`, color: f.c, fontSize: "0.68rem" }}>
                        {MGR_CONTRACTS.filter((c)=>c.status===f.k).length} {f.l}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-500/10 overflow-hidden" style={{ background: bgCard }}>
                  <div className="divide-y divide-white/5">
                    {MGR_CONTRACTS.map((c, i) => (
                      <motion.div key={c.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="px-5 py-4 flex items-center gap-4 hover:bg-white/3 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.status==="active"?"bg-emerald-500/10":c.status==="pending"?"bg-amber-500/10":"bg-white/5"}`}>
                          <FileText size={18} className={c.status==="active"?"text-emerald-400":c.status==="pending"?"text-amber-400":"text-white/30"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-white" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{c.tenant}</p>
                            <span className={`px-2 py-0.5 rounded-full font-bold ${c.status==="active"?"bg-emerald-500/15 text-emerald-400":c.status==="pending"?"bg-amber-500/15 text-amber-400":"bg-white/10 text-white/40"}`} style={{ fontSize: "0.58rem" }}>
                              {c.status==="active"?"HIỆU LỰC":c.status==="pending"?"CHỜ KÝ":"HẾT HẠN"}
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

            {/* ══ MANAGER: Finances ══ */}
            {isManager && activeTab === "finances" && (
              <motion.div key="m-fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <h2 className="text-white mb-6" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Báo cáo Tài chính</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Doanh thu T4/2025", value: "392M", sub: "+6.5% so T3", color: "#10b981" },
                    { label: "Chưa thu",           value: "26.5M",sub: "2 hợp đồng", color: "#f59e0b" },
                    { label: "Lợi nhuận ròng",     value: "~74%", sub: "Sau chi phí",color: "#a78bfa" },
                  ].map((s, i) => (
                    <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                      className="rounded-2xl p-5 border border-emerald-500/10" style={{ background: bgCard }}
                    >
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

            {/* ══ MANAGER: Tenants ══ */}
            {isManager && activeTab === "tenants" && (
              <motion.div key="m-ten" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <h2 className="text-white mb-5" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Danh sách Khách thuê</h2>
                <div className="rounded-2xl border border-emerald-500/10 overflow-hidden" style={{ background: bgCard }}>
                  <div className="divide-y divide-white/5">
                    {USERS_DATA.filter((u) => u.role === "tenant").map((u, i) => (
                      <motion.div key={u.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="px-5 py-4 flex items-center gap-4 hover:bg-white/3 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center flex-shrink-0 text-white" style={{ fontSize: "0.85rem", fontWeight: 700 }}>{u.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{u.name}</p>
                          <p className="text-white/45" style={{ fontSize: "0.72rem" }}>{u.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/70" style={{ fontSize: "0.78rem" }}>Căn {u.unit}</p>
                          <p className="text-white/35" style={{ fontSize: "0.65rem" }}>Từ {u.joined}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full font-semibold ${u.status==="active"?"bg-emerald-500/15 text-emerald-400":"bg-red-500/15 text-red-400"}`} style={{ fontSize: "0.62rem" }}>
                          {u.status === "active" ? "ĐANG THUÊ" : "DỪNG"}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ DEV: Logs ══ */}
            {isDev && activeTab === "logs" && <LogsPanel key="d-lg" accent={accentColor} />}

            {/* ══ DEV: System ══ */}
            {isDev && activeTab === "system" && (
              <motion.div key="d-sys" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <h2 className="text-white mb-5" style={{ fontSize: "1.1rem", fontWeight: 700 }}>System Health Monitor</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "API Uptime",       value: "99.98%", color: "#10b981", icon: Activity  },
                    { label: "DB Connections",   value: "24/100", color: "#22d3ee", icon: Database  },
                    { label: "Cache Hit Rate",   value: "94.2%",  color: "#a78bfa", icon: Zap       },
                    { label: "Storage Used",     value: "88%",    color: "#f59e0b", icon: Package   },
                    { label: "Avg Latency",      value: "186ms",  color: "#34d399", icon: Activity  },
                    { label: "Active Conns",     value: "1,284",  color: "#60a5fa", icon: Wifi      },
                  ].map((s, i) => (
                    <motion.div key={i} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}
                      className="rounded-2xl p-4 border border-violet-500/10" style={{ background: "#0c1020" }}
                    >
                      <s.icon size={16} className="text-white/30 mb-2" />
                      <p style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</p>
                      <p className="text-white/50" style={{ fontSize: "0.75rem" }}>{s.label}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="rounded-2xl border border-violet-500/10 overflow-hidden" style={{ background: "#0c1020" }}>
                  <div className="px-5 py-3 border-b border-white/8"><p style={{ fontSize: "0.875rem", fontWeight: 700 }}>Infrastructure Nodes</p></div>
                  <div className="divide-y divide-white/5">
                    {SYSTEM_NODES.map((node) => (
                      <div key={node.id} className="px-5 py-3 flex items-center gap-4 hover:bg-white/3 transition-colors">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${node.status==="online"?"bg-emerald-400 animate-pulse":"bg-amber-400"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white" style={{ fontSize: "0.8rem", fontWeight: 600 }}>{node.name}</p>
                          <p className="text-violet-400/60" style={{ fontSize: "0.65rem" }}>{node.type} • {node.version}</p>
                        </div>
                        <div className="w-28">
                          <div className="flex justify-between mb-1">
                            <span className="text-white/40" style={{ fontSize: "0.62rem" }}>Load</span>
                            <span style={{ fontSize: "0.62rem", color: node.load > 80 ? "#f59e0b" : "#a78bfa" }}>{node.load}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${node.load}%`, background: node.load > 80 ? "#f59e0b" : "#8b5cf6" }} />
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${node.status==="online"?"bg-emerald-500/15 text-emerald-400":"bg-amber-500/15 text-amber-400"}`} style={{ fontSize: "0.65rem" }}>
                          {node.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ DEV: Agents ══ */}
            {isDev && activeTab === "agents" && (
              <motion.div key="d-ag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <NodeGraph />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {AGENT_NODES.map((ag) => <AgentCard key={ag.id} agent={ag} />)}
                </div>
              </motion.div>
            )}

            {/* ══ DEV: Deploys ══ */}
            {isDev && activeTab === "deploys" && (
              <motion.div key="d-dep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Deployment History</h2>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white" style={{ background: accentColor, fontSize: "0.8rem", fontWeight: 600 }}>Deploy Now</button>
                </div>
                <div className="space-y-3">
                  {DEPLOY_HISTORY.map((d, i) => (
                    <motion.div key={d.id} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}
                      className="rounded-2xl p-4 border border-violet-500/10 hover:border-violet-500/25 transition-all flex items-center gap-4" style={{ background: "#0c1020" }}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${d.status==="success"?"bg-emerald-500/10":"bg-red-500/10"}`}>
                        {d.status==="success" ? <CheckSquare size={17} className="text-emerald-400" /> : <XCircle size={17} className="text-red-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white font-mono" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{d.commit}</span>
                          <span className="px-2 py-0.5 rounded" style={{ background: accentColor+"18", color: accentColor, fontSize: "0.62rem" }}>{d.branch}</span>
                          <span className={`px-2 py-0.5 rounded ${d.env==="Production"?"bg-red-500/10 text-red-400":"bg-blue-500/10 text-blue-400"}`} style={{ fontSize: "0.62rem" }}>{d.env}</span>
                        </div>
                        <p className="text-white/40" style={{ fontSize: "0.7rem" }}>by {d.by} • {d.time} • {d.duration}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full font-bold ${d.status==="success"?"bg-emerald-500/15 text-emerald-400":"bg-red-500/15 text-red-400"}`} style={{ fontSize: "0.65rem" }}>
                        {d.status === "success" ? "PASSED" : "FAILED"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ DEV: Config ══ */}
            {isDev && activeTab === "config" && (
              <motion.div key="d-cfg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                <h2 className="text-white mb-5" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Config & Dependencies</h2>
                <div className="bg-[#040810] rounded-2xl border border-white/8 font-mono mb-5 overflow-hidden">
                  <div className="px-5 py-2 border-b border-white/8 flex items-center gap-2">
                    <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-amber-500" /><div className="w-3 h-3 rounded-full bg-emerald-500" /></div>
                    <span className="text-white/30 ml-2" style={{ fontSize: "0.72rem" }}>.env (sanitized)</span>
                    <span className="ml-auto" style={{ fontSize: "0.65rem", color: accentColor }}>ENV: production</span>
                  </div>
                  <div className="p-5 space-y-1.5">
                    {[["VITE_API_URL","https://api.nestaviet.vn/v2"],["VITE_AI_ENDPOINT","https://ai.nestaviet.vn"],["VITE_WS_URL","wss://ws.nestaviet.vn"],["DATABASE_URL","•••••••••••••• (hidden)"],["REDIS_URL","•••••••• (hidden)"],["JWT_SECRET","•••••••• (hidden)"],["NODE_ENV","production"]].map(([k,v])=>(
                      <div key={k} className="flex gap-3" style={{ fontSize: "0.78rem" }}>
                        <span style={{ color: accentColor }}>{k}</span>
                        <span className="text-white/40">=</span>
                        <span className={v.includes("hidden") ? "text-white/20 italic" : "text-emerald-300"}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-violet-500/10 overflow-hidden" style={{ background: "#0c1020" }}>
                  <div className="px-5 py-3 border-b border-white/8"><p style={{ fontSize: "0.875rem", fontWeight: 700 }}>Frontend Dependencies</p></div>
                  <div className="divide-y divide-white/5">
                    {DEV_PKGS.map((pkg) => (
                      <div key={pkg.name} className="px-5 py-3 flex items-center gap-4 hover:bg-white/3 transition-colors">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${pkg.ok?"bg-emerald-400":"bg-amber-400"}`} />
                        <p className="text-white flex-1" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{pkg.name}</p>
                        <span style={{ fontSize: "0.75rem", color: accentColor }} className="font-mono">v{pkg.version}</span>
                        <span className={pkg.ok?"text-emerald-400":"text-amber-400"} style={{ fontSize: "0.65rem" }}>{pkg.ok?"✓ up to date":"↑ update"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
