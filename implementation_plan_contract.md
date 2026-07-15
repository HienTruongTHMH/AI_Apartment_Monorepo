# Kế Hoạch Triển Khai Module 2: Hệ Thống Hợp Đồng (Contract System)

Dựa trên phân tích kỹ lưỡng file `schema.prisma` và `contract.service.ts`, đây là quy trình nghiệp vụ chuẩn xác 100% với Database hiện tại.

## 1. Flow Chức Năng (Workflow) & Vòng Đời Hợp Đồng

### Giai đoạn 1: Khởi Tạo Yêu Cầu Thuê (Rental Request)
1. **Khách thuê (Tenant)** (đã đăng nhập, có `Account` và `TenantProfile` đang ở trạng thái `isActive: false`) xem chi tiết căn hộ và bấm **"Yêu Cầu Thuê"**.
2. Hệ thống tạo một bản ghi `RentalRequest` với trạng thái mặc định là `Pending`. 
   - *Tham chiếu DB:* `RentalRequest.accountId` liên kết với tài khoản người thuê.
3. UI lập tức hiển thị thông tin liên lạc của Chủ nhà. Đồng thời Chủ nhà nhận được thông báo về Yêu cầu này.
4. Hai bên có thể thương lượng offline.

### Giai đoạn 2: Xét Duyệt Yêu Cầu & Tạo Hợp Đồng Nháp (Drafting)
1. Chủ nhà (Owner) vào hệ thống quản lý yêu cầu thuê (`/owner/dashboard/rental-requests`).
2. Nếu không đồng ý, Chủ nhà có thể **Từ chối**: Trạng thái `RentalRequest` -> `Rejected`.
3. Nếu đồng ý, Chủ nhà bấm **Chấp nhận / Tạo Hợp Đồng**: 
   - Trạng thái `RentalRequest` -> `Accepted`.
   - Hệ thống mở Form tạo Hợp Đồng Nháp. Chủ nhà điền `rentPrice`, `deposit`, `startDate`, `endDate`, `terms`.
   - Khi lưu, hệ thống tạo bản ghi `Contract` với trạng thái mặc định `Draft` (`contract.service.ts -> createDraft`).
   - *Lưu ý DB:* Hàm này sẽ tìm `TenantProfile.id` thông qua `accountId` của Khách thuê để gắn vào `Contract.tenantId`.
4. Sau khi chốt bản nháp, Chủ nhà bấm **"Gửi cho Khách thuê"** (`contract.service.ts -> sendToTenant`). Trạng thái Contract -> `PendingTenantSignature`.

### Giai đoạn 3: Ký Kết / Từ Chối & Kích Hoạt (Activation)
1. Khách thuê xem Hợp đồng đang chờ ký (`PendingTenantSignature`).
2. Nếu Khách thuê không đồng ý điều khoản, họ có thể **Từ chối**: Trạng thái Contract -> `RejectedByTenant` (theo `ContractStatus` enum).
3. Nếu đồng ý (đã thanh toán cọc offline), Khách thuê bấm **"Ký Hợp Đồng"** (`contract.service.ts -> tenantSign`).
4. **Các thay đổi trong Database diễn ra ĐỒNG THỜI (Transaction):**
   - `Contract.contractStatus` chuyển thành `Active`, cập nhật `signAt`.
   - `TenantProfile.isActive` chuyển thành `true` (Kích hoạt quyền cư dân chính thức).
   - `Apartment.apartmentStatus` chuyển thành `Rented`.
*(Hệ thống không can thiệp thanh toán tự động lúc này).*

### Giai đoạn 4: Chấm Dứt Hợp Đồng (Termination)
1. Khách thuê gửi yêu cầu trả phòng (`contract.service.ts -> terminateEarly`). Trạng thái Contract -> `TerminationRequested`, ghi nhận `terminationReason`.
2. Chủ nhà duyệt yêu cầu (`contract.service.ts -> approveTermination`).
3. **Các thay đổi trong Database diễn ra ĐỒNG THỜI (Transaction):**
   - `Contract.contractStatus` chuyển thành `Terminated`, cập nhật `terminateAt`.
   - `Apartment.apartmentStatus` chuyển về `Available`.
   - `TenantProfile.isActive` chuyển về `false`.

---

## 2. Các API Backend Cần Chỉnh Sửa / Bổ Sung

### Module `rental-request` (Cần khởi tạo)
- `POST /rental-request`: Khách thuê tạo yêu cầu (lưu DB `Pending`).
- `GET /rental-request/my-requests`: Danh sách yêu cầu của Khách thuê.
- `GET /rental-request/owner-requests`: Danh sách yêu cầu gửi đến Chủ nhà.
- `PATCH /rental-request/:id/accept`: Chủ nhà duyệt yêu cầu -> Đổi status thành `Accepted` (Bước đệm để tạo Contract).
- `PATCH /rental-request/:id/reject`: Chủ nhà từ chối -> Đổi status thành `Rejected`.

### Module `contract` (Đã có logic, cần khớp API)
- `POST /contract/create-draft`: Nhận `accountId` của khách thuê, tạo Contract `Draft`.
- `POST /contract/send-to-tenant`: Chuyển status `PendingTenantSignature`.
- `POST /contract/tenant-sign`: Khách thuê ký, Active hợp đồng và Profile.
- `POST /contract/tenant-reject`: Khách thuê từ chối bản nháp -> `RejectedByTenant` (Cần bổ sung hàm này vào Service).
- `POST /contract/terminate-early`: Yêu cầu kết thúc sớm.
- `POST /contract/approve-termination`: Chủ nhà duyệt kết thúc.
- `GET /contract`: Danh sách hợp đồng (Lọc theo token Owner hoặc Tenant).

---

## 3. Sự khác biệt so với Bản Kế Hoạch Lỗi Cũ:
- Đã bám sát **Enums** (`RentalRequestStatus`: Pending/Accepted/Rejected và `ContractStatus`: Draft/PendingTenantSignature/Active/Terminated/TerminationRequested/RejectedByTenant).
- Đã tách bạch rõ `accountId` và `TenantProfile.id` trong quá trình khởi tạo và ký hợp đồng.
- Bổ sung luồng "Khách thuê từ chối bản nháp" (RejectedByTenant).
- Cập nhật luồng Owner Accept Yêu cầu thuê trước khi Draft.

> [!IMPORTANT]
> **Vui lòng xem lại và xác nhận:** Đây là bản kế hoạch đã Audit với Database Schema. Nếu bạn đồng ý, hãy phản hồi **"Proceed"** để tôi khôi phục checklist và bắt tay vào code!
