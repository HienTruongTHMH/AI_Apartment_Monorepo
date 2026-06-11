import { useRef, useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 96) + "px";
    }
  };

  return (
    <div
      className="flex items-end gap-3 px-5 py-4 flex-shrink-0"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(3,7,18,0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng)"
        rows={1}
        className="flex-1 resize-none rounded-xl px-4 py-2.5 text-white placeholder-white/25 outline-none transition-all"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: "0.88rem",
          lineHeight: 1.5,
          maxHeight: "96px",
          overflowY: "auto",
        }}
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all"
        style={{
          background: value.trim()
            ? "linear-gradient(135deg,#22d3ee,#3b82f6)"
            : "rgba(255,255,255,0.06)",
          boxShadow: value.trim() ? "0 0 14px rgba(34,211,238,0.3)" : "none",
          cursor: value.trim() ? "pointer" : "not-allowed",
        }}
      >
        <Send size={15} className={value.trim() ? "text-white" : "text-white/25"} />
      </button>
    </div>
  );
}
