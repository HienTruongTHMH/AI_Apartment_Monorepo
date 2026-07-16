# Payment Feature — Design Document

**Ngày:** 2026-07-16  
**Status:** ✅ Validated — Ready for Implementation

---

## Understanding Summary

| # | Điểm |
|---|---|
| 1 | **Cái gì:** Hệ thống sinh và xác nhận hóa đơn tiền thuê hàng tháng |
| 2 | **Tại sao:** `Payment` hiện tại không có `type`, `method`, `dueDate` — không đủ để quản lý vòng đời hóa đơn |
| 3 | **Cho ai:** Tenant (xem hóa đơn + QR), Owner (xác nhận đã nhận tiền) |
| 4 | **Workflow:** Cron sinh hóa đơn 4 ngày trước → Tenant chuyển khoản thủ công → Owner xác nhận → Paid |
| 5 | **Overdue:** Cron đánh dấu Overdue khi dueDate qua mà vẫn Pending |
| 6 | **Ngoài scope:** Push notification, email, payment gateway, Deposit record |
| 7 | **Đã xong rồi:** Contract activation (deposit + tháng đầu xử lý offline) |

---

## Assumptions

| # | Giả định | Trạng thái |
|---|---|---|
| A1 | X = 4 ngày — hardcode trong cron, không lưu DB | ✅ Xác nhận |
| A2 | `billingDay` không cần — lấy `startDate.day` từ Contract | ✅ Xác nhận |
| A3 | `Deposit` KHÔNG tạo Payment record ở Phase này | ✅ Xác nhận |
| A4 | `paymentDate` = lúc Owner nhấn xác nhận (không phải Tenant) | ✅ Xác nhận |
| A5 | `method` = null lúc tạo, set `BankTransfer` khi Owner confirm | ✅ Xác nhận |
| A6 | Không cần intermediate state — chỉ `Pending → Paid` | ✅ Xác nhận |

---

## Decision Log

### D1 — Phương án Schema: Minimal + Extensible
- **Quyết định:** Chọn Phương án 1 (Minimal + Extensible)
- **Alternatives:** Ultra-Minimal (thiếu enum, cần migrate lại); Full (quá nhiều, break ContractStatus)
- **Lý do:** Thay đổi nhỏ nhất có thể, nhưng enum sẵn sàng cho Phase sau — không cần migration lần 2

### D2 — Không thêm `PendingPayment` vào ContractStatus
- **Quyết định:** Giữ nguyên `ContractStatus`
- **Alternatives:** Thêm `PendingPayment` như đề xuất của bạn bè
- **Lý do:** Contract activation đã xử lý xong. Thêm vào sẽ break flow đang chạy

### D3 — Không thêm `billingDay` vào Contract
- **Quyết định:** Dùng `startDate.day` để tính ngày sinh hóa đơn
- **Alternatives:** Lưu `billingDay Int` trên Contract
- **Lý do:** YAGNI — chưa có use case nào cần override billingDay khác startDate

### D4 — `paymentDate` do Owner trigger, không phải Tenant
- **Quyết định:** `paymentDate` = `now()` lúc Owner gọi `/payments/:id/confirm`
- **Alternatives:** Tenant tự nhập paymentDate; Tenant nhấn "Đã chuyển" để set paymentDate
- **Lý do:** Đơn giản nhất, không cần intermediate state, chỉ 1 action có authority là Owner

### D5 — `method` nullable, không có default
- **Quyết định:** `method PaymentMethod?` — null cho đến khi Owner confirm, sau đó set `BankTransfer`
- **Alternatives:** `method PaymentMethod @default(BankTransfer)`
- **Lý do:** Tránh confusion giữa "chưa thanh toán" vs "đã thanh toán bằng BankTransfer"

---

## Final Design

### Schema Changes

```prisma
// === THAY ĐỔI model Payment ===
model Payment {
  id          String         @id @default(uuid())
  amount      Decimal        @db.Decimal(12, 2)
  status      PaymentStatus  @default(Pending)
  type        PaymentType    @default(Rent)     // MỚI
  method      PaymentMethod?                    // MỚI: null → BankTransfer khi confirm
  dueDate     DateTime?                         // MỚI: ngày hết hạn
  paymentDate DateTime?                         // SỬA: bỏ @default(now()), thành optional
  contractId  String
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  contract    Contract       @relation(fields: [contractId], references: [id])

  @@index([contractId])
  @@index([status])                             // MỚI: để cron query nhanh
}

// === THÊM enum PaymentType ===
enum PaymentType {
  Rent        // Phase này
  Deposit     // Phase sau
  Penalty     // Phase sau
  Other       // Phase sau
}

// === THÊM enum PaymentMethod ===
enum PaymentMethod {
  BankTransfer  // Phase này
  Cash          // Phase sau
  System        // Phase sau: payment gateway
}

// === SỬA enum PaymentStatus ===
enum PaymentStatus {
  Pending
  Paid
  Failed
  Overdue     // MỚI
}
```

**Không thay đổi:** `Contract`, `ContractStatus`, và tất cả model khác.

---

### Data Flow

#### Cron Job 1 — Sinh hóa đơn (00:00 mỗi đêm)

```
1. Query: Contract WHERE status = Active
2. Với mỗi contract:
   a. targetDay  = startDate.day của tháng hiện tại (handle ngày 29/30/31 → endOfMonth)
   b. invoiceDay = targetDay - 4
   c. Nếu TODAY = invoiceDay:
      - Guard: đã có Payment { contractId, type=Rent, dueDate trong tháng này } chưa?
      - Nếu chưa: INSERT Payment {
          amount      = contract.rentPrice,
          status      = Pending,
          type        = Rent,
          method      = null,
          dueDate     = targetDay,
          paymentDate = null
        }
```

#### Cron Job 2 — Đánh dấu Overdue (00:00 mỗi đêm, sau Job 1)

```
UPDATE Payment
SET status = Overdue
WHERE status = Pending
  AND dueDate < NOW()
```

#### API Endpoints

```
[Owner] GET  /payments?contractId=xxx
        → Danh sách hóa đơn (filter theo contract)

[Owner] GET  /payments/pending
        → Tất cả hóa đơn Pending/Overdue của Owner

[Owner] PATCH /payments/:id/confirm
        Guard: status IN [Pending, Overdue] — nếu đã Paid → 400
        Guard: payment.contract.ownerId === currentUser.ownerProfile.id
        Action: UPDATE { status=Paid, method=BankTransfer, paymentDate=now() }

[Tenant] GET /payments?contractId=xxx
         → Xem hóa đơn + QR data từ OwnerProfile.bankAccount
```

---

### Edge Cases

| Edge Case | Giải pháp |
|---|---|
| Contract Expired/Terminated | Cron Job 1 chỉ query `Active` → tự động bỏ qua |
| startDate.day = 29/30/31 | Dùng `endOfMonth()` nếu ngày không tồn tại trong tháng |
| Owner confirm Payment Overdue | Cho phép — guard chỉ chặn `Paid` |
| Owner confirm 2 lần | Guard: `status !== Paid` → nếu đã Paid trả `400 Bad Request` |
| Contract Terminated, còn hóa đơn Pending | Giữ nguyên — Owner xử lý offline (ngoài scope) |
| Cron chạy 2 lần cùng ngày | Idempotency guard: check đã có Payment cùng contractId + tháng/năm chưa |

---

## Implementation Plan

### Phase 1 — Schema Migration
- [ ] Sửa `Payment` model: thêm `type`, `method`, `dueDate`, bỏ `@default(now())` khỏi `paymentDate`
- [ ] Thêm `PaymentType`, `PaymentMethod` enum
- [ ] Thêm `Overdue` vào `PaymentStatus`
- [ ] Thêm `@@index([status])` vào `Payment`
- [ ] Chạy `prisma migrate dev`

### Phase 2 — Cron Jobs (NestJS `@nestjs/schedule`)
- [ ] `BillingCronService` — Cron Job 1: sinh hóa đơn hàng tháng
- [ ] `OverdueCronService` — Cron Job 2: đánh dấu quá hạn
- [ ] Unit test cho idempotency guard và edge case ngày 29/30/31

### Phase 3 — API Endpoints
- [ ] `GET /payments` (Owner + Tenant, filter by contractId)
- [ ] `GET /payments/pending` (Owner)
- [ ] `PATCH /payments/:id/confirm` (Owner only)
- [ ] Authorization guard: ownerId check
- [ ] Integration test cho confirm flow

### Phase 4 — Frontend Integration
- [ ] Owner: danh sách hóa đơn + nút "Xác nhận đã nhận tiền"
- [ ] Tenant: danh sách hóa đơn + hiển thị QR VietQR
- [ ] Badge trạng thái: Pending / Overdue / Paid
