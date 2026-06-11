import { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import type { Message } from "../ChatPage";
import ChatQuickPrompts from "./ChatQuickPrompts";

interface ChatMessageListProps {
  messages: Message[];
  typing: boolean;
  onPrompt: (text: string) => void;
}

export default function ChatMessageList({ messages, typing, onPrompt }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (messages.length === 0 && !typing) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center px-6 overflow-y-auto">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg,#22d3ee22,#3b82f622)", border: "1px solid rgba(34,211,238,0.2)" }}
        >
          <Bot size={26} className="text-cyan-400" />
        </div>
        <h2 className="text-white font-bold mb-1" style={{ fontSize: "1.1rem" }}>
          Xin chào! Tôi là AI Super Broker
        </h2>
        <p className="text-white/40 mb-6 text-center" style={{ fontSize: "0.85rem" }}>
          Hỏi tôi bất cứ điều gì về bất động sản
        </p>
        <ChatQuickPrompts onPrompt={onPrompt} />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto gap-4 px-6 py-6">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "ai" && (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.2)" }}
            >
              <Bot size={14} className="text-cyan-400" />
            </div>
          )}
          <div
            className="max-w-[75%] rounded-2xl px-4 py-3"
            style={
              msg.role === "user"
                ? {
                    background: "linear-gradient(135deg,#22d3ee,#3b82f6)",
                    color: "white",
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                  }
                : {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                  }
            }
          >
            {msg.text}
          </div>
        </div>
      ))}

      {typing && (
        <div className="flex gap-3 justify-start">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.2)" }}
          >
            <Bot size={14} className="text-cyan-400" />
          </div>
          <div
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
