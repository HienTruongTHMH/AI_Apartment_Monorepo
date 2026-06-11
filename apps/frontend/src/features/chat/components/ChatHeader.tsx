import { Building2, Bot, ChevronLeft } from "lucide-react";

interface ChatHeaderProps {
  onBack: () => void;
}

export default function ChatHeader({ onBack }: ChatHeaderProps) {
  return (
    <header
      className="flex items-center justify-between h-14 px-5 flex-shrink-0"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 select-none">
        <div
          className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center"
          style={{ boxShadow: "0 0 12px rgba(34,211,238,0.3)" }}
        >
          <Building2 size={14} className="text-white" />
        </div>
        <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
          NestaViet<span className="text-cyan-400">AI</span>
        </span>
      </div>

      {/* Center label */}
      <div className="flex items-center gap-2">
        <Bot size={15} className="text-cyan-400" />
        <span className="text-white/70 font-medium" style={{ fontSize: "0.85rem" }}>
          AI Super Broker
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-all"
        style={{ fontSize: "0.82rem", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <ChevronLeft size={14} />
        Trang chủ
      </button>
    </header>
  );
}
