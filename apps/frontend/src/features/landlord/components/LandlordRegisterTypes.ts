export const BUILDING_TYPES = ["Chung cư mini", "Chung cư căn hộ", "Tòa nhà văn phòng cho thuê", "Nhà phố / biệt thự", "Khu đô thị"];
export const UNIT_TYPES = ["Studio", "1 phòng ngủ", "2 phòng ngủ", "3 phòng ngủ", "4+ phòng ngủ", "Duplex / Penthouse"];
export const BANKS = ["Vietcombank", "BIDV", "Agribank", "Techcombank", "VPBank", "MB Bank", "ACB", "Sacombank", "TPBank", "OCB"];
export const SERVICES = ["Hợp đồng điện tử", "Thu tiền online", "Báo cáo tài chính", "Quản lý bảo trì", "Gửi thông báo tự động", "Tích hợp camera"];

export type Section = 1 | 2 | 3 | 4;

export interface LandlordFormData {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  buildingName: string;
  buildingType: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  floors: string;
  totalUnits: string;
  unitTypes: string[];
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  businessLicense: string;
  propertyDoc: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  services: string[];
}

export const initialFormData: LandlordFormData = {
  fullName: "", idNumber: "", phone: "", email: "", password: "", confirmPassword: "",
  buildingName: "", buildingType: "", address: "", ward: "", district: "", city: "TP.HCM",
  floors: "", totalUnits: "", unitTypes: [], priceMin: "", priceMax: "", areaMin: "", areaMax: "",
  businessLicense: "", propertyDoc: "",
  bankName: "", accountNumber: "", accountHolder: "",
  services: [],
};

export const inputCls =
  "w-full bg-white/5 border border-white/15 rounded-xl py-2.5 pl-9 pr-4 text-white placeholder-white/25 outline-none focus:border-violet-500/50 transition-colors";
export const inputStyle = { fontSize: "0.875rem" };

export function capitalizeWords(str: string) {
  return str.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
}
export function digitsOnly(str: string, max?: number) {
  const d = str.replace(/\D/g, "");
  return max ? d.slice(0, max) : d;
}
export function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}
