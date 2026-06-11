import { Home, Building2, BedDouble, Landmark, Briefcase, ArrowRight } from "lucide-react";

interface PropertyTypeSelectorProps {
  propertyType: string;
  intent: string;
  onChange: (type: string, intent: "rent" | "sell" | "") => void;
}

const PROPERTY_TYPES = [
  { label: "Nhà ở",                       icon: Home },
  { label: "Căn hộ/Chung cư",             icon: Building2 },
  { label: "Phòng trọ",                   icon: BedDouble },
  { label: "Đất",                          icon: Landmark },
  { label: "Văn phòng, Mặt bằng kinh doanh", icon: Briefcase },
];

const INTENTS: { label: string; desc: string; value: "rent" | "sell" }[] = [
  { label: "Cho thuê", desc: "Đăng tin cho thuê", value: "rent" },
  { label: "Bán",      desc: "Đăng tin rao bán",  value: "sell" },
];

const sectionLabel = (text: string) => (
  <p className="text-white/50 font-medium mb-3" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
    {text}
  </p>
);

export default function PropertyTypeSelector({ propertyType, intent, onChange }: PropertyTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        {sectionLabel("Loại bất động sản *")}
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map(({ label, icon: Icon }) => {
            const active = propertyType === label;
            return (
              <button
                key={label}
                onClick={() => onChange(label, intent as "rent" | "sell" | "")}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all"
                style={{
                  fontSize: "0.82rem",
                  border: active ? "1px solid rgba(34,211,238,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  background: active ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.03)",
                  color: active ? "#22d3ee" : "rgba(255,255,255,0.5)",
                  boxShadow: active ? "0 0 12px rgba(34,211,238,0.15)" : "none",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {sectionLabel("Tôi muốn *")}
        <div className="flex gap-3">
          {INTENTS.map(({ label, desc, value }) => {
            const active = intent === value;
            return (
              <button
                key={value}
                onClick={() => onChange(propertyType, value)}
                className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                style={{
                  border: active ? "1px solid rgba(34,211,238,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  background: active ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.03)",
                  boxShadow: active ? "0 0 14px rgba(34,211,238,0.12)" : "none",
                }}
              >
                <div className="text-left">
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: active ? "#22d3ee" : "rgba(255,255,255,0.7)" }}>{label}</p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>{desc}</p>
                </div>
                {active && <ArrowRight size={14} className="text-cyan-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
