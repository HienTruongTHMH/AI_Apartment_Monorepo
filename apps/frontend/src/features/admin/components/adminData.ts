import { Shield, Bot, Zap, Database } from "lucide-react";

export const AGENT_NODES = [
  { id: "a1", name: "Listing Verifier",  status: "online",  load: 34, requests: 1240, errors: 2,  latency: 120, color: "#3b82f6", icon: Shield,   desc: "Python • LangChain • Image CV",     metrics: [45,60,55,70,34,40,38,34] },
  { id: "a2", name: "Super Broker",      status: "online",  load: 78, requests: 8430, errors: 5,  latency: 380, color: "#10b981", icon: Bot,      desc: "Python • RAG • pgvector",           metrics: [60,70,80,75,78,82,80,78] },
  { id: "a3", name: "Smart Concierge",   status: "warning", load: 91, requests: 3200, errors: 18, latency: 245, color: "#f59e0b", icon: Zap,      desc: "Python • LangGraph • Scheduler",    metrics: [70,75,85,90,91,88,92,91] },
  { id: "a4", name: "Contract & Admin",  status: "online",  load: 22, requests: 980,  errors: 0,  latency: 95,  color: "#8b5cf6", icon: Database, desc: "Python • Rust API • QR Gen",        metrics: [30,25,28,22,20,24,22,22] },
];

export const SYSTEM_NODES = [
  { id: "rust-api", name: "Rust API Gateway",       status: "online",  type: "Backend",  load: 45, version: "v2.4.1"  },
  { id: "py-core",  name: "Python AI Core",          status: "online",  type: "AI Engine",load: 67, version: "v1.8.3"  },
  { id: "pg-db",    name: "PostgreSQL + pgvector",   status: "online",  type: "Database", load: 38, version: "16.2"    },
  { id: "redis",    name: "Redis Cache",             status: "online",  type: "Cache",    load: 12, version: "7.2"     },
  { id: "minio",    name: "MinIO Object Storage",    status: "warning", type: "Storage",  load: 88, version: "2024-Q1" },
  { id: "nginx",    name: "Nginx Load Balancer",     status: "online",  type: "Proxy",    load: 23, version: "1.25"    },
];

export const API_LOGS = [
  { id: "L001", time: "10:42:18", method: "POST",   path: "/api/v2/agents/broker/chat",         status: 200, latency: "382ms", user: "tenant_2841"  },
  { id: "L002", time: "10:42:15", method: "GET",    path: "/api/v2/properties/list",            status: 200, latency: "95ms",  user: "tenant_1092"  },
  { id: "L003", time: "10:42:12", method: "POST",   path: "/api/v2/listings/verify",            status: 200, latency: "1.2s",  user: "landlord_441" },
  { id: "L004", time: "10:42:10", method: "POST",   path: "/api/v2/invoices/generate",          status: 200, latency: "210ms", user: "system"       },
  { id: "L005", time: "10:42:08", method: "GET",    path: "/api/v2/maintenance/tickets",        status: 200, latency: "88ms",  user: "tenant_5521"  },
  { id: "L006", time: "10:42:05", method: "POST",   path: "/api/v2/agents/concierge/assign",    status: 503, latency: "5.1s",  user: "system"       },
  { id: "L007", time: "10:41:55", method: "DELETE", path: "/api/v2/listings/L-2199",            status: 204, latency: "45ms",  user: "admin_1"      },
  { id: "L008", time: "10:41:48", method: "PUT",    path: "/api/v2/users/tenant_2841/contract", status: 200, latency: "178ms", user: "landlord_441" },
];

export const USERS_DATA = [
  { id: "U1001", name: "Nguyễn Văn An",   email: "van.an@email.com",    role: "tenant",   status: "active",    joined: "12/01/2025", unit: "SC-1204" },
  { id: "U1002", name: "Trần Minh Khoa",  email: "khoa.tran@biz.vn",    role: "landlord", status: "active",    joined: "05/12/2024", unit: "Owner"   },
  { id: "U1003", name: "Lê Thị Hương",    email: "huong.le@gmail.com",  role: "tenant",   status: "active",    joined: "20/02/2025", unit: "VGP-803" },
  { id: "U1004", name: "Phạm Đức Huy",    email: "huy.pham@company.vn", role: "landlord", status: "suspended", joined: "10/11/2024", unit: "Owner"   },
  { id: "U1005", name: "Võ Thị Kim Ngân", email: "ngan.vo@email.com",   role: "tenant",   status: "active",    joined: "01/03/2025", unit: "TR-1502" },
  { id: "U1006", name: "Đỗ Quang Minh",   email: "minh.do@startup.io",  role: "admin",    status: "active",    joined: "01/01/2024", unit: "—"       },
];

export const TRAFFIC_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  requests: [420,310,220,180,160,200,380,560,720,840,920,880,950,910,870,820,780,730,650,590,520,470,440,400][i],
  errors:   [3,2,1,1,1,2,4,6,8,9,10,8,11,9,8,7,6,5,4,3,3,2,2,2][i],
}));

export const MGR_LISTINGS = [
  { id: "BDS-001", name: "Vinhomes Grand Park",  district: "TP. Thủ Đức", units: 24, occupied: 22, rent: 10500000, status: "active", type: "Chung cư cao cấp"   },
  { id: "BDS-002", name: "Masteri Centre Point", district: "TP. Thủ Đức", units: 16, occupied: 14, rent: 17000000, status: "active", type: "Căn hộ hạng sang"   },
  { id: "BDS-003", name: "The Estella Heights",  district: "TP.HCM",      units: 8,  occupied: 7,  rent: 26000000, status: "active", type: "Penthouse / Duplex"  },
  { id: "BDS-004", name: "Eco Green Saigon",     district: "TP.HCM",      units: 32, occupied: 28, rent: 9000000,  status: "review", type: "Chung cư trung cấp" },
  { id: "BDS-005", name: "Tropic Garden",        district: "TP. Thủ Đức", units: 12, occupied: 9,  rent: 13500000, status: "active", type: "Biệt thự / Nhà phố" },
];

export const MGR_CONTRACTS = [
  { id: "HD-2025-001", tenant: "Nguyễn Văn An",   unit: "VGP-SC-1204", start: "01/01/2025", end: "31/12/2025", rent: 10500000, status: "active",  paid: true  },
  { id: "HD-2025-002", tenant: "Lê Thị Hương",    unit: "VGP-803",     start: "01/02/2025", end: "31/01/2026", rent: 10500000, status: "active",  paid: true  },
  { id: "HD-2025-003", tenant: "Võ Thị Kim Ngân", unit: "TR-1502",     start: "15/03/2025", end: "14/03/2026", rent: 13500000, status: "active",  paid: false },
  { id: "HD-2024-018", tenant: "Bùi Thanh Tùng",  unit: "MCP-401",     start: "01/06/2024", end: "31/05/2025", rent: 17000000, status: "expired", paid: true  },
  { id: "HD-2025-004", tenant: "Hoàng Thị Mai",   unit: "EH-PH-02",    start: "01/04/2025", end: "31/03/2026", rent: 26000000, status: "pending", paid: false },
];

export const MGR_REVENUE = [
  { month: "T10", revenue: 284, target: 300 }, { month: "T11", revenue: 312, target: 310 },
  { month: "T12", revenue: 298, target: 310 }, { month: "T1",  revenue: 325, target: 320 },
  { month: "T2",  revenue: 341, target: 330 }, { month: "T3",  revenue: 368, target: 350 },
  { month: "T4",  revenue: 392, target: 370 },
];

export const DEPLOY_HISTORY = [
  { id: "dep-081", env: "Production", branch: "main",        commit: "a3f19c2", by: "CI/CD",     time: "10:15",   status: "success", duration: "3m 42s" },
  { id: "dep-080", env: "Staging",    branch: "feat/search", commit: "7bc0d41", by: "dev@nv.vn", time: "09:52",   status: "success", duration: "2m 18s" },
  { id: "dep-079", env: "Production", branch: "main",        commit: "e2a84f0", by: "CI/CD",     time: "Hôm qua", status: "failed",  duration: "1m 05s" },
  { id: "dep-078", env: "Staging",    branch: "fix/auth",    commit: "c91b3d8", by: "dev@nv.vn", time: "Hôm qua", status: "success", duration: "2m 55s" },
  { id: "dep-077", env: "Production", branch: "main",        commit: "d55a210", by: "CI/CD",     time: "2 ngày",  status: "success", duration: "4m 01s" },
];

export const DEV_PKGS = [
  { name: "React",       version: "19.1.0",  ok: true },
  { name: "TypeScript",  version: "5.8.3",   ok: true },
  { name: "Vite",        version: "6.4.2",   ok: true },
  { name: "motion/react",version: "12.x",    ok: true },
  { name: "recharts",    version: "2.15.3",  ok: true },
  { name: "Tailwind CSS",version: "4.x",     ok: true },
];
