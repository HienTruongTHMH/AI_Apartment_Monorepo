import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity, AlertTriangle, Bot, Database,
  Flag, GitBranch, Globe, Layers, LogOut,
  RefreshCw, Server, Settings, Terminal,
  CheckCircle2, XCircle, Clock,
  Search, Bell, Network, Eye,
  Play, RotateCcw, Download, Upload, Edit3, Copy, Check, Users,
} from "lucide-react";
import { useLang } from "@shared/hooks/useLang";
import { useCountUp } from "@shared/hooks/useCountUp";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AUTH_KEY = "nv_dev_session";
function getSession() {
  try { return JSON.parse(sessionStorage.getItem(AUTH_KEY) || "{}"); } catch { return {}; }
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const AGENTS = [
  { id: "a1", name: "Listing Verifier", status: "online",  load: 34, requests: 1240, errors: 2,  latency: 120, lang: "Python • LangChain",   metrics: [45,60,55,70,34,40,38,34] },
  { id: "a2", name: "Super Broker",     status: "online",  load: 78, requests: 8430, errors: 5,  latency: 380, lang: "Python • RAG",          metrics: [60,70,80,75,78,82,80,78] },
  { id: "a3", name: "Smart Concierge",  status: "warning", load: 91, requests: 3200, errors: 18, latency: 245, lang: "Python • LangGraph",     metrics: [70,75,85,90,91,88,92,91] },
  { id: "a4", name: "Contract Admin",   status: "online",  load: 22, requests: 980,  errors: 0,  latency: 95,  lang: "Python • Rust API",      metrics: [30,25,28,22,20,24,22,22] },
];

const API_LOGS = [
  { time: "10:42:31", method: "GET",    path: "/api/v2/listings",          status: 200, ms: 48,  size: "12.4KB", user: "tenant:3921" },
  { time: "10:42:28", method: "POST",   path: "/api/v2/ai/price-estimate",  status: 200, ms: 421, size: "2.1KB",  user: "tenant:4102" },
  { time: "10:42:25", method: "GET",    path: "/api/v2/contracts/88",       status: 200, ms: 32,  size: "4.8KB",  user: "landlord:201" },
  { time: "10:42:22", method: "POST",   path: "/api/v2/payments",           status: 201, ms: 156, size: "0.8KB",  user: "tenant:3921" },
  { time: "10:42:19", method: "DELETE", path: "/api/v2/listings/1045",      status: 204, ms: 28,  size: "0B",     user: "landlord:89" },
  { time: "10:42:15", method: "POST",   path: "/api/v2/ai/chat",            status: 500, ms: 2810, size: "0.2KB", user: "tenant:5002" },
  { time: "10:42:12", method: "GET",    path: "/api/v2/users/me",           status: 401, ms: 12,  size: "0.1KB",  user: "anonymous" },
  { time: "10:42:08", method: "PUT",    path: "/api/v2/listings/982",       status: 200, ms: 88,  size: "3.2KB",  user: "landlord:201" },
  { time: "10:42:05", method: "GET",    path: "/api/v2/analytics/kpi",      status: 200, ms: 201, size: "18.2KB", user: "admin:1" },
  { time: "10:42:01", method: "POST",   path: "/api/v2/docs/scan",          status: 200, ms: 1240, size: "24.1KB",user: "tenant:3800" },
];

const ERRORS = [
  { id: "E-1042", level: "error",   time: "10:42:15", service: "AI Core",      msg: "OpenAI timeout after 2.8s — /ai/chat endpoint", count: 3,  resolved: false },
  { id: "E-1041", level: "warning", time: "10:38:00", service: "Rust API",     msg: "High memory usage: 87% on node rust-api-2",      count: 1,  resolved: false },
  { id: "E-1040", level: "error",   time: "10:22:45", service: "Worker",       msg: "Redis connection lost — retrying (2/5)",          count: 2,  resolved: true },
  { id: "E-1039", level: "warning", time: "09:55:10", service: "DB",           msg: "Slow query: listings.search > 800ms",             count: 8,  resolved: true },
  { id: "E-1038", level: "info",    time: "09:30:00", service: "Scheduler",    msg: "Cron job: rent-reminder fired for 24 leases",     count: 1,  resolved: true },
];

const FEATURE_FLAGS = [
  { key: "ai_price_estimator",     label: "AI Price Estimator",      enabled: true,  env: "all",         rollout: 100, desc: "Hiện bảng ước giá AI trên TenantApp" },
  { key: "doc_scanner_ocr",        label: "Document Scanner OCR",    enabled: true,  env: "all",         rollout: 100, desc: "Tính năng quét tài liệu OCR" },
  { key: "map_view",               label: "Map View (TP.HCM)",       enabled: true,  env: "all",         rollout: 100, desc: "Bản đồ tương tác SVG TP.HCM" },
  { key: "chat_inbox",             label: "Chat Inbox",               enabled: true,  env: "all",         rollout: 100, desc: "Hộp thư chat tenant↔landlord" },
  { key: "maintenance_calendar",   label: "Maintenance Calendar",     enabled: true,  env: "landlord",    rollout: 100, desc: "Lịch bảo trì cho landlord" },
  { key: "rating_system",          label: "Rating System",            enabled: false, env: "beta",        rollout: 20,  desc: "Hệ thống đánh giá (beta)" },
  { key: "push_notifications_v2",  label: "Push Notifications v2",   enabled: false, env: "dev",         rollout: 0,   desc: "Push notification thế hệ mới" },
  { key: "ai_contract_generator",  label: "AI Contract Generator",   enabled: false, env: "dev",         rollout: 0,   desc: "Tự động soạn hợp đồng bằng AI" },
];

const DB_TABLES = [
  { name: "users",          rows: "24,812",  size: "18.2MB", indexes: 4 },
  { name: "listings",       rows: "9,340",   size: "42.1MB", indexes: 7 },
  { name: "contracts",      rows: "18,204",  size: "8.4MB",  indexes: 3 },
  { name: "payments",       rows: "142,920", size: "28.7MB", indexes: 5 },
  { name: "messages",       rows: "891,024", size: "310MB",  indexes: 4 },
  { name: "ai_sessions",    rows: "324,100", size: "124MB",  indexes: 3 },
  { name: "reviews",        rows: "8,204",   size: "5.1MB",  indexes: 2 },
  { name: "access_logs",    rows: "2.1M",    size: "820MB",  indexes: 4 },
];

const DEPLOYS = [
  { id: "d-981", env: "production", branch: "main",    commit: "e4f8862", msg: "feat: manager & dev portals", status: "success",  time: "30/04 09:12", by: "dev@nestaviet.vn", duration: "2m 18s" },
  { id: "d-980", env: "staging",    branch: "develop", commit: "3a1f204", msg: "fix: ternary syntax in KPI",  status: "success",  time: "30/04 08:45", by: "dev@nestaviet.vn", duration: "1m 52s" },
  { id: "d-979", env: "production", branch: "main",    commit: "89cd712", msg: "feat: animations system",    status: "failed",   time: "29/04 18:30", by: "dev@nestaviet.vn", duration: "3m 05s" },
  { id: "d-978", env: "staging",    branch: "feat/ai", commit: "c92e031", msg: "feat: PriceEstimator",       status: "success",  time: "29/04 15:20", by: "dev@nestaviet.vn", duration: "2m 01s" },
];

const PERF_DATA = Array.from({ length: 20 }, (_, i) => ({
  t: `${i * 3}m`, cpu: 30 + Math.random() * 40, mem: 50 + Math.random() * 25, req: Math.round(100 + Math.random() * 200),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────
const methodColor: Record<string, string> = {
  GET: "text-emerald-400 bg-emerald-500/10", POST: "text-blue-400 bg-blue-500/10",
  PUT: "text-amber-400 bg-amber-500/10", DELETE: "text-red-400 bg-red-500/10",
  PATCH: "text-violet-400 bg-violet-500/10",
};
const statusColor = (s: number) =>
  s < 300 ? "text-emerald-400" : s < 400 ? "text-blue-400" : s < 500 ? "text-amber-400" : "text-red-400";

type DevTab = "overview" | "api_logs" | "agents" | "database" | "deploys" | "flags" | "errors" | "config";

function OverviewKpi({ label, target, suffix, icon: Icon, color, delay = 0 }: {
  label: string; target: number; suffix: string; icon: React.ElementType; color: string; delay?: number;
}) {
  const count = useCountUp(target, 900);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 22 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-4 nv-shimmer nv-tilt-card relative overflow-hidden`}
      style={{ boxShadow: "0 8px 28px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <motion.div whileHover={{ rotate: 8, scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
        <Icon size={16} className="text-white/70 mb-2" />
      </motion.div>
      <p className="text-white text-xl font-bold tabular-nums">{count.toLocaleString()}{suffix}</p>
      <p className="text-white/45 text-xs mt-0.5 font-sans">{label}</p>
    </motion.div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export function DevApp() {
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLang("dev");
  const [tab, setTab] = useState<DevTab>("overview");
  const [flags, setFlags] = useState(FEATURE_FLAGS);
  const [copied, setCopied] = useState("");
  const session = getSession();

  useEffect(() => {
    if (!session.expiry || Date.now() >= session.expiry) navigate("/dev/login", { replace: true });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    navigate("/dev/login", { replace: true });
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(""), 1800);
  };

  const navItems: { id: DevTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "overview",  label: "Overview",      icon: Activity },
    { id: "api_logs",  label: "API Logs",       icon: Layers,    badge: API_LOGS.filter(l => l.status >= 400).length },
    { id: "agents",    label: "AI Agents",      icon: Bot,       badge: AGENTS.filter(a => a.status === "warning").length },
    { id: "database",  label: "Database",       icon: Database },
    { id: "deploys",   label: "Deployments",    icon: GitBranch },
    { id: "flags",     label: "Feature Flags",  icon: Flag,      badge: flags.filter(f => !f.enabled).length },
    { id: "errors",    label: "Errors",         icon: AlertTriangle, badge: ERRORS.filter(e => !e.resolved).length },
    { id: "config",    label: "Config",         icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#030B14] text-white overflow-hidden font-mono">
      {/* Global scan line for dev portal */}
      <div className="nv-scan-line" style={{ zIndex: 50 }} />

      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 flex flex-col border-r border-blue-500/12 relative z-10" style={{ background: "rgba(1,5,12,0.99)" }}>
        <div className="p-4 border-b border-blue-500/10">
          <motion.div
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center nv-glow-pulse-blue" style={{ boxShadow: "0 0 16px rgba(59,130,246,0.35)" }}>
              <Terminal size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold" style={{ fontSize: "0.82rem" }}>Nesta<span className="text-blue-400">Dev</span></p>
              <p className="text-blue-400/50" style={{ fontSize: "0.6rem" }}>console v2.4.1</p>
            </div>
          </motion.div>
        </div>

        <div className="p-3 border-b border-blue-500/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 22 }}
            className="flex items-center gap-2.5 bg-blue-500/6 border border-blue-500/15 rounded-xl p-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xs nv-status-online">
              {session.name?.[0] || "D"}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold truncate" style={{ fontSize: "0.76rem" }}>{session.name || "Dev"}</p>
              <p className="text-blue-300/40 truncate" style={{ fontSize: "0.6rem" }}>{session.level || "Engineer"}</p>
            </div>
          </motion.div>
        </div>

        <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
          {navItems.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => setTab(item.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.04, type: "spring", stiffness: 280, damping: 26 }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.96 }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors text-left relative overflow-hidden ${
                tab === item.id
                  ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                  : "text-white/35 hover:text-white/65 hover:bg-white/4"
              }`}
              style={{ fontSize: "0.78rem" }}
            >
              {tab === item.id && (
                <motion.div
                  layoutId="dev-tab-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-blue-400"
                />
              )}
              <item.icon size={13} className={tab === item.id ? "text-blue-400" : ""} />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center nv-badge-pop" style={{ fontSize: "0.52rem" }}>{item.badge}</span>
              ) : null}
            </motion.button>
          ))}
        </nav>

        <div className="p-2.5 border-t border-blue-500/10 space-y-1">
          <button onClick={toggleLang} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/25 hover:text-white/55 hover:bg-white/4 transition-all" style={{ fontSize: "0.74rem" }}>
            <Globe size={13} />
            {lang === "vi" ? "English" : "Tiếng Việt"}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400/55 hover:text-red-400 hover:bg-red-500/8 transition-all" style={{ fontSize: "0.74rem" }}>
            <LogOut size={13} />
            {t("Đăng xuất", "Sign Out")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="flex items-center justify-between px-5 py-3 border-b border-blue-500/10" style={{ background: "rgba(1,5,12,0.85)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-2">
            <span className="text-blue-500/40 font-mono" style={{ fontSize: "0.75rem" }}>$</span>
            <motion.span
              key={tab}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="text-blue-300/70 font-mono" style={{ fontSize: "0.76rem" }}
            >
              nv-console <span className="text-white/35">--tab</span> <span className="text-cyan-400">{tab}</span>
            </motion.span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 nv-status-online" />
              <span className="text-emerald-400/60 font-mono" style={{ fontSize: "0.7rem" }}>production</span>
            </div>
            <motion.div whileHover={{ scale: 1.15, rotate: 10 }} whileTap={{ scale: 0.9 }} className="cursor-pointer">
              <Bell size={15} className="text-white/35 hover:text-white/65 transition-colors" />
            </motion.div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >

              {/* ─── OVERVIEW ─── */}
              {tab === "overview" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-4 gap-3">
                    <OverviewKpi label="API Requests / min" target={847}  suffix=""   icon={Network} color="from-blue-700 to-blue-900"      delay={0} />
                    <OverviewKpi label="Avg Latency (ms)"   target={142}  suffix="ms" icon={Clock}   color="from-emerald-700 to-emerald-900" delay={0.08} />
                    <OverviewKpi label="Error Rate"         target={2}    suffix="%"  icon={XCircle} color="from-red-800 to-red-950"         delay={0.16} />
                    <OverviewKpi label="Active Sessions"    target={1284} suffix=""   icon={Users}   color="from-violet-700 to-violet-900"   delay={0.24} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-white/3 rounded-2xl border border-blue-500/10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-white/70 font-semibold" style={{ fontSize: "0.82rem" }}>System Metrics — Last 60min</p>
                        <RefreshCw size={13} className="text-white/30 cursor-pointer hover:text-white/60 transition-colors" />
                      </div>
                      <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={PERF_DATA}>
                          <defs>
                            <linearGradient id="gCpu" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gMem" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                          <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 11 }} />
                          <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="url(#gCpu)" strokeWidth={2} name="CPU %" />
                          <Area type="monotone" dataKey="mem" stroke="#10b981" fill="url(#gMem)" strokeWidth={2} name="Memory %" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white/3 rounded-2xl border border-blue-500/10 p-4">
                        <p className="text-white/50 text-xs font-semibold mb-3 uppercase tracking-wider">Services</p>
                        {[
                          { name: "Rust API Gateway", status: "online" },
                          { name: "Python AI Core",   status: "online" },
                          { name: "Redis Cache",      status: "warning" },
                          { name: "PostgreSQL",       status: "online" },
                          { name: "Worker Queue",     status: "online" },
                        ].map((s) => (
                          <div key={s.name} className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
                            <span className="text-white/55 flex-1 truncate" style={{ fontSize: "0.76rem" }}>{s.name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white/3 rounded-2xl border border-blue-500/10 p-4">
                        <p className="text-white/50 text-xs font-semibold mb-3 uppercase tracking-wider">Recent Deploy</p>
                        <div className="space-y-1" style={{ fontSize: "0.72rem" }}>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={11} className="text-emerald-400" />
                            <span className="text-white/55">production • main</span>
                          </div>
                          <p className="text-white/35 font-mono">e4f8862 — manager portals</p>
                          <p className="text-white/25">30/04 09:12 • 2m 18s</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/3 rounded-2xl border border-blue-500/10 p-4">
                    <p className="text-white/70 font-semibold mb-3" style={{ fontSize: "0.82rem" }}>Recent API Errors</p>
                    <div className="space-y-2">
                      {ERRORS.filter(e => !e.resolved).map((err) => (
                        <div key={err.id} className="flex items-center gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-3 py-2">
                          <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />
                          <span className="text-white/35 font-mono w-14 flex-shrink-0" style={{ fontSize: "0.7rem" }}>{err.time}</span>
                          <span className="text-red-400/80 flex-1 truncate" style={{ fontSize: "0.77rem" }}>{err.msg}</span>
                          <span className="text-white/25" style={{ fontSize: "0.68rem" }}>{err.service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── API LOGS ─── */}
              {tab === "api_logs" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input placeholder="Filter by path, status, user..." className="w-full bg-white/4 border border-white/8 rounded-xl py-2 pl-8 pr-4 text-white placeholder-white/20 outline-none focus:border-blue-500/40 transition-colors" style={{ fontSize: "0.8rem" }} />
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-500/15 border border-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-500/25 transition-colors" style={{ fontSize: "0.78rem" }}>
                      <Download size={12} /> Export
                    </button>
                  </div>

                  <div className="bg-white/3 rounded-2xl border border-white/6 overflow-hidden">
                    <div className="grid gap-0 divide-y divide-white/4">
                      {API_LOGS.map((log, i) => (
                        <div key={i} className="grid items-center gap-3 px-4 py-2.5 hover:bg-white/3 transition-colors" style={{ gridTemplateColumns: "72px 60px 1fr 60px 60px 80px 120px" }}>
                          <span className="text-white/25 font-mono" style={{ fontSize: "0.68rem" }}>{log.time}</span>
                          <span className={`px-1.5 py-0.5 rounded font-mono text-xs w-fit ${methodColor[log.method]}`} style={{ fontSize: "0.65rem" }}>{log.method}</span>
                          <span className="text-white/65 font-mono truncate" style={{ fontSize: "0.76rem" }}>{log.path}</span>
                          <span className={`font-mono font-semibold ${statusColor(log.status)}`} style={{ fontSize: "0.76rem" }}>{log.status}</span>
                          <span className="text-white/35 font-mono" style={{ fontSize: "0.72rem" }}>{log.ms}ms</span>
                          <span className="text-white/25 font-mono" style={{ fontSize: "0.68rem" }}>{log.size}</span>
                          <span className="text-white/30 font-mono truncate" style={{ fontSize: "0.68rem" }}>{log.user}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── AGENTS ─── */}
              {tab === "agents" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {AGENTS.map((agent) => (
                      <motion.div key={agent.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white/3 rounded-2xl border border-white/8 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${agent.status === "online" ? "bg-emerald-500/20" : "bg-amber-500/20"}`}>
                              <Bot size={16} className={agent.status === "online" ? "text-emerald-400" : "text-amber-400"} />
                            </div>
                            <div>
                              <p className="text-white font-semibold" style={{ fontSize: "0.85rem" }}>{agent.name}</p>
                              <p className="text-white/35" style={{ fontSize: "0.68rem" }}>{agent.lang}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${agent.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
                            <span className={`text-xs ${agent.status === "online" ? "text-emerald-400" : "text-amber-400"}`}>{agent.status}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[
                            { label: "Load", value: `${agent.load}%`, color: agent.load > 80 ? "text-red-400" : agent.load > 60 ? "text-amber-400" : "text-emerald-400" },
                            { label: "Requests", value: agent.requests.toLocaleString(), color: "text-blue-300" },
                            { label: "Errors", value: agent.errors, color: agent.errors > 10 ? "text-red-400" : "text-white/60" },
                          ].map((s) => (
                            <div key={s.label} className="bg-white/4 rounded-xl p-2.5 text-center">
                              <p className={`font-bold ${s.color}`} style={{ fontSize: "0.88rem" }}>{s.value}</p>
                              <p className="text-white/30" style={{ fontSize: "0.65rem" }}>{s.label}</p>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between" style={{ fontSize: "0.7rem" }}>
                            <span className="text-white/35">CPU Load</span>
                            <span className={agent.load > 80 ? "text-red-400" : "text-white/50"}>{agent.load}%</span>
                          </div>
                          <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${agent.load}%` }} transition={{ duration: 1 }}
                              className={`h-full rounded-full ${agent.load > 80 ? "bg-red-500" : agent.load > 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                            />
                          </div>
                          <div className="flex justify-between mt-2" style={{ fontSize: "0.7rem" }}>
                            <span className="text-white/35">Latency</span>
                            <span className={agent.latency > 300 ? "text-amber-400" : "text-white/50"}>{agent.latency}ms</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3 pt-3 border-t border-white/6">
                          <button className="flex-1 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/15 text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1" style={{ fontSize: "0.72rem" }}>
                            <Eye size={11} /> Logs
                          </button>
                          <button className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:bg-white/8 transition-colors flex items-center justify-center gap-1" style={{ fontSize: "0.72rem" }}>
                            <RotateCcw size={11} /> Restart
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── DATABASE ─── */}
              {tab === "database" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Total Tables", value: DB_TABLES.length, icon: Database, color: "text-blue-400" },
                      { label: "Total Rows",   value: "3.5M+",           icon: Layers,   color: "text-violet-400" },
                      { label: "DB Size",      value: "1.36GB",           icon: Server,   color: "text-emerald-400" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white/3 rounded-2xl border border-white/6 p-4 flex items-center gap-3">
                        <s.icon size={18} className={s.color} />
                        <div>
                          <p className="text-white font-bold" style={{ fontSize: "1.1rem" }}>{s.value}</p>
                          <p className="text-white/35 text-xs">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/3 rounded-2xl border border-white/6 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6">
                      <p className="text-white/70 font-semibold" style={{ fontSize: "0.85rem" }}>Schema Browser</p>
                      <span className="text-white/25 text-xs">PostgreSQL 16.2</span>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/6 bg-white/2">
                          {["Table", "Rows", "Size", "Indexes", ""].map((h) => (
                            <th key={h} className="text-left px-4 py-3 text-white/30 font-semibold" style={{ fontSize: "0.7rem" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {DB_TABLES.map((tb) => (
                          <tr key={tb.name} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                            <td className="px-4 py-3 font-mono text-blue-300" style={{ fontSize: "0.8rem" }}>{tb.name}</td>
                            <td className="px-4 py-3 text-white/55 font-mono" style={{ fontSize: "0.78rem" }}>{tb.rows}</td>
                            <td className="px-4 py-3 text-white/45 font-mono" style={{ fontSize: "0.78rem" }}>{tb.size}</td>
                            <td className="px-4 py-3 text-white/40 font-mono" style={{ fontSize: "0.78rem" }}>{tb.indexes}</td>
                            <td className="px-4 py-3">
                              <button className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/15 text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center gap-1" style={{ fontSize: "0.68rem" }}>
                                <Eye size={10} /> Browse
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─── DEPLOYS ─── */}
              {tab === "deploys" && (
                <div className="space-y-3">
                  {DEPLOYS.map((d) => (
                    <motion.div key={d.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="bg-white/3 rounded-2xl border border-white/6 p-4 flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${d.status === "success" ? "bg-emerald-500/15" : "bg-red-500/15"}`}>
                        {d.status === "success" ? <CheckCircle2 size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-mono ${d.env === "production" ? "bg-violet-500/15 text-violet-400" : "bg-amber-500/15 text-amber-400"}`}>{d.env}</span>
                          <span className="text-white/60 font-mono" style={{ fontSize: "0.78rem" }}>{d.branch}</span>
                          <span className="text-white/25 font-mono" style={{ fontSize: "0.7rem" }}>@ {d.commit}</span>
                        </div>
                        <p className="text-white/70" style={{ fontSize: "0.8rem" }}>{d.msg}</p>
                        <div className="flex items-center gap-3 mt-1" style={{ fontSize: "0.68rem" }}>
                          <span className="text-white/25">{d.time}</span>
                          <span className="text-white/25">by {d.by}</span>
                          <span className={d.status === "success" ? "text-emerald-400/60" : "text-red-400/60"}>{d.duration}</span>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-white/8 text-white/30 hover:text-blue-400 transition-colors">
                        <RotateCcw size={14} />
                      </button>
                    </motion.div>
                  ))}

                  <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-4 flex items-center gap-4">
                    <Upload size={16} className="text-blue-400" />
                    <div className="flex-1">
                      <p className="text-blue-300 font-semibold" style={{ fontSize: "0.83rem" }}>New Deployment</p>
                      <p className="text-white/30" style={{ fontSize: "0.72rem" }}>Push to main → auto-deploys to production via GitHub Actions</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-colors flex items-center gap-1.5" style={{ fontSize: "0.78rem" }}>
                      <Play size={12} /> Trigger
                    </button>
                  </div>
                </div>
              )}

              {/* ─── FEATURE FLAGS ─── */}
              {tab === "flags" && (
                <div className="space-y-3">
                  <p className="text-white/30" style={{ fontSize: "0.78rem" }}>
                    {t("Bật/tắt tính năng theo môi trường — thay đổi có hiệu lực ngay.", "Toggle features per environment — changes take effect immediately.")}
                  </p>
                  {flags.map((flag) => (
                    <motion.div key={flag.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/3 rounded-2xl border border-white/6 p-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-white font-semibold" style={{ fontSize: "0.85rem" }}>{flag.label}</p>
                          <span className="px-1.5 py-0.5 bg-white/6 rounded text-white/35 font-mono" style={{ fontSize: "0.62rem" }}>{flag.env}</span>
                        </div>
                        <p className="text-white/35" style={{ fontSize: "0.72rem" }}>{flag.desc}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <code className="text-blue-300/60 font-mono" style={{ fontSize: "0.65rem" }}>{flag.key}</code>
                          <button onClick={() => copyToClipboard(flag.key, flag.key)} className="text-white/20 hover:text-white/50 transition-colors">
                            {copied === flag.key ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {flag.rollout < 100 && (
                          <span className="text-white/30" style={{ fontSize: "0.7rem" }}>{flag.rollout}% rollout</span>
                        )}
                        <button
                          onClick={() => setFlags(prev => prev.map(f => f.key === flag.key ? { ...f, enabled: !f.enabled } : f))}
                          className={`relative w-11 h-6 rounded-full transition-colors ${flag.enabled ? "bg-blue-500" : "bg-white/10"}`}
                        >
                          <motion.div
                            animate={{ x: flag.enabled ? 20 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                          />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ─── ERRORS ─── */}
              {tab === "errors" && (
                <div className="space-y-3">
                  {ERRORS.map((err) => (
                    <motion.div key={err.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className={`rounded-2xl border p-4 flex items-start gap-3 ${
                        err.level === "error" ? "bg-red-500/5 border-red-500/20" :
                        err.level === "warning" ? "bg-amber-500/5 border-amber-500/20" : "bg-blue-500/5 border-blue-500/15"
                      }`}
                    >
                      <AlertTriangle size={15} className={err.level === "error" ? "text-red-400" : err.level === "warning" ? "text-amber-400" : "text-blue-400"} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded font-mono text-xs ${err.level === "error" ? "bg-red-500/20 text-red-400" : err.level === "warning" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"}`}>{err.level}</span>
                          <span className="text-white/30 font-mono" style={{ fontSize: "0.7rem" }}>{err.id}</span>
                          <span className="text-white/25 font-mono" style={{ fontSize: "0.7rem" }}>{err.time}</span>
                        </div>
                        <p className="text-white/75" style={{ fontSize: "0.82rem" }}>{err.msg}</p>
                        <p className="text-white/30 mt-0.5" style={{ fontSize: "0.7rem" }}>
                          {err.service} • occurred {err.count}× •
                          {err.resolved ? <span className="text-emerald-400/70"> resolved</span> : <span className="text-red-400/70"> open</span>}
                        </p>
                      </div>
                      {!err.resolved && (
                        <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/8 transition-colors flex items-center gap-1" style={{ fontSize: "0.72rem" }}>
                          <CheckCircle2 size={11} /> Resolve
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ─── CONFIG ─── */}
              {tab === "config" && (
                <div className="max-w-2xl space-y-4">
                  <div className="bg-white/3 rounded-2xl border border-white/6 p-5">
                    <p className="text-white/60 font-semibold mb-4" style={{ fontSize: "0.82rem" }}>Environment Variables</p>
                    <div className="space-y-2.5">
                      {[
                        { key: "OPENAI_API_KEY",      value: "sk-••••••••••••••••••••••••••••••" },
                        { key: "DATABASE_URL",         value: "postgresql://nv:••••@db.nestaviet.vn:5432/nv_prod" },
                        { key: "REDIS_URL",            value: "redis://cache.nestaviet.vn:6379" },
                        { key: "JWT_SECRET",           value: "••••••••••••••••••••••••••••••••" },
                        { key: "RUST_API_URL",         value: "https://api.nestaviet.vn/v2" },
                        { key: "ENVIRONMENT",          value: "production" },
                        { key: "AI_MODEL",             value: "claude-sonnet-4-6" },
                        { key: "MAX_CONCURRENT_CALLS", value: "50" },
                      ].map((env) => (
                        <div key={env.key} className="flex items-center gap-3 bg-white/2 rounded-xl px-3 py-2.5 group">
                          <span className="text-blue-300/70 font-mono flex-1" style={{ fontSize: "0.75rem" }}>{env.key}</span>
                          <span className="text-white/25 font-mono" style={{ fontSize: "0.73rem" }}>{env.value}</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity text-white/25 hover:text-white/60">
                            <Edit3 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/3 rounded-2xl border border-white/6 p-5">
                    <p className="text-white/60 font-semibold mb-4" style={{ fontSize: "0.82rem" }}>API Keys</p>
                    <div className="space-y-3">
                      {[
                        { name: "Admin API Key",   key: "nv_admin_sk_prod_••••••••••", scope: "read:all, write:all" },
                        { name: "Public API Key",  key: "nv_pub_pk_prod_••••••••••",   scope: "read:listings" },
                        { name: "Webhook Secret",  key: "nv_wh_sec_••••••••••••",      scope: "webhooks" },
                      ].map((apiKey) => (
                        <div key={apiKey.name} className="flex items-center justify-between bg-white/2 rounded-xl px-3 py-3 gap-4">
                          <div>
                            <p className="text-white/70 font-semibold" style={{ fontSize: "0.8rem" }}>{apiKey.name}</p>
                            <code className="text-white/30 font-mono" style={{ fontSize: "0.7rem" }}>{apiKey.key}</code>
                            <p className="text-white/20 mt-0.5" style={{ fontSize: "0.65rem" }}>scope: {apiKey.scope}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => copyToClipboard(apiKey.key, apiKey.name)} className="p-2 rounded-lg hover:bg-white/8 text-white/25 hover:text-blue-400 transition-colors">
                              {copied === apiKey.name ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/8 text-white/25 hover:text-white/60 transition-colors"><RotateCcw size={13} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

