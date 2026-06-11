import { useMemo, useState } from "react";
import { Building2, MapPin, Home, Search, Hash, CreditCard } from "lucide-react";
import { getAllWardsInProvince } from "@/data/vietnam-admin";
import { getProvinceNames } from "@/data/vietnam-admin";
import {
  type LandlordFormData, BUILDING_TYPES, UNIT_TYPES, digitsOnly,
} from "@features/landlord/components/LandlordRegisterTypes";
import { Field, inputCls, inputStyle } from "@features/landlord/components/LandlordRegisterHelpers";

const ALL_PROVINCES = getProvinceNames();

interface Props {
  form: LandlordFormData;
  set: (key: keyof LandlordFormData, val: string) => void;
  toggleArr: (key: "unitTypes" | "services", val: string) => void;
  onCityChange: (city: string) => void;
  wardSearch: string;
  setWardSearch: (v: string) => void;
}

export default function LandlordSection2Building({ form, set, toggleArr, onCityChange, wardSearch, setWardSearch }: Props) {
  const allWards = useMemo(() => getAllWardsInProvince(form.city), [form.city]);
  const filteredWards = useMemo(
    () => wardSearch.trim() ? allWards.filter((w) => w.name.toLowerCase().includes(wardSearch.toLowerCase())) : allWards,
    [allWards, wardSearch]
  );

  return (
    <div className="space-y-5">
      <p className="text-white font-semibold" style={{ fontSize: "1rem" }}>Thông tin tòa nhà / chung cư</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Tên tòa nhà *" icon={Building2}>
          <input type="text" placeholder="VD: Vinhomes Central Park" value={form.buildingName}
            onChange={(e) => set("buildingName", e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Loại hình *" icon={Home}>
          <select value={form.buildingType} onChange={(e) => set("buildingType", e.target.value)}
            className={inputCls + " cursor-pointer"} style={{ ...inputStyle, colorScheme: "dark" }}>
            <option value="" disabled>Chọn loại...</option>
            {BUILDING_TYPES.map((t) => <option key={t} value={t} className="bg-[#0A0F1E]">{t}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Địa chỉ đầy đủ *" icon={MapPin}>
        <input type="text" placeholder="Số nhà, tên đường" value={form.address}
          onChange={(e) => set("address", e.target.value)}
          className={inputCls} style={inputStyle} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Tỉnh / Thành phố *" icon={MapPin}>
          <select value={form.city} onChange={(e) => onCityChange(e.target.value)}
            className={inputCls + " cursor-pointer appearance-none"} style={{ ...inputStyle, colorScheme: "dark" }}>
            {ALL_PROVINCES.map((p) => <option key={p} value={p} className="bg-[#0A0F1E]">{p}</option>)}
          </select>
        </Field>
        <Field label="Phường / Xã *" icon={MapPin}>
          <div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                type="text"
                placeholder="Tìm phường/xã..."
                value={wardSearch}
                onChange={(e) => setWardSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-t-xl py-2.5 pl-8 pr-3 text-white placeholder-white/25 outline-none focus:border-violet-500/50 transition-colors"
                style={{ fontSize: "0.82rem" }}
              />
            </div>
            <div className="border border-t-0 border-white/15 rounded-b-xl overflow-hidden" style={{ maxHeight: "9rem", overflowY: "auto" }}>
              {filteredWards.length === 0 ? (
                <p className="px-3 py-2 text-white/30" style={{ fontSize: "0.78rem" }}>
                  {wardSearch ? "Không tìm thấy" : "Chọn tỉnh/thành phố trước"}
                </p>
              ) : (
                filteredWards.map((w) => (
                  <button
                    key={w.name}
                    type="button"
                    onClick={() => set("ward", w.name)}
                    className={`w-full text-left px-3 py-2 transition-colors border-b border-white/5 last:border-0 ${
                      form.ward === w.name ? "bg-violet-500/25 text-violet-300" : "text-white/65 hover:bg-white/8"
                    }`}
                    style={{ fontSize: "0.82rem" }}
                  >
                    {form.ward === w.name && <span className="mr-1.5">✓</span>}{w.name}
                  </button>
                ))
              )}
            </div>
            {form.ward && (
              <p className="mt-1 text-violet-400" style={{ fontSize: "0.72rem" }}>Đã chọn: {form.ward}</p>
            )}
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Số tầng *" icon={Building2}>
          <input type="number" placeholder="20" value={form.floors}
            onChange={(e) => set("floors", digitsOnly(e.target.value))}
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Tổng số căn hộ *" icon={Hash}>
          <input type="number" placeholder="120" value={form.totalUnits}
            onChange={(e) => set("totalUnits", digitsOnly(e.target.value))}
            className={inputCls} style={inputStyle} />
        </Field>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Field label="Diện tích từ (m²)" icon={Home}>
          <input type="number" placeholder="30" value={form.areaMin}
            onChange={(e) => set("areaMin", e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Diện tích đến (m²)" icon={Home}>
          <input type="number" placeholder="150" value={form.areaMax}
            onChange={(e) => set("areaMax", e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Giá từ (triệu/tháng)" icon={CreditCard}>
          <input type="number" placeholder="5" value={form.priceMin}
            onChange={(e) => set("priceMin", e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
        <Field label="Giá đến (triệu/tháng)" icon={CreditCard}>
          <input type="number" placeholder="30" value={form.priceMax}
            onChange={(e) => set("priceMax", e.target.value)}
            className={inputCls} style={inputStyle} />
        </Field>
      </div>

      <div>
        <label className="block text-white/70 mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
          Loại căn hộ cung cấp
        </label>
        <div className="flex flex-wrap gap-2">
          {UNIT_TYPES.map((u) => (
            <button key={u} onClick={() => toggleArr("unitTypes", u)}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                form.unitTypes.includes(u)
                  ? "bg-violet-500/20 border-violet-500 text-violet-400"
                  : "bg-white/5 border-white/15 text-white/50 hover:border-white/30"
              }`}
              style={{ fontSize: "0.8rem" }}>
              {u}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
