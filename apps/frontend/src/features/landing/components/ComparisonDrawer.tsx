import { motion } from "motion/react";
import { X, Bot, ArrowRight } from "lucide-react";
import { LISTINGS } from "../data";

export function ComparisonDrawer({ selectedIds, onClose, t, onGetStarted }: {
  selectedIds: string[];
  onClose: () => void;
  t: (vi: string, en: string) => string;
  onGetStarted: () => void;
}) {
  const selected = LISTINGS.filter(l => selectedIds.includes(l.id));
  const criteria: { key: keyof typeof LISTINGS[0]; label: string; fmt: (v: unknown) => string }[] = [
    { key: "priceFrom", label: t("Giá từ","Price from"), fmt: v => `${v}M/tháng` },
    { key: "priceTo",   label: t("Giá đến","Price to"),  fmt: v => `${v}M/tháng` },
    { key: "area",      label: t("Diện tích","Area"),     fmt: v => `${v}` },
    { key: "rating",    label: t("Đánh giá","Rating"),    fmt: v => `${v}★` },
    { key: "available", label: t("Còn trống","Available"),fmt: v => `${v} phòng` },
  ];
  const cols = selected.length;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9000] flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(16px)" }}
      onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        onClick={e => e.stopPropagation()}
        className="rounded-t-3xl overflow-hidden overflow-y-auto"
        style={{ background: "rgba(3,7,18,0.98)", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "85vh" }}>
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/15 nv-drawer-handle" />
        </div>
        <div className="px-6 pb-4 flex items-center justify-between border-b border-white/7">
          <div>
            <h3 className="text-white font-bold" style={{ fontSize: "1.1rem" }}>{t("So sánh căn hộ","Compare Apartments")}</h3>
            <p className="text-white/35" style={{ fontSize: "0.78rem" }}>{selected.length} {t("căn hộ đã chọn","apartments selected")}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/65 transition-colors"><X size={22} /></button>
        </div>

        <div className="p-6">
          {/* Images + names */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `160px repeat(${cols}, 1fr)` }}>
            <div />
            {selected.map(apt => (
              <div key={apt.id} className="text-center">
                <div className="rounded-2xl overflow-hidden mb-3" style={{ height: "120px" }}>
                  <img src={apt.img} alt={apt.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <p className="text-white font-bold" style={{ fontSize: "0.78rem", lineHeight: 1.3 }}>{apt.name}</p>
                <p className="text-cyan-400 font-semibold mt-0.5" style={{ fontSize: "0.82rem" }}>{apt.priceFrom}–{apt.priceTo}M</p>
                <p className="text-white/30" style={{ fontSize: "0.65rem" }}>{apt.district}</p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {criteria.map(({ key, label, fmt }) => (
            <div key={key} className="grid gap-4 py-3.5" style={{ gridTemplateColumns: `160px repeat(${cols}, 1fr)`, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-white/35 flex items-center" style={{ fontSize: "0.78rem" }}>{label}</p>
              {selected.map(apt => (
                <div key={apt.id} className="text-center">
                  <p className="text-white font-semibold" style={{ fontSize: "0.82rem" }}>{fmt(apt[key])}</p>
                </div>
              ))}
            </div>
          ))}

          {/* Amenities */}
          <div className="grid gap-4 py-3.5" style={{ gridTemplateColumns: `160px repeat(${cols}, 1fr)`, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-white/35 flex items-start pt-0.5" style={{ fontSize: "0.78rem" }}>{t("Tiện ích","Amenities")}</p>
            {selected.map(apt => (
              <div key={apt.id} className="flex flex-wrap gap-1 justify-center">
                {apt.amenities.map(a => (
                  <span key={a} className="px-1.5 py-0.5 rounded-md text-white/40"
                    style={{ fontSize: "0.58rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>{a}</span>
                ))}
              </div>
            ))}
          </div>

          {/* AI Summary */}
          <div className="mt-5 rounded-2xl p-5" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Bot size={14} className="text-cyan-400" />
              <span className="text-cyan-400 font-semibold" style={{ fontSize: "0.78rem" }}>AI {t("phân tích","analysis")}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>
            <p className="text-white/48" style={{ fontSize: "0.8rem", lineHeight: 1.7 }}>
              {selected.length >= 2
                ? `${selected[0]?.name} ${t("phù hợp hơn với ngân sách hẹp và số phòng trống cao hơn. Trong khi","is better for tighter budgets with more availability. Meanwhile,")} ${selected[1]?.name} ${t("nổi bật với rating cao hơn và tiện ích cao cấp.","stands out with a higher rating and premium amenities.")}`
                : t("Chọn thêm căn hộ để AI tổng hợp điểm mạnh và yếu chi tiết.", "Select more apartments for detailed AI pros & cons analysis.")}
            </p>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { onGetStarted(); onClose(); }}
            className="w-full mt-5 py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#22d3ee,#3b82f6)", fontSize: "0.9rem" }}>
            {t("Đặt lịch xem ngay","Schedule a tour")}<ArrowRight size={15} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
