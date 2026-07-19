# AI Apartment Management System - Monorepo

Chào mừng bạn đến với kho lưu trữ chính của dự án **Hệ thống Quản lý Căn hộ Tự trị ứng dụng Đa tác nhân AI (Self-Governing Apartment Management System)**.

Dự án này là một nền tảng PropTech tiên tiến, loại bỏ vai trò của quản trị viên tập trung (Admin) bằng cách ứng dụng Trí tuệ Nhân tạo để tự động hóa toàn bộ tương tác P2P (Peer-to-Peer) giữa Chủ nhà (Owner) và Người thuê (Tenant).

---

## 📖 Lịch sử Hình thành Dự án (The Origin Story)

Một trong những điều đặc biệt nhất của kho lưu trữ (repository) này là nó không được xây dựng từ đầu như một Monorepo. Ban đầu, dự án được chia thành 3 repository hoàn toàn độc lập do các thành viên trong nhóm phát triển riêng biệt:

- **Frontend (FE):** Khởi tạo và xây dựng giao diện ban đầu bởi **Long Mai**.
- **Backend Core (BE):** Phát triển kiến trúc lõi, cơ sở dữ liệu và quản lý giao dịch bởi **Hiển Trương**.
- **AI Agent Engine:** Nghiên cứu và xây dựng các tác tử AI (Listing Verifier & Super Broker) bởi **Huy Hoàng** và **Tiến Dũng**.

Sau khi các thành viên đã xây dựng thành công nền móng vững chắc cho từng phân hệ (microservice), nhóm đã quyết định quy tụ và **merge (hợp nhất)** 3 kho lưu trữ độc lập này lại thành một **Monorepo** duy nhất. Quyết định này giúp chuẩn hóa quy trình CI/CD, giải quyết triệt để các xung đột về biến môi trường, và tạo nên khối kiến trúc thống nhất như bạn đang thấy ngày hôm nay.

---

## 🚀 Hướng dẫn Cài đặt và Khởi chạy (Getting Started)

Dự án sử dụng kiến trúc Monorepo (quản lý bằng `npm workspaces`) kết hợp với Docker Compose để chạy các dịch vụ hạ tầng (Database, Redis, Qdrant).

### 1. Yêu cầu Hệ thống (Prerequisites)
Để chạy dự án trên máy cá nhân, bạn cần cài đặt sẵn:
- **Node.js** (Phiên bản >= 18.x)
- **Docker** & **Docker Compose** (Dành cho Database, Redis, Qdrant, Nginx)
- **Python** (Dành cho AI Agent)

### 2. Các bước Cài đặt (Installation)

**Bước 1: Clone dự án về máy**
```bash
git clone https://github.com/HienTruongTHMH/AI_Apartment_Monorepo.git
cd AI_Apartment_Monorepo
```

**Bước 2: Cài đặt Dependencies (Dependencies Setup)**
Vì đây là Monorepo, bạn chỉ cần chạy lệnh `install` một lần tại thư mục gốc. Hệ thống sẽ tự động cài đặt cho toàn bộ Frontend, Backend và AI Agent.
```bash
npm install
```

**Bước 3: Khởi chạy Hạ tầng (Infrastructure)**
Đảm bảo Docker đang mở trên máy bạn. Chạy lệnh sau để khởi động PostgreSQL, Redis, Qdrant và Nginx:
```bash
docker-compose up -d
```

**Bước 4: Thiết lập Biến Môi Trường (.env)**
Hãy đảm bảo bạn đã copy các file `.env.example` thành `.env` bên trong từng thư mục của `apps/frontend`, `apps/backend`, và `apps/ai-agent`, sau đó điền các thông số như URL Database, API Key của Google Gemini, v.v.

### 3. Khởi chạy toàn bộ hệ thống (Run Development)

Chỉ với một lệnh duy nhất tại thư mục gốc, thư viện `concurrently` sẽ khởi chạy đồng thời cả 3 dịch vụ (FE, BE, và AI):

```bash
npm run dev
```

Lệnh này sẽ tự động kích hoạt:
- `npm run dev -w frontend` (Next.js - Port 3000)
- `npm run start:dev -w backend` (NestJS - Port 3001)
- `npm run dev -w ai-agent` (FastAPI - Port 8000)

Bạn có thể truy cập ngay vào giao diện của ứng dụng tại: **http://localhost:3000**

---

Cảm ơn bạn đã quan tâm đến dự án của chúng mình! Nếu có bất kỳ vấn đề gì trong quá trình cài đặt, hãy tạo một Issue trên repository nhé.
