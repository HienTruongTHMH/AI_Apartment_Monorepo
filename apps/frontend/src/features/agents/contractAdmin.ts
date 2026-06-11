// ============================================================
// Agent 4 — Contract & Admin (Web)
// Nhiệm vụ: Pháp lý & Kế toán Tự động
// Giai đoạn: Billing & Operations
// ============================================================
// TODO (team): Thay mock bằng gọi API thực:
//
//   GET  /api/contracts/:userId/current
//   Response: Contract
//
//   POST /api/contracts
//   Body: ContractDraft → Response: { contractId, pdfUrl, signUrl }
//
//   POST /api/payments/vietqr
//   Body: { contractId, month, year }
//   Response: { qrData, amount, bankAccount, ref, expiredAt }
//
//   GET  /api/invoices?userId=&month=&year=
//   Response: { items: InvoiceItem[], total, status }
//
//   POST /api/payments/webhook  ← nhận từ ngân hàng, reconcile tự động
// ============================================================

export type ContractStatus = "active" | "expiring_soon" | "expired" | "pending_sign";
export type PaymentStatus  = "paid" | "pending" | "overdue";

export interface Contract {
  id:          string;
  code:        string;
  tenantId:    string;
  landlordId:  string;
  unitId:      string;
  unitName:    string;
  buildingName: string;
  startDate:   string;
  endDate:     string;
  monthlyRent: number;
  deposit:     number;
  status:      ContractStatus;
  pdfUrl?:     string;
}

export interface InvoiceItem {
  label:    string;
  quantity: number;
  unit:     string;
  unitPrice: number;
  total:    number;
}

export interface Invoice {
  id:       string;
  code:     string;
  month:    number;
  year:     number;
  items:    InvoiceItem[];
  subtotal: number;
  vat:      number;
  total:    number;
  status:   PaymentStatus;
  dueDate:  string;
  paidAt?:  string;
  qrData?:  string;
}

export interface VietQRPayload {
  bankCode:    string;
  accountNo:   string;
  accountName: string;
  amount:      number;
  description: string;
  qrData:      string;
}

// ─── Mock data (thay bằng data thực từ API) ─────────────────
export const MOCK_CONTRACT: Contract = {
  id:           "c-001",
  code:         "HD-2025-001",
  tenantId:     "u-001",
  landlordId:   "l-001",
  unitId:       "u-12a",
  unitName:     "Phòng 12A",
  buildingName: "Central Tower",
  startDate:    "2025-01-01",
  endDate:      "2025-12-31",
  monthlyRent:  8_500_000,
  deposit:      17_000_000,
  status:       "active",
};

export const MOCK_INVOICE: Invoice = {
  id:   "inv-2025-05",
  code: "INV-2025-05-001",
  month: 5, year: 2025,
  items: [
    { label: "Tiền thuê",      quantity: 1,   unit: "tháng", unitPrice: 8_500_000, total: 8_500_000 },
    { label: "Phí quản lý 5%", quantity: 1,   unit: "lần",   unitPrice: 425_000,   total: 425_000   },
    { label: "Điện",           quantity: 120, unit: "số",    unitPrice: 3_500,      total: 420_000   },
    { label: "Nước",           quantity: 8,   unit: "m³",    unitPrice: 15_000,     total: 120_000   },
    { label: "Internet",       quantity: 1,   unit: "tháng", unitPrice: 200_000,   total: 200_000   },
    { label: "Phí gửi xe",    quantity: 1,   unit: "tháng", unitPrice: 150_000,   total: 150_000   },
  ],
  subtotal: 9_815_000,
  vat:      0,
  total:    9_815_000,
  status:   "pending",
  dueDate:  "2025-05-10",
};

// ─── Calculation helpers ─────────────────────────────────────
export function calcInvoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}

export function daysUntilExpiry(endDate: string): number {
  return Math.floor((new Date(endDate).getTime() - Date.now()) / 86_400_000);
}

// ─── Mock VietQR generator (thay bằng API thực) ─────────────
// TODO (team): Gọi POST /api/payments/vietqr và dùng qrData từ response
export function generateMockVietQR(invoice: Invoice, contract: Contract): VietQRPayload {
  return {
    bankCode:    "VCB",
    accountNo:   "1234567890",
    accountName: "CONG TY NESTAV IET AI",
    amount:      invoice.total,
    description: `${contract.code} T${invoice.month}/${invoice.year}`,
    qrData:      `00020101021238570010A000000727012700069704220113123456789000208QRIBFTTA5303704540${invoice.total}5802VN62${Math.random().toString(36).slice(2, 8).toUpperCase()}6304`,
  };
}
