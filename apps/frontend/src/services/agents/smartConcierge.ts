// ============================================================
// Agent 3 — Smart Concierge (Web)
// Nhiệm vụ: Vận hành & Điều phối SLA sự cố 24/7
// Giai đoạn: Tenant Care — Hậu mãi & Lưu trú
// ============================================================
// TODO (team): Thay mock bằng gọi API thực:
//
//   POST /api/agents/smart-concierge/ticket
//   Body: { title: string; description: string; unitId: string; images?: string[] }
//   Response: { ticketId: string; priority: Priority; assignee: Staff; eta: string }
//
//   GET  /api/agents/smart-concierge/tickets/:userId
//   Response: { tickets: Ticket[] }
//
//   PATCH /api/agents/smart-concierge/tickets/:ticketId
//   Body: { status: TicketStatus }
// ============================================================

export type Priority     = "urgent" | "high" | "medium" | "low";
export type TicketStatus = "pending" | "in_progress" | "resolved" | "closed";

export interface Ticket {
  id:          string;
  title:       string;
  description: string;
  priority:    Priority;
  status:      TicketStatus;
  assignee?:   string;
  eta?:        string;
  createdAt:   string;
  updatedAt:   string;
  agent:       "Smart Concierge";
}

export interface Staff {
  id:   string;
  name: string;
  role: string;
  phone?: string;
}

// ─── Mock data (thay bằng data thực từ API) ─────────────────
export const MOCK_TICKETS: Ticket[] = [
  { id: "T001", title: "Máy lạnh không hoạt động",    description: "Máy lạnh phòng 12A không mát",     priority: "high",   status: "in_progress", assignee: "Nguyễn Văn A", eta: "2h nữa",    createdAt: "2025-04-20", updatedAt: "2025-04-20", agent: "Smart Concierge" },
  { id: "T002", title: "Bóng đèn hành lang hỏng",     description: "Tầng 5 hành lang tối",             priority: "low",    status: "resolved",    assignee: "Trần Văn B",   eta: "Đã xong",   createdAt: "2025-04-15", updatedAt: "2025-04-16", agent: "Smart Concierge" },
  { id: "T003", title: "Vòi nước rò rỉ phòng tắm",   description: "Vòi nước bồn rửa mặt bị rỉ",     priority: "medium", status: "pending",     assignee: undefined,      eta: "8h nữa",    createdAt: "2025-04-22", updatedAt: "2025-04-22", agent: "Smart Concierge" },
];

export const PRIORITY_SLA: Record<Priority, string> = {
  urgent: "1 giờ",
  high:   "4 giờ",
  medium: "8 giờ",
  low:    "24 giờ",
};

// ─── Triage helper (xoá khi có AI backend thực) ─────────────
// TODO (team): Logic này sẽ chạy ở backend — model NLP phân loại priority
export function triagePriority(description: string): Priority {
  const d = description.toLowerCase();
  if (d.includes("cháy") || d.includes("điện giật") || d.includes("vỡ ống") || d.includes("ngập")) return "urgent";
  if (d.includes("thang máy") || d.includes("khóa cửa") || d.includes("máy lạnh"))                 return "high";
  if (d.includes("vòi") || d.includes("rò rỉ") || d.includes("ẩm") || d.includes("mốc"))           return "medium";
  return "low";
}
