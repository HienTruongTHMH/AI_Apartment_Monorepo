import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Server, Globe } from "lucide-react";
import { AGENT_NODES, API_LOGS, SYSTEM_NODES } from "./adminData";

// ─── AgentCard ────────────────────────────────────────────────────────────────
export interface AgentNode {
  id: string;
  name: string;
  status: string;
  load: number;
  requests: number;
  errors: number;
  latency: number;
  color: string;
  icon: React.ElementType;
  desc: string;
  metrics: number[];
}

export function AgentCard({ agent }: { agent: AgentNode }) {
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
          <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full" style={{ background: sc }} />
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
          {[["Memory", "2.4 GB / 8 GB"], ["Uptime", "99.98% (30d)"], ["Last restart", "3 ngày trước"]].map(([k, v]) => (
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

// ─── NodeGraph ────────────────────────────────────────────────────────────────
export function NodeGraph() {
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
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.7 }} className="absolute flex flex-col items-center"
                style={{ left: `calc(50% + ${x}px - 20px)`, top: `calc(50% + ${y}px - 20px)`, zIndex: 10 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${agent.color}22`, border: `1.5px solid ${agent.color}66` }}>
                  <agent.icon size={17} style={{ color: agent.color }} />
                </div>
                <span className="text-white/50 mt-1 text-center" style={{ fontSize: "0.55rem", lineHeight: 1.2, maxWidth: "60px" }}>{agent.name.split(" ").slice(0, 2).join(" ")}</span>
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

// ─── LogsPanel ────────────────────────────────────────────────────────────────
export interface LogsPanelProps {
  accent: string;
}

export function LogsPanel({ accent }: LogsPanelProps) {
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
              className={`px-5 py-3 flex items-center gap-4 hover:bg-white/3 transition-colors ${log.status >= 400 ? "bg-red-500/5" : ""}`}>
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

// ─── SystemNodesTable ─────────────────────────────────────────────────────────
export interface SystemNodesTableProps {
  bgCard: string;
  accentVariant?: "admin" | "dev";
}

export function SystemNodesTable({ bgCard, accentVariant = "admin" }: SystemNodesTableProps) {
  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: bgCard }}>
      <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
        <p style={{ fontSize: "0.875rem", fontWeight: 700 }}>Infrastructure Nodes</p>
        {accentVariant === "admin" && <span className="text-white/40" style={{ fontSize: "0.72rem" }}>{SYSTEM_NODES.filter((n) => n.status === "online").length}/{SYSTEM_NODES.length} online</span>}
      </div>
      <div className="divide-y divide-white/5">
        {SYSTEM_NODES.map((node) => (
          <div key={node.id} className="px-5 py-3 flex items-center gap-4 hover:bg-white/3 transition-colors">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${node.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-white" style={{ fontSize: "0.8rem", fontWeight: 600 }}>{node.name}</p>
              <p style={{ fontSize: "0.65rem", color: accentVariant === "dev" ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.4)" }}>{node.type} • {node.version}</p>
            </div>
            <div className="w-24">
              <div className="flex justify-between mb-1">
                <span className="text-white/40" style={{ fontSize: "0.62rem" }}>Load</span>
                <span style={{ fontSize: "0.62rem", color: node.load > 80 ? "#f59e0b" : accentVariant === "dev" ? "#a78bfa" : "#6ee7b7" }}>{node.load}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${node.load}%`, background: node.load > 80 ? "#f59e0b" : accentVariant === "dev" ? "#8b5cf6" : "#10b981" }} />
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full font-semibold ${node.status === "online" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`} style={{ fontSize: "0.65rem" }}>
              {node.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AgentsGrid ───────────────────────────────────────────────────────────────
export function AgentsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {AGENT_NODES.map((ag) => <AgentCard key={ag.id} agent={ag as AgentNode} />)}
    </div>
  );
}

// Suppress AnimatePresence unused warning (it's re-exported for convenience)
export { AnimatePresence };
