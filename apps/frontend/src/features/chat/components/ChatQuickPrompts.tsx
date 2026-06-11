interface ChatQuickPromptsProps {
  onPrompt: (text: string) => void;
}

const PROMPTS = [
  "Tìm căn hộ",
  "Tư vấn giá thuê",
  "Đặt lịch xem phòng",
  "Hỗ trợ hợp đồng",
];

export default function ChatQuickPrompts({ onPrompt }: ChatQuickPromptsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-sm">
      {PROMPTS.map((text) => (
        <button
          key={text}
          onClick={() => onPrompt(text)}
          className="rounded-xl px-4 py-3 text-left text-white/70 hover:text-white transition-all"
          style={{
            fontSize: "0.82rem",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(34,211,238,0.3)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,211,238,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
          }}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
