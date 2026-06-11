import { Star, TrendingUp } from "lucide-react";

interface ListingRatingsSectionProps {
  averageRating: number;
  totalRatings: number;
  breakdown: number[];
}

const RATING_LABELS = ["", "Tệ", "Không tốt", "Bình thường", "Tốt", "Xuất sắc"];

export function ListingRatingsSection({ averageRating, totalRatings, breakdown }: ListingRatingsSectionProps) {
  const roundedAvg = Math.round(averageRating * 10) / 10;
  const maxBar = Math.max(...breakdown, 1);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={15} className="text-amber-400" />
        <p className="text-white font-semibold" style={{ fontSize: "1rem" }}>Đánh giá & Nhận xét</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(251,191,36,0.15)", background: "rgba(251,191,36,0.03)" }}>
        {/* Top gradient accent */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(251,191,36,0.4),transparent)" }} />

        <div className="p-5 flex items-stretch gap-6">
          {/* Score */}
          <div className="flex flex-col items-center justify-center flex-shrink-0 w-24">
            <p className="font-black leading-none" style={{ fontSize: "3rem", color: totalRatings > 0 ? "#fbbf24" : "rgba(255,255,255,0.12)" }}>
              {totalRatings > 0 ? roundedAvg.toFixed(1) : "—"}
            </p>
            <div className="flex gap-0.5 justify-center my-1.5">
              {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} size={13}
                  className={n <= Math.round(averageRating) ? "text-amber-400 fill-amber-400" : "text-white/10"} />
              ))}
            </div>
            <p className="text-center" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
              {totalRatings > 0 ? `${totalRatings} đánh giá` : "Chưa có\nđánh giá"}
            </p>
          </div>

          {/* Divider */}
          <div className="w-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />

          {/* Breakdown bars */}
          <div className="flex-1 flex flex-col justify-center gap-2">
            {[5, 4, 3, 2, 1].map(n => {
              const count = breakdown[n - 1] ?? 0;
              const pct = totalRatings > 0 ? (count / maxBar) * 100 : 0;
              const isTop = n >= 4;
              return (
                <div key={n} className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1 flex-shrink-0 w-12 justify-end">
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>{n}</span>
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: isTop
                          ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                          : "rgba(251,191,36,0.35)",
                      }} />
                  </div>
                  <span className="flex-shrink-0 tabular-nums" style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", width: "1.2rem", textAlign: "right" }}>
                    {count}
                  </span>
                  {count > 0 && <span className="text-white/20 flex-shrink-0" style={{ fontSize: "0.6rem" }}>{RATING_LABELS[n]}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
