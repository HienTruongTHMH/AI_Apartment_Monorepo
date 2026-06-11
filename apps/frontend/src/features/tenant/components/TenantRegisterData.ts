import { getProvinceNames } from "@/data/vietnam-admin";

export const ROOM_TYPES = ["Studio", "1 phòng ngủ", "2 phòng ngủ", "3 phòng ngủ", "4+ phòng ngủ"];
export const AMENITIES = ["Hồ bơi", "Gym", "Bãi xe", "An ninh 24/7", "Thú cưng", "Nội thất", "Wifi", "Hồ bơi trẻ em"];
export const PRICE_MARKS = [3, 5, 8, 12, 18, 25, 35, 50];
export const ALL_PROVINCES = getProvinceNames();

export const BUILDINGS = [
  {
    id: "B01", name: "Sunrise City North", city: "Hồ Chí Minh", district: "Quận 7",
    address: "117 Nguyễn Hữu Thọ, Quận 7, TP.HCM", rating: 4.8,
    units: ["1201", "1204", "1305", "1402", "1501", "1605", "1708", "1901"],
    price: "10–15M/tháng", img: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=200",
  },
  {
    id: "B02", name: "Vinhomes Grand Park", city: "Hồ Chí Minh", district: "TP. Thủ Đức",
    address: "Nguyễn Xiển, Long Bình, TP. Thủ Đức", rating: 4.7,
    units: ["A101", "A205", "B301", "B402", "C205", "C310", "D501"],
    price: "8–14M/tháng", img: "https://images.unsplash.com/photo-1585128792103-0b591f96512e?w=200",
  },
  {
    id: "B03", name: "The River Thủ Thiêm", city: "Hồ Chí Minh", district: "TP. Thủ Đức",
    address: "Đảo Thủ Thiêm, TP. Thủ Đức, TP.HCM", rating: 4.9,
    units: ["01A", "03B", "05C", "07A", "09B", "11C"],
    price: "14–22M/tháng", img: "https://images.unsplash.com/photo-1763401929055-43fd29000be3?w=200",
  },
  {
    id: "B04", name: "Masteri Centre Point", city: "Hồ Chí Minh", district: "TP. Thủ Đức",
    address: "36 Nguyễn Xiển, TP. Thủ Đức", rating: 4.6,
    units: ["T01-01", "T01-05", "T02-08", "T03-12", "T04-03"],
    price: "9–13M/tháng", img: "https://images.unsplash.com/photo-1774716925810-e923c8206ed5?w=200",
  },
  {
    id: "B05", name: "Sunwah Pearl", city: "Hồ Chí Minh", district: "Bình Thạnh",
    address: "90 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM", rating: 4.8,
    units: ["P01-10", "P02-15", "P03-08", "P04-22", "P05-06"],
    price: "13–25M/tháng", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200",
  },
  {
    id: "B06", name: "Botanica Premier", city: "Hồ Chí Minh", district: "Tân Bình",
    address: "Phổ Quang, Tân Bình, TP.HCM", rating: 4.5,
    units: ["S01", "S02", "S05", "S08", "S12", "S15", "S18"],
    price: "8–12M/tháng", img: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=200",
  },
  {
    id: "B07", name: "Vinhomes Smart City", city: "Hà Nội", district: "Nam Từ Liêm",
    address: "Tây Mỗ, Nam Từ Liêm, Hà Nội", rating: 4.8,
    units: ["SA1-01", "SA1-05", "SB2-08", "SB3-12", "SC1-03", "SC2-07"],
    price: "12–20M/tháng", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200",
  },
  {
    id: "B08", name: "Masteri West Heights", city: "Hà Nội", district: "Nam Từ Liêm",
    address: "Đại lộ Thăng Long, Nam Từ Liêm, Hà Nội", rating: 4.7,
    units: ["W1-101", "W1-205", "W2-310", "W3-402", "W3-508"],
    price: "14–22M/tháng", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=200",
  },
  {
    id: "B09", name: "The Zei", city: "Hà Nội", district: "Nam Từ Liêm",
    address: "8 Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm, Hà Nội", rating: 4.6,
    units: ["Z01-05", "Z02-08", "Z03-11", "Z04-14", "Z05-03"],
    price: "11–18M/tháng", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200",
  },
  {
    id: "B10", name: "Monarchy Da Nang", city: "Đà Nẵng", district: "Sơn Trà",
    address: "Bạch Đằng, Sơn Trà, Đà Nẵng", rating: 4.7,
    units: ["A-01", "A-05", "B-08", "B-12", "C-03", "C-09"],
    price: "9–16M/tháng", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200",
  },
  {
    id: "B11", name: "Ariyana Smart Condotel", city: "Đà Nẵng", district: "Ngũ Hành Sơn",
    address: "Trường Sa, Ngũ Hành Sơn, Đà Nẵng", rating: 4.5,
    units: ["AR-101", "AR-205", "AR-308", "AR-412", "AR-506"],
    price: "8–14M/tháng", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200",
  },
];

export const CITIES = ["Tất cả", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng"];
export const DISTRICTS_BY_CITY: Record<string, string[]> = {
  "Hồ Chí Minh": ["Tất cả", "TP. Thủ Đức", "Quận 7", "Bình Thạnh", "Tân Bình"],
  "Hà Nội":       ["Tất cả", "Nam Từ Liêm", "Hoàng Mai", "Cầu Giấy", "Đống Đa"],
  "Đà Nẵng":      ["Tất cả", "Sơn Trà", "Ngũ Hành Sơn", "Hải Châu", "Liên Chiểu"],
};

export type RegistrationMode = "none" | "ai" | "building";

export interface PersonalInfo {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function capitalizeWords(str: string) {
  return str.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
}

export function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

export function isPersonalInfoValid(info: PersonalInfo) {
  return (
    info.fullName.trim() &&
    info.phone.trim() &&
    info.email.trim() &&
    info.password.length >= 6 &&
    info.password === info.confirmPassword
  );
}
