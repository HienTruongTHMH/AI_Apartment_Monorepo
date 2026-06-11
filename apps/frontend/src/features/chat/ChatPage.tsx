import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ChatHeader from "./components/ChatHeader";
import ChatSidebar from "./components/ChatSidebar";
import ChatMessageList from "./components/ChatMessageList";
import ChatInput from "./components/ChatInput";

export type Message = { id: number; role: "user" | "ai"; text: string; ts: Date };

export function ChatPage() {
  const navigate = useNavigate();

  // Auth guard + force dark theme
  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    const ok =
      localStorage.getItem("nv-quick-email") ||
      localStorage.getItem("nv-tenant-logged-in") === "true" ||
      localStorage.getItem("nv-landlord-logged-in") === "true";
    if (!ok) navigate("/", { replace: true });
  }, [navigate]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "ai",
        text: "AI đang xử lý yêu cầu của bạn. Tính năng này đang được phát triển.",
        ts: new Date(),
      }]);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: "#030B14", color: "white" }}>
      <ChatHeader onBack={() => navigate("/")} />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(v => !v)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <ChatMessageList messages={messages} typing={typing} onPrompt={handleSend} />
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
