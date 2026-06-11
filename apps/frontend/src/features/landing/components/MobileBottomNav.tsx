import { Home, Search, MessageSquare, UserPlus } from "lucide-react";

export function MobileBottomNav({ onGetStarted, t }: { onGetStarted: () => void; t: (vi: string, en: string) => string }) {
  const items = [
    { icon: Home,          label: t("Trang chủ","Home"),    action: () => window.scrollTo({ top: 0, behavior: "smooth" }), highlight: false },
    { icon: Search,        label: t("Tìm kiếm","Search"),   action: () => { const el = document.querySelector("input[type=text]"); if (el) (el as HTMLElement).focus(); else window.scrollTo({ top: 400, behavior: "smooth" }); }, highlight: false },
    { icon: MessageSquare, label: "AI Chat",                action: onGetStarted, highlight: true },
    { icon: UserPlus,      label: t("Đăng ký","Sign up"),   action: onGetStarted, highlight: false },
  ];
  return (
    <div className="nv-bottom-nav-wrapper fixed bottom-0 left-0 right-0 z-[100]"
      style={{ background: "rgba(3,7,18,0.94)", backdropFilter: "blur(20px) saturate(180%)", borderTop: "1px solid rgba(255,255,255,0.07)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex items-center py-2 px-4">
        {items.map(({ icon: Icon, label, action, highlight }) => (
          <button key={label} onClick={action} className="nv-mobile-nav-item">
            <div className={`w-6 h-6 flex items-center justify-center rounded-xl ${highlight ? "bg-gradient-to-br from-cyan-400 to-blue-500" : ""}`}
              style={highlight ? { boxShadow: "0 0 12px rgba(34,211,238,0.4)" } : undefined}>
              <Icon size={15} className={highlight ? "text-white" : "text-white/38"} />
            </div>
            <span style={{ fontSize: "0.56rem", fontWeight: 600, color: highlight ? "#22d3ee" : "rgba(255,255,255,0.28)" }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
