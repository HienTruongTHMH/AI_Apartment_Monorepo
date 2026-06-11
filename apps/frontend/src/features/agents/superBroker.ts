// ============================================================
// Agent 2 — Super Broker AI (Web)
// Nhiệm vụ: Tìm kiếm & Tư vấn thuê nhà bằng RAG + Semantic
// Giai đoạn: Lead Generation
// ============================================================
// TODO (team): Thay mock bằng gọi API thực:
//   POST /api/agents/super-broker/chat
//   Body: { message: string; sessionId: string; userId: string }
//   Response: {
//     reply: string;
//     listings?: ListingCard[];
//     calendarSlots?: CalendarSlot[];
//     intent?: "search" | "schedule" | "compare" | "general";
//   }
// ============================================================

export interface SuperBrokerMessage {
  role: "user" | "agent";
  type: "text" | "cards" | "map";
  content?: string;
  cards?: ApartmentCard[];
}

export interface ApartmentCard {
  id: string;
  name: string;
  price: string;
  area: string;
  district: string;
  tags: string[];
  rating: number;
  verified: boolean;
  image?: string;
}

export interface CalendarSlot {
  date: string;
  time: string;
  landlordId: string;
  listingId: string;
}

// ─── Mock data (thay bằng data thực từ API) ─────────────────
export const MOCK_APARTMENTS: ApartmentCard[] = [
  { id: "a1", name: "Sunrise City North", price: "11.5tr/tháng", area: "45m²", district: "Quận 7",       tags: ["Hồ bơi", "Pet-friendly", "Gym"],      rating: 4.8, verified: true  },
  { id: "a2", name: "The Manor",           price: "9.8tr/tháng",  area: "38m²", district: "Bình Thạnh",  tags: ["Full nội thất", "View sông", "An ninh"], rating: 4.6, verified: true  },
  { id: "a3", name: "Vinhomes Tân Cảng",   price: "8.2tr/tháng",  area: "32m²", district: "Bình Thạnh",  tags: ["Metro gần", "Siêu thị", "Công viên"],  rating: 4.5, verified: false },
];

// ─── Mock reply function (xoá khi có API thực) ──────────────
// TODO (team): export async function superBrokerChat(message: string, sessionId: string): Promise<SuperBrokerMessage[]>
export function superBrokerMockReply(message: string): SuperBrokerMessage[] {
  const m = message.toLowerCase();

  if (m.includes("tìm") || m.includes("cần") || m.includes("muốn") || m.length > 10) {
    return [
      { role: "agent", type: "text",  content: "Tuyệt! Dựa trên yêu cầu của bạn, tôi tìm được **3 căn hộ phù hợp**:" },
      { role: "agent", type: "cards", cards: MOCK_APARTMENTS },
      { role: "agent", type: "map"   },
      { role: "agent", type: "text",  content: "💡 **Gợi ý hàng đầu:** Sunrise City North (Q.7) — cách Q.1 18 phút, hồ bơi, pet-friendly, 11.5tr/tháng.\n\nBạn có muốn đặt lịch xem không?" },
    ];
  }

  return [
    { role: "agent", type: "text", content: "Tôi cần thêm thông tin để tìm căn phù hợp nhất:\n• 📍 Khu vực mong muốn?\n• 💰 Ngân sách tối đa?\n• 🏠 Số phòng ngủ cần thiết?" },
  ];
}
