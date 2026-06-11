import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Send, Loader2, RotateCcw, ChevronLeft } from "lucide-react";

const SYSTEM_PROMPT = `Bạn là AI Super Broker của NestaVietAI — nền tảng cho thuê căn hộ thông minh tại Việt Nam.

Nhiệm vụ:
- Giúp khách hàng tìm kiếm căn hộ phù hợp nhu cầu
- Tư vấn về giá thuê, địa điểm, tiện ích
- Giải đáp thắc mắc về quy trình thuê, ký hợp đồng
- Hướng dẫn đăng ký xem nhà

Thông tin nền tảng:
- 12,400+ căn hộ đã kiểm duyệt bởi AI
- Hoạt động tại TP.HCM, Hà Nội, Đà Nẵng, Cần Thơ
- Hợp đồng điện tử & thanh toán online tích hợp

Khi khách tìm nhà, hỏi thêm: khu vực, ngân sách/tháng, số phòng ngủ, tiện ích ưu tiên.
Luôn gợi ý khách đăng ký tài khoản hoặc xem danh sách căn hộ trên nền tảng.
Trả lời ngắn gọn, thân thiện, bằng tiếng Việt.`;

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const CATEGORIES = [
  {
    id: "find",
    label: "🏠 Tìm nhà",
    gradient: "from-cyan-500 to-blue-500",
    prompts: [
      "Tìm căn 2PN gần Q.1 dưới 15 triệu",
      "Chung cư có bể bơi Q.7",
      "Phòng studio trung tâm dưới 10 triệu",
    ],
  },
  {
    id: "price",
    label: "💰 Hỏi giá",
    gradient: "from-emerald-500 to-teal-500",
    prompts: [
      "Giá thuê trung bình Q.Bình Thạnh?",
      "Phí dịch vụ tính như thế nào?",
      "Tiền cọc thường bao nhiêu tháng?",
    ],
  },
  {
    id: "schedule",
    label: "📅 Đặt lịch",
    gradient: "from-violet-500 to-purple-500",
    prompts: [
      "Muốn xem nhà cuối tuần này",
      "Đặt lịch xem Vinhomes Grand Park",
      "Có thể xem nhà online không?",
    ],
  },
  {
    id: "support",
    label: "🛠️ Hỗ trợ",
    gradient: "from-orange-500 to-amber-400",
    prompts: [
      "Quy trình ký hợp đồng thế nào?",
      "Thanh toán online như thế nào?",
      "Tôi cần báo cáo sự cố",
    ],
  },
];

export function ChatWidget({ trigger }: { trigger?: { query: string; id: number } }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Xin chào! Tôi là AI Super Broker của NestaVietAI 🏠\n\nBạn đang tìm kiếm loại căn hộ nào? Hãy cho tôi biết khu vực và ngân sách để tôi tư vấn phù hợp nhé!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [autoSend, setAutoSend] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (trigger?.query) {
      setAutoSend(trigger.query);
      setOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger?.id]);

  useEffect(() => {
    if (open && autoSend) {
      const q = autoSend;
      setAutoSend(null);
      setTimeout(() => sendMessage(q), 400);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoSend]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const msgs = [...messages, userMsg];
    setMessages([...msgs, { role: "assistant", content: "", streaming: true }]);
    setInput("");
    setActiveCategory(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 512,
          stream: true,
          system: SYSTEM_PROMPT,
          messages: msgs.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === "[DONE]") continue;
          try {
            const evt = JSON.parse(raw);
            if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
              accumulated += evt.delta.text;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: accumulated, streaming: true };
                return next;
              });
            }
          } catch {}
        }
      }

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: accumulated };
        return next;
      });
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content:
            "Xin lỗi, đã có lỗi kết nối. Vui lòng thêm ANTHROPIC_API_KEY vào file `.env` và khởi động lại dev server.",
        };
        return next;
      });
    }

    setLoading(false);
  };

  const reset = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Xin chào! Tôi là AI Super Broker của NestaVietAI 🏠\n\nBạn đang tìm kiếm loại căn hộ nào?",
      },
    ]);
    setActiveCategory(null);
  };

  const showCategories = messages.length === 1 && !loading;
  const selectedCat = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <>
      {/* Floating pill button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pl-3 pr-5 py-2.5 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
              boxShadow: "0 8px 32px rgba(6,182,212,0.45), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bot size={18} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold leading-tight" style={{ fontSize: "0.82rem" }}>
                AI Super Broker
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <p className="text-white/70 leading-tight" style={{ fontSize: "0.61rem" }}>
                  Đang hoạt động · Hỏi ngay
                </p>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] flex flex-col border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
            style={{
              background: "#0D1525",
              height: "min(560px, calc(100vh - 5rem))",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-white/10 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.12) 0%, #0A0F1E 60%)" }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
                <Bot size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold" style={{ fontSize: "0.875rem" }}>
                  AI Super Broker
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400" style={{ fontSize: "0.7rem" }}>
                    Online · Phản hồi tức thì
                  </span>
                </div>
              </div>
              <button
                onClick={reset}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
                title="Cuộc hội thoại mới"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-dark">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot size={13} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3 py-2 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-tr-sm"
                        : "bg-white/8 text-white/85 rounded-tl-sm"
                    }`}
                    style={{ fontSize: "0.82rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}
                  >
                    {msg.content}
                    {msg.streaming && (
                      <span className="inline-block w-1 h-3.5 bg-cyan-400 animate-pulse ml-0.5 align-middle rounded-sm" />
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Multi-task categories */}
            {showCategories && (
              <div className="px-4 pb-3 flex-shrink-0">
                {!activeCategory ? (
                  <>
                    <p
                      className="text-white/30 mb-2.5"
                      style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.1em" }}
                    >
                      TÔI CÓ THỂ GIÚP GÌ?
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {CATEGORIES.map((cat) => (
                        <motion.button
                          key={cat.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`flex items-center justify-center px-3 py-2.5 rounded-xl bg-gradient-to-br ${cat.gradient} text-white font-semibold`}
                          style={{ fontSize: "0.78rem" }}
                        >
                          {cat.label}
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2.5">
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors"
                        style={{ fontSize: "0.7rem" }}
                      >
                        <ChevronLeft size={13} />
                        Quay lại
                      </button>
                      <span className="text-white/20">·</span>
                      <span className="text-white/50" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                        {selectedCat?.label}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {selectedCat?.prompts.map((p) => (
                        <button
                          key={p}
                          onClick={() => sendMessage(p)}
                          className="text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-white/60 hover:text-white/80 transition-all"
                          style={{ fontSize: "0.78rem" }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-white/8 flex-shrink-0">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Nhập câu hỏi..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  className="flex-1 bg-transparent text-white placeholder-white/30 outline-none"
                  style={{ fontSize: "0.85rem" }}
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center disabled:opacity-30 transition-opacity flex-shrink-0"
                >
                  {loading ? (
                    <Loader2 size={13} className="text-white animate-spin" />
                  ) : (
                    <Send size={13} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
