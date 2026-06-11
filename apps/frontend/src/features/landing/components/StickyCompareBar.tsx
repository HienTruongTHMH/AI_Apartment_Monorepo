import { motion } from "motion/react";
import { X } from "lucide-react";
import { LISTINGS } from "../data";

export function StickyCompareBar({ selectedIds, onCompare, onClear, t }: {
  selectedIds: string[];
  onCompare: () => void;
  onClear: () => void;
  t: (vi: string, en: string) => string;
}) {
  const selected = LISTINGS.filter(l => selectedIds.includes(l.id));
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-[8000] md:bottom-5 md:left-1/2 md:right-auto md:w-auto md:-translate-x-1/2">
      <div className="flex items-center gap-3 px-5 py-3.5 md:rounded-2xl"
        style={{ background: "rgba(3,7,18,0.97)", backdropFilter: "blur(20px)", border: "1px solid rgba(34,211,238,0.18)", borderBottom: "none", borderRadius: "20px 20px 0 0", boxShadow: "0 -4px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.06)" }}>
        <div className="flex -space-x-2">
          {selected.map(l => (
            <img key={l.id} src={l.img} alt={l.name} className="w-9 h-9 rounded-xl object-cover border-2" style={{ borderColor: "#030B14" }} />
          ))}
          {selectedIds.length < 3 && (
            <div className="w-9 h-9 rounded-xl border-2 border-dashed border-white/18 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
              <span className="text-white/22" style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-shrink-0">
          <p className="text-white/55 font-semibold whitespace-nowrap" style={{ fontSize: "0.78rem" }}>
            {selectedIds.length} {t("đã chọn","selected")} · {t("tối đa 3","max 3")}
          </p>
        </div>
        <button onClick={onCompare}
          className="px-4 py-2 rounded-xl text-white font-semibold flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", fontSize: "0.8rem", boxShadow: "0 0 16px rgba(34,211,238,0.25)" }}>
          {t("So sánh","Compare")}
        </button>
        <button onClick={onClear} className="text-white/25 hover:text-white/55 transition-colors flex-shrink-0"><X size={16} /></button>
      </div>
    </motion.div>
  );
}
