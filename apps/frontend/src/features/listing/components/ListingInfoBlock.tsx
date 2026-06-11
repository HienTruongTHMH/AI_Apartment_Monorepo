import { useState } from "react";
import { MapPin, Clock, ShieldCheck, Wifi, Wind, Car, Waves, Dumbbell, Trees, ChefHat, Tv, WashingMachine } from "lucide-react";

interface ListingInfoBlockProps {
  title: string;
  price: string;
  area: string;
  type: string;
  address: string;
  updatedAt: string;
  verified?: boolean;
  description?: string;
  amenities?: string[];
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wifi": <Wifi size={11} />,
  "Máy lạnh": <Wind size={11} />,
  "Bãi xe": <Car size={11} />,
  "Hồ bơi": <Waves size={11} />,
  "Gym": <Dumbbell size={11} />,
  "Sân vườn": <Trees size={11} />,
  "Bếp": <ChefHat size={11} />,
  "TV": <Tv size={11} />,
  "Máy giặt": <WashingMachine size={11} />,
};

export function ListingInfoBlock({ title, price, area, type, address, updatedAt, verified, description, amenities }: ListingInfoBlockProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-6">
      {/* Type tag + verified badge */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="px-2.5 py-0.5 rounded-full text-cyan-400 font-medium border border-cyan-400/30"
          style={{ fontSize: "0.7rem", background: "rgba(34,211,238,0.08)" }}>
          {type}
        </span>
        {verified && (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-emerald-400 font-medium border border-emerald-400/30"
            style={{ fontSize: "0.7rem", background: "rgba(16,185,129,0.08)" }}>
            <ShieldCheck size={11} />Đã xác minh
          </span>
        )}
      </div>

      <h1 className="text-white font-bold mb-3" style={{ fontSize: "1.25rem", lineHeight: 1.4 }}>{title}</h1>

      {/* Price + area */}
      <div className="flex items-center gap-4 mb-4">
        <span className="font-bold" style={{ fontSize: "1.3rem", color: "#22d3ee" }}>{price}</span>
        {area && <span className="text-white/45 text-sm border-l border-white/10 pl-4">{area}</span>}
      </div>

      {/* Location */}
      {address && (
        <div className="flex items-start gap-2 mb-2">
          <MapPin size={14} className="text-white/30 flex-shrink-0 mt-0.5" />
          <p className="text-white/50" style={{ fontSize: "0.83rem", lineHeight: 1.5 }}>{address}</p>
        </div>
      )}

      {/* Updated */}
      {updatedAt && (
        <div className="flex items-center gap-2 mt-2">
          <Clock size={12} className="text-white/20" />
          <span className="text-white/30" style={{ fontSize: "0.72rem" }}>Cập nhật {updatedAt}</span>
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="mt-4 pt-4 border-t border-white/6">
          <p className="text-white/55 leading-relaxed"
            style={{
              fontSize: "0.83rem",
              lineHeight: 1.65,
              display: "-webkit-box",
              WebkitLineClamp: expanded ? "unset" : 3,
              WebkitBoxOrient: "vertical",
              overflow: expanded ? "visible" : "hidden",
            } as React.CSSProperties}>
            {description}
          </p>
          <button
            onClick={() => setExpanded(p => !p)}
            className="mt-1.5 text-cyan-400/70 hover:text-cyan-400 transition-colors"
            style={{ fontSize: "0.75rem" }}>
            {expanded ? "Thu gọn" : "Xem thêm"}
          </button>
        </div>
      )}

      {/* Amenities */}
      {amenities && amenities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {amenities.map(a => (
            <span key={a}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white/50 border border-white/8"
              style={{ fontSize: "0.72rem", background: "rgba(255,255,255,0.03)" }}>
              {AMENITY_ICONS[a] ?? null}{a}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
