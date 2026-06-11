import { ChevronDown } from "lucide-react";

interface PropertyLocationFieldsProps {
  disabled: boolean;
  province: string;
  district: string;
  ward: string;
  onChange: (field: string, val: string) => void;
}

const PROVINCES = ["Hà Nội", "TP.HCM", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bình Dương", "Đồng Nai"];

function SelectWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/40" style={{ fontSize: "0.73rem" }}>{label}</label>
      <div className="relative">
        {children}
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 36px 10px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  fontSize: "0.85rem",
  outline: "none",
  appearance: "none" as const,
  cursor: "pointer",
};

export default function PropertyLocationFields({ disabled, province, district, ward, onChange }: PropertyLocationFieldsProps) {
  return (
    <div style={{ opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? "none" : "auto" }}>
      {disabled && (
        <p className="text-white/25 mb-3 flex items-center gap-1.5" style={{ fontSize: "0.74rem" }}>
          <span className="w-1 h-1 rounded-full bg-amber-400 inline-block" />
          Vui lòng chọn Loại bất động sản và mục đích trước
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SelectWrapper label="Tỉnh/Thành phố">
          <select
            value={province}
            onChange={(e) => { onChange("province", e.target.value); onChange("district", ""); onChange("ward", ""); }}
            style={selectStyle}
          >
            <option value="">Chọn tỉnh/thành</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p} style={{ background: "#0f1829" }}>{p}</option>
            ))}
          </select>
        </SelectWrapper>

        <SelectWrapper label="Quận/Huyện">
          <select
            value={district}
            onChange={(e) => { onChange("district", e.target.value); onChange("ward", ""); }}
            disabled={!province}
            style={{ ...selectStyle, opacity: province ? 1 : 0.45 }}
          >
            <option value="">{province ? "Chọn quận/huyện" : "Chọn tỉnh/thành trước"}</option>
          </select>
        </SelectWrapper>

        <SelectWrapper label="Phường/Xã">
          <select
            value={ward}
            onChange={(e) => onChange("ward", e.target.value)}
            disabled={!district}
            style={{ ...selectStyle, opacity: district ? 1 : 0.45 }}
          >
            <option value="">{district ? "Chọn phường/xã" : "Chọn tỉnh/thành trước"}</option>
          </select>
        </SelectWrapper>
      </div>
    </div>
  );
}
