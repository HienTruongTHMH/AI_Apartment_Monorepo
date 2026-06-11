import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, ChevronRight, CheckCircle2,
  MapPin, Building2, Search, Hash, Star, Bot,
} from "lucide-react";
import {
  BUILDINGS, CITIES, DISTRICTS_BY_CITY,
  type PersonalInfo, isPersonalInfoValid,
} from "@features/tenant/components/TenantRegisterData";
import PersonalInfoStep from "@features/tenant/components/PersonalInfoStep";
import RegisterDoneScreen from "@features/tenant/components/RegisterDoneScreen";

interface BuildingRegisterFlowProps {
  onBack: () => void;
}

export default function BuildingRegisterFlow({ onBack }: BuildingRegisterFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [attempted, setAttempted] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Tất cả");
  const [selectedDistrict, setSelectedDistrict] = useState("Tất cả");
  const [buildingSearch, setBuildingSearch] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<typeof BUILDINGS[number] | null>(null);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [info, setInfo] = useState<PersonalInfo>({ fullName: "", phone: "", email: "", password: "", confirmPassword: "" });

  const districtOptions = selectedCity !== "Tất cả" ? (DISTRICTS_BY_CITY[selectedCity] ?? ["Tất cả"]) : ["Tất cả"];

  const filteredBuildings = BUILDINGS.filter((b) => {
    const matchCity = selectedCity === "Tất cả" || b.city === selectedCity;
    const matchDistrict = selectedDistrict === "Tất cả" || b.district === selectedDistrict;
    const matchSearch = !buildingSearch || b.name.toLowerCase().includes(buildingSearch.toLowerCase()) || b.address.toLowerCase().includes(buildingSearch.toLowerCase());
    return matchCity && matchDistrict && matchSearch;
  });

  const canNext = () => {
    if (step === 1) return !!selectedBuilding && !!selectedUnit;
    if (step === 2) return !!isPersonalInfoValid(info);
    return true;
  };

  const handleNext = () => {
    if (!canNext()) { setAttempted(true); return; }
    if (step < 3) { setStep((s) => (s + 1) as 1 | 2 | 3); setAttempted(false); }
    else {
      try {
        localStorage.setItem("nv-tenant-user", JSON.stringify({
          name: info.fullName, email: info.email,
          unit: selectedUnit, buildingName: selectedBuilding?.name,
          city: selectedBuilding?.city, district: selectedBuilding?.district,
        }));
      } catch {}
      try {
        const existing = JSON.parse(localStorage.getItem("nv-building-tenants") || "[]");
        const newTenant = {
          name: info.fullName, email: info.email, phone: info.phone,
          unit: selectedUnit, buildingName: selectedBuilding?.name,
          registeredAt: new Date().toLocaleDateString("vi-VN"),
          status: "pending",
        };
        localStorage.setItem("nv-building-tenants", JSON.stringify([...existing, newTenant]));
      } catch {}
      setDone(true);
    }
  };

  if (done) return <RegisterDoneScreen mode="building" info={info} building={selectedBuilding ?? undefined} unit={selectedUnit} />;

  const stepLabels = ["Chọn tòa nhà & phòng", "Thông tin cá nhân", "Xác nhận"];

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-white/40 hover:text-white/70 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Building2 size={14} className="text-white" />
          </div>
          <span className="text-white font-bold" style={{ fontSize: "0.95rem" }}>Đăng ký vào tòa nhà</span>
        </div>
      </div>

      <div className="flex items-center gap-0 mb-8">
        {stepLabels.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const active = step === n; const completed = step > n;
          return (
            <div key={n} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${completed ? "bg-violet-500" : active ? "bg-gradient-to-br from-violet-500 to-purple-600" : "bg-white/10"}`} style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                  {completed ? <CheckCircle2 size={15} className="text-white" /> : <span className="text-white">{n}</span>}
                </div>
                <span className={`mt-1.5 text-center ${active ? "text-white" : "text-white/40"}`} style={{ fontSize: "0.65rem", fontWeight: active ? 600 : 400, whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px mx-2 mb-5 transition-colors ${completed ? "bg-violet-500/50" : "bg-white/10"}`} />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} transition={{ duration: 0.22 }}>
          {step === 1 && (
            <div className="space-y-5">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" placeholder="Tìm tên tòa nhà, địa chỉ..." value={buildingSearch}
                  onChange={(e) => setBuildingSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl py-3 pl-9 pr-4 text-white placeholder-white/25 outline-none focus:border-violet-500/50 transition-colors"
                  style={{ fontSize: "0.875rem" }} />
              </div>

              <div className="flex gap-2 flex-wrap">
                {CITIES.map((c) => (
                  <button key={c} onClick={() => { setSelectedCity(c); setSelectedDistrict("Tất cả"); setSelectedBuilding(null); setSelectedUnit(""); }}
                    className={`px-3.5 py-1.5 rounded-full border transition-all font-semibold ${selectedCity === c ? "bg-violet-600/25 border-violet-500 text-violet-300" : "bg-white/5 border-white/12 text-white/45 hover:border-white/28"}`}
                    style={{ fontSize: "0.78rem" }}>
                    {c === "Tất cả" ? "🇻🇳 Tất cả" : c === "Hồ Chí Minh" ? "🏙 TP.HCM" : c === "Hà Nội" ? "🏛 Hà Nội" : "🌊 Đà Nẵng"}
                  </button>
                ))}
              </div>

              {selectedCity !== "Tất cả" && (
                <div className="flex gap-2 flex-wrap">
                  {districtOptions.map((d) => (
                    <button key={d} onClick={() => setSelectedDistrict(d)}
                      className={`px-3 py-1 rounded-full border transition-all ${selectedDistrict === d ? "bg-violet-500/15 border-violet-500/60 text-violet-400" : "bg-white/4 border-white/10 text-white/38 hover:border-white/22"}`}
                      style={{ fontSize: "0.73rem" }}>{d}</button>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <p className="text-white/50" style={{ fontSize: "0.75rem" }}>{filteredBuildings.length} tòa nhà</p>
                {filteredBuildings.map((building) => (
                  <motion.div key={building.id} whileHover={{ y: -1 }}
                    onClick={() => { setSelectedBuilding(building); setSelectedUnit(""); }}
                    className={`rounded-2xl border transition-all cursor-pointer overflow-hidden ${selectedBuilding?.id === building.id ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                    <div className="flex items-center gap-4 p-4">
                      <img src={building.img} alt={building.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-white font-bold truncate" style={{ fontSize: "0.9rem" }}>{building.name}</p>
                          {selectedBuilding?.id === building.id && <CheckCircle2 size={15} className="text-violet-400 flex-shrink-0" />}
                        </div>
                        <p className="text-white/50 flex items-center gap-1" style={{ fontSize: "0.75rem" }}><MapPin size={11} />{building.address}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-violet-400 font-semibold" style={{ fontSize: "0.78rem" }}>{building.price}</span>
                          <span className="flex items-center gap-0.5 text-amber-400" style={{ fontSize: "0.72rem" }}>
                            <Star size={11} className="fill-amber-400" />{building.rating}
                          </span>
                          <span className="text-white/40" style={{ fontSize: "0.7rem" }}>{building.units.length} phòng trống</span>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {selectedBuilding?.id === building.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="border-t border-violet-500/30 px-4 pb-4 pt-3" style={{ overflow: "hidden" }}>
                          <p className="text-white/60 mb-2.5" style={{ fontSize: "0.78rem", fontWeight: 600 }}>Chọn căn hộ / phòng:</p>
                          <div className="flex flex-wrap gap-2">
                            {building.units.map((unit) => (
                              <button key={unit} onClick={(e) => { e.stopPropagation(); setSelectedUnit(unit); }}
                                className={`px-3 py-1.5 rounded-xl border font-mono transition-all flex items-center gap-1.5 ${selectedUnit === unit ? "bg-violet-500 border-violet-400 text-white" : "bg-white/5 border-white/20 text-white/60 hover:border-violet-400/50 hover:text-white/80"}`}
                                style={{ fontSize: "0.82rem" }}>
                                <Hash size={11} />{unit}
                              </button>
                            ))}
                          </div>
                          {attempted && !selectedUnit && <p className="mt-2 text-red-400" style={{ fontSize: "0.72rem" }}>Vui lòng chọn một căn hộ</p>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
                {filteredBuildings.length === 0 && (
                  <div className="text-center py-10 text-white/30" style={{ fontSize: "0.85rem" }}>Không tìm thấy tòa nhà phù hợp</div>
                )}
              </div>
              {attempted && !selectedBuilding && (
                <p className="text-red-400" style={{ fontSize: "0.75rem" }}>Vui lòng chọn một tòa nhà</p>
              )}
            </div>
          )}

          {step === 2 && (
            <PersonalInfoStep info={info} onChange={(u) => setInfo((p) => ({ ...p, ...u }))} attempted={attempted} />
          )}

          {step === 3 && selectedBuilding && (
            <div className="space-y-4">
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-2xl p-5">
                <p className="text-white font-bold mb-3" style={{ fontSize: "0.95rem" }}>Xác nhận đăng ký</p>
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-violet-500/20">
                  <img src={selectedBuilding.img} alt={selectedBuilding.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold" style={{ fontSize: "0.9rem" }}>{selectedBuilding.name}</p>
                    <p className="text-white/60" style={{ fontSize: "0.78rem" }}>{selectedBuilding.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-mono" style={{ fontSize: "0.75rem" }}>Phòng {selectedUnit}</span>
                      <span className="text-white/40" style={{ fontSize: "0.72rem" }}>{selectedBuilding.price}</span>
                    </div>
                  </div>
                </div>
                {[
                  { icon: Building2, label: "Họ tên", val: info.fullName },
                  { icon: Building2, label: "Email", val: info.email },
                  { icon: Building2, label: "Điện thoại", val: info.phone },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center gap-3 py-1.5">
                    <span className="text-white/50" style={{ fontSize: "0.78rem", width: "80px" }}>{label}</span>
                    <span className="text-white" style={{ fontSize: "0.875rem" }}>{val}</span>
                  </div>
                ))}
              </div>
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 flex items-start gap-3">
                <Bot size={15} className="text-violet-400 flex-shrink-0 mt-0.5" />
                <p className="text-violet-300" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
                  Sau khi đăng ký, AI Agent sẽ tự động thông báo tới quản lý tòa nhà <strong>{selectedBuilding.name}</strong>. Yêu cầu sẽ được xét duyệt trong 1–2 ngày làm việc.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <button onClick={() => step > 1 ? setStep((s) => (s - 1) as 1 | 2 | 3) : onBack()}
          className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
          style={{ fontSize: "0.875rem" }}>
          <ChevronLeft size={16} />{step > 1 ? "Quay lại" : "Chọn lại"}
        </button>
        <button onClick={handleNext}
          className={`flex items-center gap-2 px-7 py-3 rounded-full font-semibold transition-all ${
            canNext() ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-violet-500/20" : "bg-white/10 text-white/40 cursor-not-allowed"
          }`}
          style={{ fontSize: "0.9rem" }}>
          {step === 3 ? "Xác nhận đăng ký" : "Tiếp theo"}<ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
