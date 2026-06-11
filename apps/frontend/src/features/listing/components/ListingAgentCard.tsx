import { useState, useRef, useEffect } from "react";
import { MessageCircle, Phone, Send, PhoneOff, Building2 } from "lucide-react";

interface ChatMessage {
  id: number;
  text: string;
  fromUser: boolean;
}

interface ListingAgentCardProps {
  agentName: string;
  agentRole: string;
  isOnline: boolean;
  listingCount: number;
  yearsActive: number;
  responseRate: number;
  phone?: string;
  quickReplies: string[];
}

const AUTO_REPLIES = [
  "Cảm ơn bạn đã liên hệ! Mình sẽ phản hồi sớm nhất 🙏",
  "Căn hộ hiện vẫn còn, bạn muốn đặt lịch xem không?",
  "Bạn có thể xem phòng vào cuối tuần này nhé!",
  "Mình có thể hỗ trợ thêm thông tin, bạn cần biết gì ạ?",
];

export function ListingAgentCard({
  agentName, agentRole, isOnline, listingCount, yearsActive, responseRate,
  phone, quickReplies,
}: ListingAgentCardProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [replyIndex, setReplyIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: Date.now(), text: trimmed, fromUser: true };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText("");

    const replyText = AUTO_REPLIES[replyIndex % AUTO_REPLIES.length];
    setReplyIndex(i => i + 1);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, text: replyText, fromUser: false }]);
    }, 900);
  };

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: "rgba(15,24,41,0.85)", backdropFilter: "blur(16px)" }}>

      {/* Agent header */}
      <div className="p-5 border-b border-white/8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.2),rgba(59,130,246,0.15))", border: "1px solid rgba(34,211,238,0.2)" }}>
            <span className="text-cyan-400 font-bold" style={{ fontSize: "1.1rem" }}>
              {agentName ? agentName[0].toUpperCase() : "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate" style={{ fontSize: "0.92rem" }}>{agentName || "—"}</p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="text-white/40" style={{ fontSize: "0.72rem" }}>{agentRole}</span>
              {isOnline && (
                <span className="flex items-center gap-1 text-emerald-400" style={{ fontSize: "0.68rem" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Đang hoạt động
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { val: listingCount > 0 ? `${listingCount}` : "—", label: "Tin đăng" },
            { val: yearsActive > 0 ? `${yearsActive} năm` : "—", label: "Kinh nghiệm" },
            { val: responseRate > 0 ? `${responseRate}%` : "—", label: "Phản hồi" },
          ].map(({ val, label }) => (
            <div key={label} className="py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-white font-semibold" style={{ fontSize: "0.85rem" }}>{val}</p>
              <p className="text-white/35" style={{ fontSize: "0.62rem" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mini chat panel */}
      {showChat && (
        <div className="border-b border-white/8">
          {/* Messages */}
          <div className="px-4 pt-3 pb-2 flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "10rem" }}>
            {chatMessages.length === 0 ? (
              <p className="text-center text-white/20 py-4" style={{ fontSize: "0.72rem" }}>
                Nhắn tin để bắt đầu cuộc trò chuyện
              </p>
            ) : (
              chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.fromUser ? "justify-end" : "justify-start"}`}>
                  {!msg.fromUser && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 self-end"
                      style={{ background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.2)" }}>
                      <span className="text-cyan-400 font-bold" style={{ fontSize: "0.6rem" }}>
                        {agentName[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="max-w-[75%] px-3 py-2 rounded-2xl"
                    style={{
                      fontSize: "0.78rem",
                      lineHeight: 1.5,
                      background: msg.fromUser
                        ? "linear-gradient(135deg,#22d3ee,#3b82f6)"
                        : "rgba(255,255,255,0.06)",
                      color: msg.fromUser ? "#fff" : "rgba(255,255,255,0.7)",
                      borderRadius: msg.fromUser ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                    }}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <div className="px-3 pb-3 flex gap-2">
            <input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(inputText); }}
              placeholder="Nhắn hỏi thông tin..."
              className="flex-1 rounded-xl px-3 py-2 text-white placeholder-white/25 outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.78rem" }}
            />
            <button onClick={() => sendMessage(inputText)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-cyan-400 hover:bg-cyan-400/10 transition-colors flex-shrink-0"
              style={{ border: "1px solid rgba(34,211,238,0.2)" }}>
              <Send size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 border-b border-white/8">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowChat(p => !p)}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${showChat ? "border-cyan-400/30 text-cyan-400 bg-cyan-400/8" : "border-white/10 text-white/70 hover:text-white hover:bg-white/5"}`}
            style={{ fontSize: "0.83rem" }}>
            <MessageCircle size={15} />{showChat ? "Đóng chat" : "Chat"}
          </button>
          <button
            onClick={() => setShowPhone(p => !p)}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ fontSize: "0.83rem", background: "linear-gradient(135deg,#22d3ee,#3b82f6)" }}>
            {showPhone
              ? <><PhoneOff size={14} />{phone ?? "—"}</>
              : <><Phone size={14} />Hiện số</>
            }
          </button>
        </div>
      </div>

      {/* Quick replies */}
      {quickReplies.length > 0 && (
        <div className="p-3 flex gap-2 overflow-x-auto">
          {quickReplies.map(r => (
            <button key={r}
              onClick={() => { setShowChat(true); setInputText(r); }}
              className="flex-shrink-0 px-3 py-1.5 rounded-full border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all whitespace-nowrap"
              style={{ fontSize: "0.72rem" }}>
              {r}
            </button>
          ))}
        </div>
      )}

      {/* NestaVietAI branding */}
      <div className="flex items-center justify-center gap-2 py-2.5 border-t border-white/6">
        <div className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#3b82f6,#22d3ee)", boxShadow: "0 0 8px rgba(34,211,238,0.2)" }}>
          <Building2 size={11} className="text-white" />
        </div>
        <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>
          Nền tảng <span className="font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>NestaViet</span><span style={{ color: "#22d3ee", fontWeight: 600 }}>AI</span>
        </span>
      </div>
    </div>
  );
}
