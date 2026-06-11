import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Bot, Send, MapPin, Heart, Star, Calendar } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  type: "text" | "cards" | "map";
  content?: string;
  cards?: ApartmentCard[];
}

interface ApartmentCard {
  id: string;
  name: string;
  address: string;
  price: string;
  area: string;
  rooms: string;
  rating: number;
  tags: string[];
  img: string;
  distance: string;
}

const MOCK_APARTMENTS: ApartmentCard[] = [
  {
    id: "a1", name: "Sunrise City North", address: "Quận 7, TP.HCM", price: "11.5M/tháng",
    area: "65m²", rooms: "2PN - 2WC", rating: 4.8,
    tags: ["Cách Q1 18p", "Pet-friendly", "Hồ bơi"],
    img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=400", distance: "3.2km từ Q1"
  },
  {
    id: "a2", name: "Vinhomes Grand Park", address: "TP. Thủ Đức, TP.HCM", price: "9.8M/tháng",
    area: "58m²", rooms: "2PN - 1WC", rating: 4.6,
    tags: ["Cách Q1 25p", "Gym", "An ninh 24/7"],
    img: "https://images.unsplash.com/photo-1585128792103-0b591f96512e?w=400", distance: "8.1km từ Q1"
  },
  {
    id: "a3", name: "The River Thủ Thiêm", address: "Quận 2, TP.HCM", price: "14.2M/tháng",
    area: "72m²", rooms: "2PN - 2WC", rating: 4.9,
    tags: ["View sông", "Trung tâm", "Nội thất cao cấp"],
    img: "https://images.unsplash.com/photo-1763401929055-43fd29000be3?w=400", distance: "1.5km từ Q1"
  },
];

const QUICK_PROMPTS = [
  "2PN gần Q1 dưới 12M", "Studio cho 1 người", "Có hồ bơi, pet-friendly", "Gần trường học Q3",
];

function ApartmentCarousel({ cards }: { cards: ApartmentCard[] }) {
  const [liked, setLiked] = useState<Set<string>>(new Set());
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {cards.map((card) => (
        <motion.div key={card.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="flex-shrink-0 w-56 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 cursor-pointer">
          <div className="relative h-32">
            <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
            <button onClick={(e) => { e.stopPropagation(); setLiked((prev) => { const next = new Set(prev); next.has(card.id) ? next.delete(card.id) : next.add(card.id); return next; }); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow">
              <Heart size={12} className={liked.has(card.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
          </div>
          <div className="p-3">
            <p className="text-gray-900 font-bold truncate" style={{ fontSize: "0.8rem" }}>{card.name}</p>
            <p className="text-gray-500 flex items-center gap-1 mb-2" style={{ fontSize: "0.68rem" }}><MapPin size={9} />{card.address}</p>
            <div className="flex justify-between items-center">
              <span className="text-emerald-600 font-bold" style={{ fontSize: "0.82rem" }}>{card.price}</span>
              <button className="bg-emerald-500 text-white px-2 py-1 rounded-lg" style={{ fontSize: "0.65rem", fontWeight: 600 }}>Đặt xem</button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MapPreview() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 h-36 relative bg-gradient-to-br from-slate-100 to-slate-200">
      <svg width="100%" height="100%" viewBox="0 0 300 144" className="opacity-60">
        <rect width="300" height="144" fill="#e8f0fe" />
        <line x1="0" y1="72" x2="300" y2="72" stroke="#c5d0e8" strokeWidth="12" />
        <line x1="150" y1="0" x2="150" y2="144" stroke="#c5d0e8" strokeWidth="8" />
        <line x1="0" y1="36" x2="300" y2="36" stroke="#d4dff0" strokeWidth="4" />
        <line x1="0" y1="108" x2="300" y2="108" stroke="#d4dff0" strokeWidth="4" />
        <rect x="30" y="18" width="40" height="25" rx="4" fill="#cbd5e1" />
        <rect x="200" y="45" width="60" height="35" rx="4" fill="#cbd5e1" />
        <rect x="80" y="85" width="50" height="30" rx="4" fill="#cbd5e1" />
        <circle cx="120" cy="63" r="11" fill="#10b981" opacity="0.9" /><circle cx="120" cy="63" r="4" fill="white" />
        <circle cx="185" cy="90" r="11" fill="#10b981" opacity="0.9" /><circle cx="185" cy="90" r="4" fill="white" />
        <circle cx="60" cy="100" r="11" fill="#10b981" opacity="0.9" /><circle cx="60" cy="100" r="4" fill="white" />
      </svg>
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full shadow text-gray-700" style={{ fontSize: "0.68rem", fontWeight: 600 }}>
        📍 3 căn hộ phù hợp
      </div>
    </div>
  );
}

export default function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "agent", type: "text", content: "Xin chào! Tôi là **Super Broker AI** 🤖\n\nTôi có thể giúp bạn tìm căn hộ phù hợp nhất. Hãy cho tôi biết:\n- 📍 Khu vực bạn muốn ở?\n- 💰 Ngân sách hàng tháng?\n- 🏠 Cần mấy phòng ngủ?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", type: "text", content: msg }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses: ChatMessage[] = [
        { id: (Date.now() + 1).toString(), role: "agent", type: "text", content: "Tuyệt! Dựa trên yêu cầu của bạn, tôi đã tìm được **3 căn hộ phù hợp**. Đây là kết quả:" },
        { id: (Date.now() + 2).toString(), role: "agent", type: "cards", cards: MOCK_APARTMENTS.slice(0, 3) },
        { id: (Date.now() + 3).toString(), role: "agent", type: "map" },
        { id: (Date.now() + 4).toString(), role: "agent", type: "text", content: "💡 **Gợi ý:** Sunrise City North (Quận 7) rất phù hợp — cách Q1 18 phút, có hồ bơi, pet-friendly, giá 11.5M/tháng.\n\nBạn có muốn đặt lịch xem không?" },
      ];
      let delay = 0;
      responses.forEach((r) => { delay += 700; setTimeout(() => { setMessages((prev) => [...prev, r]); }, delay); });
    }, 1400);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Agent header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow">
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <p className="text-gray-900 font-bold" style={{ fontSize: "0.95rem" }}>Super Broker AI</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-emerald-600" style={{ fontSize: "0.72rem" }}>Đang hoạt động • Powered by RAG + Agent SDK</p>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {QUICK_PROMPTS.slice(0, 2).map((p) => (
            <button key={p} onClick={() => sendMessage(p)}
              className="px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors hidden lg:block"
              style={{ fontSize: "0.72rem" }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-1">
        {messages.map((msg) => (
          msg.role === "user" ? (
            <motion.div key={msg.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex justify-end mb-3">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-md shadow-sm" style={{ fontSize: "0.875rem" }}>
                {msg.content}
              </div>
            </motion.div>
          ) : (
            <motion.div key={msg.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-white" />
              </div>
              <div className="flex-1 max-w-2xl">
                {msg.type === "text" && (
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm" style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.7 }}>
                    {msg.content?.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-1" : ""}>{line.split("**").map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}</p>
                    ))}
                  </div>
                )}
                {msg.type === "cards" && msg.cards && <div className="mt-1"><ApartmentCarousel cards={msg.cards} /></div>}
                {msg.type === "map" && <div className="mt-1"><MapPreview /></div>}
              </div>
            </motion.div>
          )
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts + input */}
      <div className="bg-white border-t border-gray-100">
        <div className="px-6 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {QUICK_PROMPTS.map((p) => (
            <button key={p} onClick={() => sendMessage(p)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              style={{ fontSize: "0.72rem" }}>{p}</button>
          ))}
        </div>
        <div className="px-6 pb-5 pt-2">
          <div className="flex items-end gap-3 bg-gray-100 rounded-2xl px-4 py-3">
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Nhập yêu cầu tìm nhà... (Enter để gửi)"
              className="flex-1 bg-transparent resize-none outline-none text-gray-800 placeholder-gray-400"
              style={{ fontSize: "0.875rem", maxHeight: "100px", minHeight: "20px" }} rows={1} />
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => sendMessage()}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow flex-shrink-0">
              <Send size={16} className="text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
