// ============================================================
// Agent Registry — Web
// Import tất cả 4 agents từ đây thay vì import riêng lẻ
// ============================================================

export * from "./listingVerifier";
export * from "./superBroker";
export * from "./smartConcierge";
export * from "./contractAdmin";

// Agent metadata — dùng để render AgentsTab trong LandlordApp
export const AGENT_REGISTRY = [
  {
    id:    "listing-verifier",
    name:  "Listing Verifier",
    icon:  "🔍",
    color: "#F59E0B",
    desc:  "Kiểm duyệt tin đăng bằng NLP & Vision AI",
    stage: "Onboarding tài sản",
    model: "Gemini 2.5-Flash",
    file:  "src/services/agents/listingVerifier.ts",
  },
  {
    id:    "super-broker",
    name:  "Super Broker AI",
    icon:  "🤖",
    color: "#22D3EE",
    desc:  "Tư vấn tìm nhà bằng RAG + Semantic Search",
    stage: "Lead Generation",
    model: "GPT-4o + Embeddings",
    file:  "src/services/agents/superBroker.ts",
  },
  {
    id:    "smart-concierge",
    name:  "Smart Concierge",
    icon:  "🛠️",
    color: "#34D399",
    desc:  "Xử lý sự cố & ticket vận hành 24/7",
    stage: "Tenant Care",
    model: "LangGraph Workflow",
    file:  "src/services/agents/smartConcierge.ts",
  },
  {
    id:    "contract-admin",
    name:  "Contract & Admin",
    icon:  "📋",
    color: "#A78BFA",
    desc:  "Quản lý HĐ, hóa đơn, VietQR & dunning",
    stage: "Billing & Operations",
    model: "Rule Engine + Webhook",
    file:  "src/services/agents/contractAdmin.ts",
  },
] as const;

export type WebAgentId = typeof AGENT_REGISTRY[number]["id"];
