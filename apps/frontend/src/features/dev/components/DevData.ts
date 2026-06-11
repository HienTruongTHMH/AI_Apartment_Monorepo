export const AGENTS = [
  { id: "a1", name: "Listing Verifier", status: "online",  load: 34, requests: 1240, errors: 2,  latency: 120, lang: "Python • LangChain",   metrics: [45,60,55,70,34,40,38,34] },
  { id: "a2", name: "Super Broker",     status: "online",  load: 78, requests: 8430, errors: 5,  latency: 380, lang: "Python • RAG",          metrics: [60,70,80,75,78,82,80,78] },
  { id: "a3", name: "Smart Concierge",  status: "warning", load: 91, requests: 3200, errors: 18, latency: 245, lang: "Python • LangGraph",     metrics: [70,75,85,90,91,88,92,91] },
  { id: "a4", name: "Contract Admin",   status: "online",  load: 22, requests: 980,  errors: 0,  latency: 95,  lang: "Python • Rust API",      metrics: [30,25,28,22,20,24,22,22] },
];

export const API_LOGS = [
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

export const ERRORS = [
  { id: "E-1042", level: "error",   time: "10:42:15", service: "AI Core",   msg: "OpenAI timeout after 2.8s — /ai/chat endpoint", count: 3,  resolved: false },
  { id: "E-1041", level: "warning", time: "10:38:00", service: "Rust API",  msg: "High memory usage: 87% on node rust-api-2",     count: 1,  resolved: false },
  { id: "E-1040", level: "error",   time: "10:22:45", service: "Worker",    msg: "Redis connection lost — retrying (2/5)",         count: 2,  resolved: true },
  { id: "E-1039", level: "warning", time: "09:55:10", service: "DB",        msg: "Slow query: listings.search > 800ms",            count: 8,  resolved: true },
  { id: "E-1038", level: "info",    time: "09:30:00", service: "Scheduler", msg: "Cron job: rent-reminder fired for 24 leases",    count: 1,  resolved: true },
];

export const INITIAL_FEATURE_FLAGS = [
  { key: "ai_price_estimator",     label: "AI Price Estimator",      enabled: true,  env: "all",         rollout: 100, desc: "Hiện bảng ước giá AI trên TenantApp" },
  { key: "doc_scanner_ocr",        label: "Document Scanner OCR",    enabled: true,  env: "all",         rollout: 100, desc: "Tính năng quét tài liệu OCR" },
  { key: "map_view",               label: "Map View (TP.HCM)",       enabled: true,  env: "all",         rollout: 100, desc: "Bản đồ tương tác SVG TP.HCM" },
  { key: "chat_inbox",             label: "Chat Inbox",               enabled: true,  env: "all",         rollout: 100, desc: "Hộp thư chat tenant↔landlord" },
  { key: "maintenance_calendar",   label: "Maintenance Calendar",     enabled: true,  env: "landlord",    rollout: 100, desc: "Lịch bảo trì cho landlord" },
  { key: "rating_system",          label: "Rating System",            enabled: false, env: "beta",        rollout: 20,  desc: "Hệ thống đánh giá (beta)" },
  { key: "push_notifications_v2",  label: "Push Notifications v2",   enabled: false, env: "dev",         rollout: 0,   desc: "Push notification thế hệ mới" },
  { key: "ai_contract_generator",  label: "AI Contract Generator",   enabled: false, env: "dev",         rollout: 0,   desc: "Tự động soạn hợp đồng bằng AI" },
];

export const DB_TABLES = [
  { name: "users",          rows: "24,812",  size: "18.2MB", indexes: 4 },
  { name: "listings",       rows: "9,340",   size: "42.1MB", indexes: 7 },
  { name: "contracts",      rows: "18,204",  size: "8.4MB",  indexes: 3 },
  { name: "payments",       rows: "142,920", size: "28.7MB", indexes: 5 },
  { name: "messages",       rows: "891,024", size: "310MB",  indexes: 4 },
  { name: "ai_sessions",    rows: "324,100", size: "124MB",  indexes: 3 },
  { name: "reviews",        rows: "8,204",   size: "5.1MB",  indexes: 2 },
  { name: "access_logs",    rows: "2.1M",    size: "820MB",  indexes: 4 },
];

export const DEPLOYS = [
  { id: "d-981", env: "production", branch: "main",    commit: "e4f8862", msg: "feat: manager & dev portals", status: "success", time: "30/04 09:12", by: "dev@nestaviet.vn", duration: "2m 18s" },
  { id: "d-980", env: "staging",    branch: "develop", commit: "3a1f204", msg: "fix: ternary syntax in KPI",  status: "success", time: "30/04 08:45", by: "dev@nestaviet.vn", duration: "1m 52s" },
  { id: "d-979", env: "production", branch: "main",    commit: "89cd712", msg: "feat: animations system",    status: "failed",  time: "29/04 18:30", by: "dev@nestaviet.vn", duration: "3m 05s" },
  { id: "d-978", env: "staging",    branch: "feat/ai", commit: "c92e031", msg: "feat: PriceEstimator",       status: "success", time: "29/04 15:20", by: "dev@nestaviet.vn", duration: "2m 01s" },
];

export const PERF_DATA = Array.from({ length: 20 }, (_, i) => ({
  t: `${i * 3}m`, cpu: 30 + Math.random() * 40, mem: 50 + Math.random() * 25, req: Math.round(100 + Math.random() * 200),
}));

export const methodColor: Record<string, string> = {
  GET: "text-emerald-400 bg-emerald-500/10", POST: "text-blue-400 bg-blue-500/10",
  PUT: "text-amber-400 bg-amber-500/10", DELETE: "text-red-400 bg-red-500/10",
  PATCH: "text-violet-400 bg-violet-500/10",
};

export const statusColor = (s: number) =>
  s < 300 ? "text-emerald-400" : s < 400 ? "text-blue-400" : s < 500 ? "text-amber-400" : "text-red-400";

export type DevTab = "overview" | "api_logs" | "agents" | "database" | "deploys" | "flags" | "errors" | "config";
