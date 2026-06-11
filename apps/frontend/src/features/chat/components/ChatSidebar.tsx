import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface ChatSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function ChatSidebar({ open, onToggle }: ChatSidebarProps) {
  return (
    <aside
      className="flex flex-col flex-shrink-0 transition-all duration-200 overflow-hidden"
      style={{
        width: open ? "240px" : "40px",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Toggle button */}
      <div className="flex items-center justify-end p-2 flex-shrink-0">
        <button
          onClick={onToggle}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
        >
          {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-3 px-3 pb-4">
          {/* New conversation button */}
          <button
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-cyan-400 transition-all"
            style={{
              fontSize: "0.82rem",
              border: "1px solid rgba(34,211,238,0.3)",
              background: "rgba(34,211,238,0.04)",
            }}
          >
            <Plus size={13} />
            Cuộc trò chuyện mới
          </button>

          {/* Empty state */}
          <p
            className="text-center mt-4"
            style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}
          >
            Chưa có cuộc trò chuyện nào
          </p>
        </div>
      )}
    </aside>
  );
}
