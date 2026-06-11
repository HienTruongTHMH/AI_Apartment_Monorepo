// ============================================================
// Agent Registry — Mobile
// Import tất cả 4 agents từ đây thay vì import riêng lẻ
// ============================================================

export { superBrokerConfig,    superBrokerQuickPrompts,    superBrokerGreeting,    superBrokerReply    } from "./superBroker";
export { smartConciergeConfig, smartConciergeQuickPrompts, smartConciergeGreeting, smartConciergeReply } from "./smartConcierge";
export { contractAdminConfig,  contractAdminQuickPrompts,  contractAdminGreeting,  contractAdminReply  } from "./contractAdmin";
export { listingVerifierConfig, listingVerifierQuickPrompts, listingVerifierGreeting, listingVerifierReply } from "./listingVerifier";

import { superBrokerConfig,    superBrokerQuickPrompts,    superBrokerGreeting,    superBrokerReply    } from "./superBroker";
import { smartConciergeConfig, smartConciergeQuickPrompts, smartConciergeGreeting, smartConciergeReply } from "./smartConcierge";
import { contractAdminConfig,  contractAdminQuickPrompts,  contractAdminGreeting,  contractAdminReply  } from "./contractAdmin";
import { listingVerifierConfig, listingVerifierQuickPrompts, listingVerifierGreeting, listingVerifierReply } from "./listingVerifier";

export type AgentId = "broker" | "concierge" | "contract" | "verifier";

export const AGENTS = [
  superBrokerConfig,
  smartConciergeConfig,
  contractAdminConfig,
  listingVerifierConfig,
] as const;

export const AGENT_QUICK_PROMPTS: Record<AgentId, string[]> = {
  broker:    superBrokerQuickPrompts,
  concierge: smartConciergeQuickPrompts,
  contract:  contractAdminQuickPrompts,
  verifier:  listingVerifierQuickPrompts,
};

export const AGENT_GREETINGS: Record<AgentId, string> = {
  broker:    superBrokerGreeting,
  concierge: smartConciergeGreeting,
  contract:  contractAdminGreeting,
  verifier:  listingVerifierGreeting,
};

// ─── Unified reply dispatcher ─────────────────────────────────
// TODO (team): Khi chuyển sang async API, đổi thành:
//   export async function agentReply(agentId: AgentId, message: string, sessionId: string): Promise<string>
export function agentReply(agentId: AgentId, message: string): string {
  switch (agentId) {
    case "broker":    return superBrokerReply(message);
    case "concierge": return smartConciergeReply(message);
    case "contract":  return contractAdminReply(message);
    case "verifier":  return listingVerifierReply(message);
  }
}
