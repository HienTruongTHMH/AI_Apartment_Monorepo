import { PenLine, Shield, Lock, Zap, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export type ContractRecord = {
  id: string; tenant: string; email?: string; phone?: string;
  unit: string; property: string; start: string; end: string;
  rent: number; deposit: number; status: string; signed: string | null; payDay: number;
};

export const INITIAL_CONTRACTS: ContractRecord[] = [
  { id: "HD-2025-001", tenant: "Nguyễn Văn An",   email: "an.nguyen@email.com",  phone: "0901 234 567", unit: "VGP-SC-1204", property: "Vinhomes Grand Park",   start: "01/01/2025", end: "31/12/2025", rent: 10500000, deposit: 21000000, status: "active",  signed: "28/12/2024", payDay: 5  },
  { id: "HD-2025-002", tenant: "Lê Thị Hương",    email: "huong.le@email.com",   phone: "0912 345 678", unit: "VGP-803",     property: "Vinhomes Grand Park",   start: "01/02/2025", end: "31/01/2026", rent: 10500000, deposit: 21000000, status: "active",  signed: "28/01/2025", payDay: 1  },
  { id: "HD-2025-003", tenant: "Võ Thị Kim Ngân", email: "ngan.vo@email.com",    phone: "0923 456 789", unit: "TR-1502",     property: "Tropic Garden",         start: "15/03/2025", end: "14/03/2026", rent: 13500000, deposit: 27000000, status: "pending", signed: null,          payDay: 15 },
  { id: "HD-2024-018", tenant: "Bùi Thanh Tùng",  email: "tung.bui@email.com",   phone: "0934 567 890", unit: "MCP-401",     property: "Masteri Centre Point",  start: "01/06/2024", end: "31/05/2025", rent: 17000000, deposit: 34000000, status: "expired", signed: "29/05/2024",  payDay: 1  },
  { id: "HD-2025-004", tenant: "Hoàng Thị Mai",   email: "mai.hoang@email.com",  phone: "0945 678 901", unit: "EH-PH-02",   property: "The Estella Heights",   start: "01/04/2025", end: "31/03/2026", rent: 26000000, deposit: 52000000, status: "pending", signed: null,          payDay: 1  },
];

export const PROPERTIES = ["Vinhomes Grand Park", "Masteri Centre Point", "The Estella Heights", "Eco Green Saigon", "Tropic Garden", "Sunwah Pearl", "Gateway Thảo Điền"];

export const FEATURES = [
  { icon: PenLine,  title: "Ký kết điện tử",     desc: "Ký hợp đồng ngay trên nền tảng — hợp lệ pháp lý theo Nghị định 130/2018/NĐ-CP.", color: "#22d3ee" },
  { icon: Shield,   title: "Xác thực danh tính",  desc: "Tích hợp eKYC qua CCCD gắn chip — xác minh hai phía trước khi ký.",               color: "#10b981" },
  { icon: Lock,     title: "Lưu trữ bảo mật",     desc: "AES-256 mã hóa, lưu trên MinIO private cloud — không bên thứ ba nào truy cập.",   color: "#a78bfa" },
  { icon: Zap,      title: "Tự động nhắc hạn",    desc: "Email + push notification trước 30, 15, 7 ngày hết hạn hợp đồng.",               color: "#f59e0b" },
];

export const statusMeta: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  active:  { label: "Đang hiệu lực", color: "#10b981", bg: "#10b98118", icon: CheckCircle2 },
  pending: { label: "Chờ ký",        color: "#f59e0b", bg: "#f59e0b18", icon: Clock        },
  expired: { label: "Hết hạn",       color: "#6b7280", bg: "#6b728018", icon: AlertCircle  },
};

export const DURATION_OPTIONS = [
  { value: "6",  label: "6 tháng" },
  { value: "12", label: "12 tháng" },
  { value: "24", label: "24 tháng" },
];

export function addMonths(dateStr: string, months: number): string {
  const [d, m, y] = dateStr.split("/").map(Number);
  const dt = new Date(y, m - 1 + months, d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
}
