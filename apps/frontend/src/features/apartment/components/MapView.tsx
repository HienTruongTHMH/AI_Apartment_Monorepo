import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, X, Star, Navigation, Filter, Building2 } from "lucide-react";

interface AptPin {
  id: string;
  name: string;
  district: string;
  price: string;
  area: string;
  rooms: string;
  rating: number;
  x: number; // % from left
  y: number; // % from top
  tier: "budget" | "mid" | "premium";
  img: string;
}

const PINS: AptPin[] = [
  { id: "p1", name: "Sunrise City North", district: "Quận 7", price: "11.5M/tháng", area: "65m²", rooms: "2PN", rating: 4.8, x: 40, y: 72, tier: "mid", img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=240" },
  { id: "p2", name: "Vinhomes Grand Park", district: "TP. Thủ Đức", price: "9.8M/tháng", area: "58m²", rooms: "2PN", rating: 4.6, x: 75, y: 40, tier: "mid", img: "https://images.unsplash.com/photo-1585128792103-0b591f96512e?w=240" },
  { id: "p3", name: "The River Thủ Thiêm", district: "Quận 2", price: "14.2M/tháng", area: "72m²", rooms: "2PN", rating: 4.9, x: 58, y: 45, tier: "premium", img: "https://images.unsplash.com/photo-1763401929055-43fd29000be3?w=240" },
  { id: "p4", name: "Masteri Centre Point", district: "TP. Thủ Đức", price: "10.5M/tháng", area: "55m²", rooms: "1PN", rating: 4.5, x: 68, y: 55, tier: "mid", img: "https://images.unsplash.com/photo-1774716925810-e923c8206ed5?w=240" },
  { id: "p5", name: "Landmark 81", district: "Bình Thạnh", price: "18.9M/tháng", area: "90m²", rooms: "3PN", rating: 5.0, x: 46, y: 38, tier: "premium", img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=240" },
  { id: "p6", name: "Eco Green Saigon", district: "Quận 7", price: "7.8M/tháng", area: "45m²", rooms: "1PN", rating: 4.4, x: 36, y: 68, tier: "budget", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=240" },
  { id: "p7", name: "D'Edge Thảo Điền", district: "Quận 2", price: "13M/tháng", area: "68m²", rooms: "2PN", rating: 4.7, x: 62, y: 42, tier: "premium", img: "https://images.unsplash.com/photo-1585128792103-0b591f96512e?w=240" },
  { id: "p8", name: "Botanica Premier", district: "Tân Bình", price: "9.2M/tháng", area: "48m²", rooms: "1PN", rating: 4.5, x: 34, y: 30, tier: "budget", img: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=240" },
];

const DISTRICTS = [
  { name: "Q.1", x: 48, y: 52 }, { name: "Q.2", x: 60, y: 46 },
  { name: "Q.3", x: 45, y: 46 }, { name: "Q.4", x: 46, y: 60 },
  { name: "Q.7", x: 40, y: 70 }, { name: "Thủ Đức", x: 72, y: 42 },
  { name: "Bình Thạnh", x: 48, y: 36 }, { name: "Tân Bình", x: 33, y: 28 },
  { name: "Gò Vấp", x: 40, y: 22 }, { name: "Phú Nhuận", x: 43, y: 40 },
];

const TIER_COLOR: Record<AptPin["tier"], { bg: string; border: string; text: string }> = {
  budget:  { bg: "#22d3ee", border: "#06b6d4", text: "#fff" },
  mid:     { bg: "#8b5cf6", border: "#7c3aed", text: "#fff" },
  premium: { bg: "#f59e0b", border: "#d97706", text: "#fff" },
};

export function MapView({ isDark }: { isDark?: boolean }) {
  const [selected, setSelected] = useState<AptPin | null>(null);
  const [tierFilter, setTierFilter] = useState<AptPin["tier"] | "all">("all");
  const [showFilter, setShowFilter] = useState(false);

  const visible = PINS.filter((p) => tierFilter === "all" || p.tier === tierFilter);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className={`${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"} border-b px-6 py-4 flex items-center justify-between flex-shrink-0`}>
        <div>
          <h2 className={`font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`} style={{ fontSize: "1.1rem" }}>Bản đồ căn hộ TP.HCM</h2>
          <p className={isDark ? "text-slate-400" : "text-gray-500"} style={{ fontSize: "0.75rem" }}>{visible.length} căn hộ hiển thị • Click pin để xem chi tiết</p>
        </div>
        <button onClick={() => setShowFilter((v) => !v)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-medium transition-colors ${showFilter ? "bg-violet-50 border-violet-300 text-violet-700" : isDark ? "border-slate-600 text-slate-400 hover:border-slate-500" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
          style={{ fontSize: "0.8rem" }}>
          <Filter size={14} /> Lọc
        </button>
      </div>

      {/* Filter bar */}
      <AnimatePresence>
        {showFilter && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className={`overflow-hidden border-b flex-shrink-0 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
            <div className="px-6 py-3 flex items-center gap-3">
              <span className={`text-xs font-bold ${isDark ? "text-slate-500" : "text-gray-400"}`} style={{ letterSpacing: "0.08em" }}>PHÂN KHÚC</span>
              {(["all", "budget", "mid", "premium"] as const).map((t) => (
                <button key={t} onClick={() => setTierFilter(t)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${tierFilter === t ? "bg-violet-600 border-violet-600 text-white" : isDark ? "border-slate-600 text-slate-400 hover:border-violet-500" : "border-gray-200 text-gray-500 hover:border-violet-400"}`}>
                  {t === "all" ? "Tất cả" : t === "budget" ? "Bình dân (<10M)" : t === "mid" ? "Trung cấp (10–15M)" : "Cao cấp (>15M)"}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden" style={{ background: isDark ? "#0a0f1a" : "#e8f4fd" }}>
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <g key={i}>
              <line x1={`${i * 5.26}%`} y1="0" x2={`${i * 5.26}%`} y2="100%" stroke={isDark ? "#94a3b8" : "#3b82f6"} strokeWidth="1" />
              <line x1="0" y1={`${i * 5.26}%`} x2="100%" y2={`${i * 5.26}%`} stroke={isDark ? "#94a3b8" : "#3b82f6"} strokeWidth="1" />
            </g>
          ))}
        </svg>

        {/* River */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M 55% 20% Q 60% 45% 58% 60% Q 55% 72% 50% 85%"
            fill="none" stroke={isDark ? "rgba(34,211,238,0.2)" : "rgba(59,130,246,0.25)"} strokeWidth="18" strokeLinecap="round" />
          <path d="M 55% 20% Q 60% 45% 58% 60% Q 55% 72% 50% 85%"
            fill="none" stroke={isDark ? "rgba(34,211,238,0.12)" : "rgba(59,130,246,0.15)"} strokeWidth="28" strokeLinecap="round" />
        </svg>

        {/* District labels */}
        {DISTRICTS.map((d) => (
          <div key={d.name} className="absolute pointer-events-none"
            style={{ left: `${d.x}%`, top: `${d.y}%`, transform: "translate(-50%,-50%)", fontSize: "0.62rem", color: isDark ? "rgba(148,163,184,0.5)" : "rgba(100,116,139,0.7)", fontWeight: 600, letterSpacing: "0.04em" }}>
            {d.name}
          </div>
        ))}

        {/* Apartment pins */}
        {visible.map((pin) => {
          const color = TIER_COLOR[pin.tier];
          return (
            <motion.button
              key={pin.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.2, zIndex: 20 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(pin)}
              className="absolute"
              style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%,-100%)", zIndex: selected?.id === pin.id ? 30 : 10 }}
            >
              <div className="relative">
                <div className="flex flex-col items-center">
                  <div className="px-2.5 py-1 rounded-xl text-xs font-bold shadow-lg"
                    style={{ background: color.bg, border: `2px solid ${color.border}`, color: color.text, fontSize: "0.65rem", whiteSpace: "nowrap" }}>
                    {pin.price.replace("/tháng", "")}
                  </div>
                  <div className="w-2.5 h-2.5 rotate-45 -mt-1.5" style={{ background: color.bg }} />
                </div>
              </div>
            </motion.button>
          );
        })}

        {/* Legend */}
        <div className={`absolute bottom-4 left-4 rounded-2xl border p-3 space-y-1.5 ${isDark ? "bg-slate-900/90 border-slate-700" : "bg-white/90 border-gray-200"}`}
          style={{ backdropFilter: "blur(8px)" }}>
          <p className={`font-bold mb-1.5 ${isDark ? "text-slate-300" : "text-gray-700"}`} style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>PHÂN KHÚC</p>
          {(["budget", "mid", "premium"] as const).map((t) => {
            const c = TIER_COLOR[t];
            return (
              <div key={t} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ background: c.bg }} />
                <span style={{ fontSize: "0.68rem", color: isDark ? "#94a3b8" : "#6b7280" }}>
                  {t === "budget" ? "Bình dân" : t === "mid" ? "Trung cấp" : "Cao cấp"}
                </span>
              </div>
            );
          })}
        </div>

        {/* "My location" pin */}
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute" style={{ left: "48%", top: "52%", transform: "translate(-50%,-50%)" }}>
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
          <div className="absolute inset-0 w-8 h-8 rounded-full bg-blue-500/20 -m-2" />
        </motion.div>
        <div className="absolute" style={{ left: "48%", top: "52%", transform: "translate(8px,-18px)", fontSize: "0.62rem", color: isDark ? "#93c5fd" : "#3b82f6", fontWeight: 600 }}>
          Vị trí của bạn
        </div>

        {/* Detail card */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`absolute bottom-4 right-4 w-72 rounded-2xl border overflow-hidden shadow-2xl ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
              <button onClick={() => setSelected(null)}
                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-white">
                <X size={12} />
              </button>
              <div className="h-32 bg-gray-200 overflow-hidden">
                <img src={selected.img} alt={selected.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className={`font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`} style={{ fontSize: "0.9rem" }}>{selected.name}</p>
                    <p className={`flex items-center gap-1 ${isDark ? "text-slate-400" : "text-gray-500"}`} style={{ fontSize: "0.72rem" }}>
                      <MapPin size={11} />{selected.district}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-amber-600 font-bold" style={{ fontSize: "0.75rem" }}>{selected.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-violet-600 font-bold" style={{ fontSize: "0.95rem" }}>{selected.price}</span>
                  <span className={isDark ? "text-slate-400" : "text-gray-500"} style={{ fontSize: "0.72rem" }}>{selected.area} · {selected.rooms}</span>
                </div>
                <button className="w-full py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2"
                  style={{ fontSize: "0.8rem" }}>
                  <Navigation size={13} /> Xem chi tiết
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats bar */}
        <div className={`absolute top-4 right-4 rounded-2xl border px-4 py-3 ${isDark ? "bg-slate-900/90 border-slate-700" : "bg-white/90 border-gray-200"}`}
          style={{ backdropFilter: "blur(8px)" }}>
          <div className="flex items-center gap-3">
            {[
              { icon: Building2, label: "Căn hộ", value: visible.length.toString() },
              { icon: MapPin, label: "Quận", value: [...new Set(visible.map((p) => p.district))].length.toString() },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={14} className="text-violet-500" />
                <div>
                  <p className={`font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`} style={{ fontSize: "0.85rem" }}>{value}</p>
                  <p className={isDark ? "text-slate-500" : "text-gray-400"} style={{ fontSize: "0.6rem" }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
