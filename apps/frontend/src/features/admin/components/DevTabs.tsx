import { motion, AnimatePresence } from "motion/react";
import {
  Activity, Database, Zap, Package, Wifi,
  CheckSquare, XCircle,
} from "lucide-react";
import { LogsPanel, NodeGraph, AgentsGrid, SystemNodesTable } from "./SharedAdminComponents";
import { DEPLOY_HISTORY, DEV_PKGS } from "./adminData";

export type DevTab = "logs" | "system" | "agents" | "deploys" | "config";

export interface DevTabsProps {
  activeTab: DevTab;
  accentColor: string;
}

export function DevTabs({ activeTab, accentColor }: DevTabsProps) {
  const bgCard = "#0c1020";

  return (
    <AnimatePresence mode="wait">
      {activeTab === "logs" && <LogsPanel key="d-lg" accent={accentColor} />}

      {activeTab === "system" && (
        <motion.div key="d-sys" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <h2 className="text-white mb-5" style={{ fontSize: "1.1rem", fontWeight: 700 }}>System Health Monitor</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { label: "API Uptime",     value: "99.98%", color: "#10b981", icon: Activity  },
              { label: "DB Connections", value: "24/100", color: "#22d3ee", icon: Database  },
              { label: "Cache Hit Rate", value: "94.2%",  color: "#a78bfa", icon: Zap       },
              { label: "Storage Used",   value: "88%",    color: "#f59e0b", icon: Package   },
              { label: "Avg Latency",    value: "186ms",  color: "#34d399", icon: Activity  },
              { label: "Active Conns",   value: "1,284",  color: "#60a5fa", icon: Wifi      },
            ].map((s, i) => (
              <motion.div key={i} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-4 border border-violet-500/10" style={{ background: bgCard }}>
                <s.icon size={16} className="text-white/30 mb-2" />
                <p style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</p>
                <p className="text-white/50" style={{ fontSize: "0.75rem" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
          <SystemNodesTable bgCard={bgCard} accentVariant="dev" />
        </motion.div>
      )}

      {activeTab === "agents" && (
        <motion.div key="d-ag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <NodeGraph />
          <AgentsGrid />
        </motion.div>
      )}

      {activeTab === "deploys" && (
        <motion.div key="d-dep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Deployment History</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white" style={{ background: accentColor, fontSize: "0.8rem", fontWeight: 600 }}>Deploy Now</button>
          </div>
          <div className="space-y-3">
            {DEPLOY_HISTORY.map((d, i) => (
              <motion.div key={d.id} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-4 border border-violet-500/10 hover:border-violet-500/25 transition-all flex items-center gap-4" style={{ background: bgCard }}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${d.status === "success" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                  {d.status === "success" ? <CheckSquare size={17} className="text-emerald-400" /> : <XCircle size={17} className="text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-mono" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{d.commit}</span>
                    <span className="px-2 py-0.5 rounded" style={{ background: accentColor + "18", color: accentColor, fontSize: "0.62rem" }}>{d.branch}</span>
                    <span className={`px-2 py-0.5 rounded ${d.env === "Production" ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"}`} style={{ fontSize: "0.62rem" }}>{d.env}</span>
                  </div>
                  <p className="text-white/40" style={{ fontSize: "0.7rem" }}>by {d.by} • {d.time} • {d.duration}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-bold ${d.status === "success" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`} style={{ fontSize: "0.65rem" }}>
                  {d.status === "success" ? "PASSED" : "FAILED"}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === "config" && (
        <motion.div key="d-cfg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
          <h2 className="text-white mb-5" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Config & Dependencies</h2>
          <div className="bg-[#040810] rounded-2xl border border-white/8 font-mono mb-5 overflow-hidden">
            <div className="px-5 py-2 border-b border-white/8 flex items-center gap-2">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-amber-500" /><div className="w-3 h-3 rounded-full bg-emerald-500" /></div>
              <span className="text-white/30 ml-2" style={{ fontSize: "0.72rem" }}>.env (sanitized)</span>
              <span className="ml-auto" style={{ fontSize: "0.65rem", color: accentColor }}>ENV: production</span>
            </div>
            <div className="p-5 space-y-1.5">
              {[
                ["VITE_API_URL",    "https://api.nestaviet.vn/v2"],
                ["VITE_AI_ENDPOINT","https://ai.nestaviet.vn"],
                ["VITE_WS_URL",    "wss://ws.nestaviet.vn"],
                ["DATABASE_URL",   "•••••••••••••• (hidden)"],
                ["REDIS_URL",      "•••••••• (hidden)"],
                ["JWT_SECRET",     "•••••••• (hidden)"],
                ["NODE_ENV",       "production"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3" style={{ fontSize: "0.78rem" }}>
                  <span style={{ color: accentColor }}>{k}</span>
                  <span className="text-white/40">=</span>
                  <span className={v.includes("hidden") ? "text-white/20 italic" : "text-emerald-300"}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-violet-500/10 overflow-hidden" style={{ background: bgCard }}>
            <div className="px-5 py-3 border-b border-white/8"><p style={{ fontSize: "0.875rem", fontWeight: 700 }}>Frontend Dependencies</p></div>
            <div className="divide-y divide-white/5">
              {DEV_PKGS.map((pkg) => (
                <div key={pkg.name} className="px-5 py-3 flex items-center gap-4 hover:bg-white/3 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${pkg.ok ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <p className="text-white flex-1" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{pkg.name}</p>
                  <span style={{ fontSize: "0.75rem", color: accentColor }} className="font-mono">v{pkg.version}</span>
                  <span className={pkg.ok ? "text-emerald-400" : "text-amber-400"} style={{ fontSize: "0.65rem" }}>{pkg.ok ? "✓ up to date" : "↑ update"}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
