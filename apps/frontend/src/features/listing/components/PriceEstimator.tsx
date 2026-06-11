import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, TrendingUp, TrendingDown, Info, RefreshCw, DollarSign, MapPin, BedDouble, SquareStack } from "lucide-react";

interface EstimateResult {
  low: number;
  mid: number;
  high: number;
  marketAvg: number;
  trend: "up" | "down" | "stable";
  trendPct: number;
  tips: string[];
  comparables: { name: string; price: number; dist: string }[];
}

const DISTRICTS = ["Quận 1", "Quận 2 / Thủ Đức", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Bình Thạnh", "Tân Bình", "Gò Vấp", "Phú Nhuận", "Tân Phú", "Bình Tân"];

function simulate(district: string, rooms: number, area: number): EstimateResult {
  const base: Record<string, number> = {
    "Quận 1": 18, "Quận 3": 16, "Quận 2 / Thủ Đức": 14, "Phú Nhuận": 15, "Bình Thạnh": 13,
    "Quận 7": 12, "Tân Bình": 10, "Quận 4": 10, "Quận 5": 11, "Gò Vấp": 9, "Quận 12": 8,
  };
  const basePrice = (base[district] ?? 10) * 1000000;
  const roomMult = rooms === 1 ? 1 : rooms === 2 ? 1.5 : 2.2;
  const areaMult = area / 50;
  const mid = Math.round((basePrice * roomMult * areaMult) / 500000) * 500000;
  return {
    low: Math.round(mid * 0.88 / 500000) * 500000,
    mid,
    high: Math.round(mid * 1.14 / 500000) * 500000,
    marketAvg: Math.round(mid * 1.05 / 500000) * 500000,
    trend: mid > 11000000 ? "up" : "stable",
    trendPct: mid > 14000000 ? 8.4 : 5.2,
    tips: [
      `${district} có nhu cầu thuê ${rooms}PN ${rooms >= 2 ? "rất cao" : "ổn định"} trong Q1/2025.`,
      `Đặt giá ở mức ${fmt(mid)} để cạnh tranh và lấp đầy nhanh nhất.`,
      `Thêm tiện ích (internet, điều hòa, tủ lạnh) có thể tăng giá thêm 5–10%.`,
      "Hợp đồng 12 tháng cho ổn định hơn hợp đồng 6 tháng — giảm rủi ro trống phòng.",
    ],
    comparables: [
      { name: `Căn hộ ${district} tương tự #1`, price: Math.round(mid * 0.95 / 500000) * 500000, dist: "0.3km" },
      { name: `Căn hộ ${district} tương tự #2`, price: Math.round(mid * 1.02 / 500000) * 500000, dist: "0.8km" },
      { name: `Căn hộ ${district} tương tự #3`, price: Math.round(mid * 1.08 / 500000) * 500000, dist: "1.2km" },
    ],
  };
}

function fmt(n: number) {
  return `${(n / 1000000).toFixed(1)}M ₫`;
}

export function PriceEstimator({ isDark }: { isDark?: boolean }) {
  const [district, setDistrict] = useState("");
  const [rooms, setRooms] = useState(2);
  const [area, setArea] = useState(55);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);

  const run = async () => {
    if (!district) return;
    setResult(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2200));
    setLoading(false);
    setResult(simulate(district, rooms, area));
  };

  const bg = isDark ? "bg-slate-900" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-gray-100";
  const tp = isDark ? "text-slate-100" : "text-gray-900";
  const ts = isDark ? "text-slate-400" : "text-gray-500";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={`${bg} border-b ${border} px-6 py-4`}>
        <h2 className={`font-bold ${tp}`} style={{ fontSize: "1.1rem" }}>AI Ước tính giá thuê</h2>
        <p className={ts} style={{ fontSize: "0.75rem" }}>Phân tích market data TP.HCM — ước tính giá hợp lý cho căn hộ của bạn</p>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Input card */}
        <div className={`${bg} rounded-2xl border ${border} p-6 shadow-sm space-y-5`}>
          <p className={`font-bold ${tp}`} style={{ fontSize: "0.9rem" }}>Thông tin căn hộ</p>

          {/* District */}
          <div>
            <label className={`flex items-center gap-1.5 mb-2 font-medium ${ts}`} style={{ fontSize: "0.78rem" }}>
              <MapPin size={13} /> Quận / Khu vực
            </label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 outline-none transition-colors ${isDark ? "bg-slate-800 border-slate-600 text-slate-100" : "bg-gray-50 border-gray-200 text-gray-800"}`}
              style={{ fontSize: "0.875rem" }}>
              <option value="">-- Chọn quận --</option>
              {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Rooms */}
          <div>
            <label className={`flex items-center gap-1.5 mb-2 font-medium ${ts}`} style={{ fontSize: "0.78rem" }}>
              <BedDouble size={13} /> Số phòng ngủ
            </label>
            <div className="flex gap-3">
              {[1, 2, 3].map((r) => (
                <button key={r} onClick={() => setRooms(r)}
                  className={`flex-1 py-3 rounded-xl border font-semibold transition-all ${rooms === r ? "bg-violet-600 border-violet-600 text-white" : isDark ? "border-slate-600 text-slate-400 hover:border-violet-500" : "border-gray-200 text-gray-500 hover:border-violet-400"}`}
                  style={{ fontSize: "0.875rem" }}>
                  {r} PN
                </button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div>
            <label className={`flex items-center justify-between gap-1.5 mb-2 font-medium ${ts}`} style={{ fontSize: "0.78rem" }}>
              <span className="flex items-center gap-1.5"><SquareStack size={13} /> Diện tích</span>
              <span className="font-bold text-violet-600">{area} m²</span>
            </label>
            <input type="range" min={25} max={120} value={area} onChange={(e) => setArea(Number(e.target.value))}
              className="w-full accent-violet-600" />
            <div className={`flex justify-between mt-1 ${ts}`} style={{ fontSize: "0.65rem" }}>
              <span>25 m²</span><span>120 m²</span>
            </div>
          </div>

          <motion.button whileTap={{ scale: 0.97 }} onClick={run} disabled={!district || loading}
            className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all nv-glow-pulse"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", fontSize: "0.9rem" }}>
            {loading
              ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><RefreshCw size={16} /></motion.div>AI đang phân tích…</>
              : <><Sparkles size={16} />Ước tính giá ngay</>}
          </motion.button>
        </div>

        {/* Loading steps */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`${bg} rounded-2xl border ${border} p-5 space-y-3`}>
              {["Đang thu thập dữ liệu thị trường…", "Phân tích 847 giao dịch tương tự…", "Tính toán giá hợp lý theo AI model…"].map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.6 }}
                  className="flex items-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: i * 0.4 }}>
                    <RefreshCw size={13} className="text-violet-500" />
                  </motion.div>
                  <span className={ts} style={{ fontSize: "0.8rem" }}>{step}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Price range */}
              <div className={`${bg} rounded-2xl border ${border} p-6 shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <p className={`font-bold ${tp}`} style={{ fontSize: "0.9rem" }}>Giá ước tính</p>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                    style={{ background: result.trend === "up" ? "#dcfce7" : "#fef9c3", color: result.trend === "up" ? "#166534" : "#854d0e" }}>
                    {result.trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    +{result.trendPct}% so với Q4/2024
                  </span>
                </div>

                {/* 3-level price bar */}
                <div className="relative mb-4">
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg,#22d3ee,#8b5cf6,#f59e0b)" }} />
                  <div className="flex justify-between mt-2">
                    {[{ label: "Thấp nhất", val: result.low }, { label: "Hợp lý nhất", val: result.mid }, { label: "Cao nhất", val: result.high }].map(({ label, val }) => (
                      <div key={label} className="text-center">
                        <p className={`font-bold ${tp}`} style={{ fontSize: "0.88rem" }}>{fmt(val)}</p>
                        <p className={ts} style={{ fontSize: "0.62rem" }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended badge */}
                <div className="rounded-xl p-3 text-center" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <p className={ts} style={{ fontSize: "0.72rem" }}>Giá đề xuất tối ưu</p>
                  <p className="font-black text-violet-600" style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}>{fmt(result.mid)}</p>
                  <p className="text-violet-500" style={{ fontSize: "0.72rem" }}>/ tháng — tỷ lệ lấp đầy cao nhất</p>
                </div>
              </div>

              {/* Tips */}
              <div className={`${bg} rounded-2xl border ${border} p-5 shadow-sm`}>
                <p className={`font-bold mb-3 ${tp}`} style={{ fontSize: "0.85rem" }}>Gợi ý từ AI</p>
                <div className="space-y-2.5">
                  {result.tips.map((t, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Info size={13} className="text-violet-500 flex-shrink-0 mt-0.5" />
                      <p className={ts} style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparables */}
              <div className={`${bg} rounded-2xl border ${border} p-5 shadow-sm`}>
                <p className={`font-bold mb-3 ${tp}`} style={{ fontSize: "0.85rem" }}>Căn hộ tương tự lân cận</p>
                <div className="space-y-2">
                  {result.comparables.map((c) => (
                    <div key={c.name} className={`flex items-center justify-between py-2.5 border-b last:border-0 ${border}`}>
                      <div>
                        <p className={`font-medium ${tp}`} style={{ fontSize: "0.82rem" }}>{c.name}</p>
                        <p className={ts} style={{ fontSize: "0.68rem" }}>{c.dist} · {district}</p>
                      </div>
                      <p className="font-bold text-violet-600" style={{ fontSize: "0.88rem" }}>{fmt(c.price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className={ts} style={{ fontSize: "0.68rem", textAlign: "center", lineHeight: 1.6 }}>
                * Ước tính dựa trên AI phân tích dữ liệu thị trường TP.HCM Q1/2025.<br />
                Giá thực tế có thể thay đổi tùy điều kiện phòng và thị trường.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
