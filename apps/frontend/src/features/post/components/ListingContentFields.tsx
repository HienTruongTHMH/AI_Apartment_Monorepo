interface ListingContentFieldsProps {
  title: string;
  description: string;
  price: string;
  priceUnit: "thang" | "m2";
  onChange: (field: string, val: string) => void;
}

const baseInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  fontSize: "0.85rem",
  outline: "none",
};

export default function ListingContentFields({ title, description, price, priceUnit, onChange }: ListingContentFieldsProps) {
  const titleLimit = 100;
  const descLimit = 1000;

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-white/40" style={{ fontSize: "0.73rem" }}>Tiêu đề</label>
          <span style={{ fontSize: "0.65rem", color: title.length > titleLimit * 0.85 ? "rgba(251,191,36,0.8)" : "rgba(255,255,255,0.2)" }}>
            {title.length}/{titleLimit}
          </span>
        </div>
        <input
          type="text"
          value={title}
          maxLength={titleLimit}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Ví dụ: Căn hộ 2PN view sông, nội thất đầy đủ"
          style={baseInputStyle}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-white/40" style={{ fontSize: "0.73rem" }}>Mô tả</label>
          <span style={{ fontSize: "0.65rem", color: description.length > descLimit * 0.85 ? "rgba(251,191,36,0.8)" : "rgba(255,255,255,0.2)" }}>
            {description.length}/{descLimit}
          </span>
        </div>
        <textarea
          rows={5}
          value={description}
          maxLength={descLimit}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Mô tả chi tiết về bất động sản — vị trí, nội thất, tiện ích xung quanh..."
          style={{ ...baseInputStyle, resize: "vertical", lineHeight: 1.6 }}
        />
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/40" style={{ fontSize: "0.73rem" }}>Giá</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 font-medium" style={{ fontSize: "0.82rem" }}>₫</span>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => onChange("price", e.target.value)}
              placeholder="Ví dụ: 10"
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              style={{ ...baseInputStyle, paddingLeft: "28px" }}
            />
          </div>
          <div className="flex rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
            {(["thang", "m2"] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => onChange("priceUnit", unit)}
                className="px-3 py-2 transition-all"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: priceUnit === unit ? 600 : 400,
                  background: priceUnit === unit ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.03)",
                  color: priceUnit === unit ? "#22d3ee" : "rgba(255,255,255,0.4)",
                  borderRight: unit === "thang" ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                {unit === "thang" ? "triệu/tháng" : "triệu/m²"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
