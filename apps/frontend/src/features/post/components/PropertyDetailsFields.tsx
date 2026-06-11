import { SquareStack, Layers, BedDouble, Bath } from "lucide-react";

interface PropertyDetailsFieldsProps {
  disabled: boolean;
  area: string;
  floors: string;
  bedrooms: string;
  bathrooms: string;
  onChange: (field: string, val: string) => void;
}

const FIELDS = [
  { key: "area",      label: "Diện tích",  unit: "m²",  placeholder: "50",  icon: SquareStack },
  { key: "floors",    label: "Số tầng",    unit: "tầng", placeholder: "3",   icon: Layers },
  { key: "bedrooms",  label: "Phòng ngủ",  unit: "PN",  placeholder: "2",   icon: BedDouble },
  { key: "bathrooms", label: "Phòng tắm",  unit: "WC",  placeholder: "1",   icon: Bath },
];

export default function PropertyDetailsFields({ disabled, area, floors, bedrooms, bathrooms, onChange }: PropertyDetailsFieldsProps) {
  const values: Record<string, string> = { area, floors, bedrooms, bathrooms };

  return (
    <div style={{ opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? "none" : "auto" }}>
      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map(({ key, label, unit, placeholder, icon: Icon }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-white/40" style={{ fontSize: "0.73rem" }}>
              <Icon size={11} />
              {label}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={values[key]}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full outline-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                style={{
                  padding: "10px 44px 10px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" style={{ fontSize: "0.7rem" }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
