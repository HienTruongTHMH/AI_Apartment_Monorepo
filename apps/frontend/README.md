<div align="center">

# NestaVietAI

**Nền tảng quản lý & tìm kiếm căn hộ cho thuê thế hệ mới tại Việt Nam**

*Powered by 4 AI Agents · Built with React 19 + Expo SDK 53*

---

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-SDK_53-000020?style=flat-square&logo=expo&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## Tổng quan

NestaVietAI là một **monorepo** gồm Web App và Mobile App, tích hợp **4 AI Agents** chuyên biệt cho từng giai đoạn trong hành trình thuê/cho thuê căn hộ — từ đăng tin, tư vấn tìm kiếm, vận hành hậu mãi đến thanh toán tự động.

```
┌─────────────────────────────────────────────────────────────┐
│                        NestaVietAI                          │
│                                                             │
│  ┌─────────────────────┐   ┌──────────────────────────┐    │
│  │      Web App        │   │       Mobile App          │    │
│  │  React 19 + Vite    │   │  React Native + Expo 53   │    │
│  │  5 Portals          │   │  5 Tabs + Auth Flow       │    │
│  │  Landing · Tenant   │   │  Home · Search · Chat     │    │
│  │  Landlord · Admin   │   │  Saved · Profile          │    │
│  │  Manager · Dev      │   │                           │    │
│  └──────────┬──────────┘   └────────────┬─────────────┘    │
│             └────────────┬──────────────┘                   │
│                          ▼                                  │
│              ┌─────────────────────┐                        │
│              │    4 AI Agents      │                        │
│              │  Listing Verifier   │                        │
│              │  Super Broker AI    │                        │
│              │  Smart Concierge    │                        │
│              │  Contract & Admin   │                        │
│              └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Mục lục

- [Cấu trúc Monorepo](#cấu-trúc-monorepo)
- [4 AI Agents](#4-ai-agents)
- [Web App](#web-app)
- [Mobile App](#mobile-app)
- [Design System](#design-system)
- [Auth & Bảo mật](#auth--bảo-mật)
- [Trạng thái dự án](#trạng-thái-dự-án)

---

## Cấu trúc Monorepo

```
Apartment For Rent/
│
├── src/                                   ← Web App (React 19 + Vite)
│   │
│   ├── shared/                            ← Primitives dùng chung (2+ features)
│   │   ├── ui/                            ← shadcn/ui (50+ components)
│   │   ├── components/
│   │   │   ├── StatCounter.tsx            ← Animated number counter
│   │   │   ├── WordReveal.tsx             ← Word-by-word text reveal
│   │   │   ├── LazyImage.tsx              ← IntersectionObserver lazy load
│   │   │   ├── RatingModal.tsx
│   │   │   ├── OnboardingTour.tsx
│   │   │   └── ImageWithFallback.tsx
│   │   ├── hooks/
│   │   │   ├── useLang.ts                 ← VI/EN language toggle
│   │   │   └── useCountUp.ts              ← Animated number count-up
│   │   └── styles/                        ← index.css · theme.css · fonts.css
│   │
│   ├── lib/
│   │   └── api.ts                         ← NestJS HTTP client (stub)
│   │
│   ├── features/
│   │   ├── landing/                       ← Landing page
│   │   │   └── LandingPage.tsx            ← Main page (~2,600 lines)
│   │   │
│   │   ├── listing/                       ← Tin đăng / bài viết
│   │   │   ├── types.ts                   ← Listing interface
│   │   │   ├── index.ts                   ← Barrel export
│   │   │   ├── data/seed-listings.ts      ← 51 listings thực từ Chợ Tốt
│   │   │   └── components/PriceEstimator.tsx
│   │   │
│   │   ├── apartment/                     ← Dữ liệu căn hộ (model vật lý)
│   │   │   ├── types.ts
│   │   │   └── components/MapView.tsx
│   │   │
│   │   ├── agents/                        ← AI Agent adapters + registry
│   │   │   ├── index.ts                   ← AGENT_REGISTRY
│   │   │   ├── listingVerifier.ts
│   │   │   ├── superBroker.ts
│   │   │   ├── smartConcierge.ts
│   │   │   └── contractAdmin.ts
│   │   │
│   │   ├── ai-service/
│   │   │   └── listingVerifier.ts         ← Gemini 2.5-Flash (API thực)
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWidget.tsx
│   │   │   └── ChatInbox.tsx
│   │   │
│   │   ├── tenant/                        ← Portal cư dân
│   │   │   ├── TenantApp.tsx
│   │   │   ├── TenantLogin.tsx
│   │   │   └── TenantRegister.tsx
│   │   │
│   │   ├── landlord/                      ← Portal chủ nhà
│   │   │   ├── LandlordApp.tsx
│   │   │   ├── LandlordLogin.tsx
│   │   │   ├── LandlordRegister.tsx
│   │   │   └── components/
│   │   │       ├── DocScanner.tsx
│   │   │       └── MaintenanceCalendar.tsx
│   │   │
│   │   ├── admin/                         ← Quản trị hệ thống
│   │   ├── manager/                       ← Vận hành tòa nhà
│   │   ├── dev/                           ← Developer portal
│   │   └── shared-pages/                  ← Trang dùng chung nhiều vai trò
│   │       ├── PortalDirectory.tsx
│   │       ├── ContractsPage.tsx
│   │       ├── PaymentsPage.tsx
│   │       ├── ReportsPage.tsx
│   │       └── SecurityPage.tsx
│   │
│   ├── data/
│   │   └── vietnam-admin.ts               ← 34 tỉnh/thành · 3,321 phường/xã
│   │
│   └── app/
│       ├── App.tsx
│       └── routes.tsx                     ← createBrowserRouter + guards + animations
│
├── mobile/                                ← Mobile App (React Native + Expo SDK 53)
│   ├── app/
│   │   ├── (tabs)/                        ← Home · Search · Chat · Saved · Profile
│   │   ├── (auth)/                        ← Tenant & Landlord login/register
│   │   ├── listing/[id].tsx               ← Chi tiết tin + đặt lịch xem
│   │   └── notifications.tsx
│   │
│   ├── features/
│   │   ├── agents/                        ← 4 Agent configs + reply dispatchers
│   │   ├── listing/listings.ts            ← Mock listings data
│   │   └── store/
│   │       ├── savedStore.ts              ← Reactive pub/sub saved store
│   │       └── recentStore.ts
│   │
│   └── shared/
│       └── theme.ts                       ← Colors, Font, Radius tokens
│
├── package.json                           ← Web dependencies
└── README.md
```

> **Ghi chú cho nhóm:** Khi tích hợp backend thực, thay mock function trong `features/agents/` bằng `async` function gọi API qua `src/lib/api.ts`. Mọi TODO đều được comment kèm endpoint.

---

## 4 AI Agents

Cả Web và Mobile tích hợp đầy đủ 4 agents — phủ toàn bộ lifecycle thuê căn hộ.

### Agent 1 — Listing Verifier
> *Giai đoạn: Onboarding tài sản*

| | Chi tiết |
|:--|:--|
| **Input** | Text mô tả thô (sai chính tả, viết tắt) + ảnh từ chủ nhà |
| **NLP Pipeline** | Trích xuất thực thể: diện tích, giá, phòng, nội thất, chính sách |
| **Auto-Copywriting** | Sinh tiêu đề + mô tả chuẩn SEO từ dữ liệu thô |
| **Vision AI** | Auto-tagging ảnh · đánh giá chất lượng · phát hiện watermark |
| **Output** | JSON chuẩn hóa → DB · tin chưa đạt → "Bản nháp" + feedback |
| **Giá trị** | Tiết kiệm 90% thời gian kiểm duyệt · đảm bảo Clean Data |

**Web** — Tab "Đăng tin" trong LandlordApp: form 3 bước + "Kiểm tra bằng AI" → Gemini 2.5-Flash (`features/ai-service/listingVerifier.ts`)  
**Mobile** — Chat Hub → Listing Verifier · quick prompts: tối ưu tiêu đề, kiểm tra ảnh, SEO mô tả

---

### Agent 2 — Super Broker AI
> *Giai đoạn: Lead Generation*

| | Chi tiết |
|:--|:--|
| **Input** | Câu hỏi tự nhiên — *"Tìm studio dưới 8tr, đi làm Q.1 ≤ 15 phút, cho nuôi mèo"* |
| **Intent Extraction** | Chuyển câu nói → constraints: `Max_Price=8M`, `Pet=True`, `Commute≤15m` |
| **RAG Search** | Embedding → Vector DB listing → top-3 kết quả ngữ nghĩa |
| **Reasoning** | Giải thích lý do gợi ý ("phù hợp vì...") thay vì chỉ trả link |
| **Output** | Đề xuất cá nhân hóa + tự động chốt lịch xem + đồng bộ Calendar |
| **Giá trị** | Phục vụ 24/7 · Conversational Search tăng tỷ lệ chốt deal |

**Web** — Tab "AI Chat" trong TenantApp: chat đầy đủ + card listing + bản đồ  
**Mobile** — Chat Hub → Super Broker AI (mặc định) · quick prompts: tìm phòng, so sánh quận

---

### Agent 3 — Smart Concierge
> *Giai đoạn: Tenant Care & Hậu mãi*

| | Chi tiết |
|:--|:--|
| **Input** | Báo cáo sự cố hoặc yêu cầu hỗ trợ từ cư dân |
| **Triage & Routing** | Phân loại: Khẩn cấp (vỡ ống nước) · Trung bình · Thường |
| **Auto Dispatching** | Tra lịch kỹ thuật → phân việc qua hệ thống nội bộ / Zalo |
| **Multi-party Sync** | Cập nhật trạng thái realtime cho cư dân và chủ nhà |
| **Output** | Ticket với người phụ trách · ETA · Báo cáo CSAT sau đóng |
| **Giá trị** | Giảm SLA wait time · chủ nhà không nhận cuộc gọi lúc nửa đêm |

**Web** — Tab "Yêu cầu dịch vụ" trong TenantApp: form báo sự cố + ticket board + SLA timer  
**Mobile** — Chat Hub → Smart Concierge · Profile "Phòng đang thuê" → auto-open agent

---

### Agent 4 — Contract & Admin
> *Giai đoạn: Billing & Operations*

| | Chi tiết |
|:--|:--|
| **Input** | Dữ liệu điện/nước (IoT/nhập tay) + thông tin HĐ + webhook ngân hàng |
| **Dynamic Calculation** | Tính chi phí theo công thức riêng từng HĐ (điện nhà nước/KD, phí diện tích) |
| **Document Generation** | Render PDF hóa đơn/HĐ với thông tin pháp lý đầy đủ + mã VietQR |
| **Payment Reconciliation** | Lắng nghe webhook → khớp mã HĐ → tự động gạch nợ |
| **Automated Dunning** | Chuỗi nhắc nợ: lịch sự → cảnh báo → khẩn cấp theo timeline |
| **Output** | Hóa đơn tháng gửi cư dân · Báo cáo dòng tiền gửi chủ nhà |
| **Giá trị** | Loại bỏ 100% sai sót tính toán thủ công · minh bạch tài chính |

**Web** — `ContractsPage` (ký HĐ điện tử 3 bước) + `PaymentsPage` (VietQR) + `ReportsPage` (Recharts)  
**Mobile** — Chat Hub → Contract & Admin · Profile "Hợp đồng" / "Thanh toán" → auto-open agent

---

## Web App

### Cài đặt & Chạy

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # → dist/
```

### Tech Stack

| Layer | Công nghệ | Ghi chú |
|:--|:--|:--|
| Framework | React 19 + TypeScript + Vite 6 | RSC-ready |
| Routing | React Router v7 | `createBrowserRouter` + lazy routes |
| Styling | Tailwind CSS v4 | Liquid Glass design tokens |
| Animation | Motion (`motion/react`) | Page transitions + scroll-driven |
| Charts | Recharts | AreaChart, BarChart, PieChart |
| Icons | Lucide React | |
| AI Agent 1 | Gemini 2.5-Flash API | `features/ai-service/listingVerifier.ts` |
| Địa chính | `src/data/vietnam-admin.ts` | 34 tỉnh/thành · 3,321 phường/xã |

### Portals & Routes

| Path | Component | Vai trò | Auth |
|:--|:--|:--|:--|
| `/` | `LandingPage` | Public | — |
| `/portals` | `PortalDirectory` | Portal index | — |
| `/tenant/login` | `TenantLogin` | Cư dân | — |
| `/tenant/register` | `TenantRegister` | Cư dân | — |
| `/tenant/*` | `TenantApp` | Dashboard cư dân | `localStorage` |
| `/landlord/login` | `LandlordLogin` | Chủ nhà | — |
| `/landlord/register` | `LandlordRegister` | Chủ nhà 4 bước | — |
| `/landlord/*` | `LandlordApp` | Portal chủ nhà | `localStorage` |
| `/contracts` | `ContractsPage` | Ký HĐ điện tử | Landlord |
| `/payments` | `PaymentsPage` | VietQR thanh toán | Tenant |
| `/reports` | `ReportsPage` | Báo cáo tài chính | Landlord |
| `/admin/*` | `AdminPanel` | Quản trị hệ thống | `sessionStorage` |
| `/manager/*` | `ManagerApp` | Vận hành tòa nhà | `sessionStorage` |
| `/dev/*` | `DevApp` | Developer portal | `sessionStorage` |

### Tính năng nổi bật

<details>
<summary><strong>Landing Page</strong></summary>

- Scroll progress bar + hero parallax + word reveal animation
- Bento grid với stagger variants
- How It Works step connector (scroll-driven)
- **Command Palette (⌘K)** — tìm kiếm nhanh toàn bộ features
- **Rental Calculator** — tính chi phí thuê theo tháng
- **Comparison Drawer** — so sánh tối đa 3 căn hộ side-by-side
- StatCounter fill bar với IntersectionObserver
- Neighborhood Heatmap · Market Insights chart

</details>

<details>
<summary><strong>Tenant Portal</strong></summary>

- Đăng ký 3 bước → email mock → bắt buộc đổi mật khẩu lần đầu
- AI Chat (Super Broker) — conversational search + card listing + bản đồ
- Smart Concierge — báo sự cố + ticket board + SLA countdown timer
- Hóa đơn chi tiết + VietQR SVG (21×21 module, finder patterns chuẩn)

</details>

<details>
<summary><strong>Landlord Portal</strong></summary>

- Đăng ký 4 bước: xác minh → tòa nhà → pháp lý & ngân hàng → gói dịch vụ
- Chọn phường/xã: searchable button list (không dùng `<select>`)
- **Listing Verifier AI** — Gemini 2.5-Flash: NLP extraction + Vision check
- **AgentsTab** — dashboard 4 agents với status, metrics, event stream mock
- Dashboard KPI + biểu đồ doanh thu/lấp đầy + SLA alerts

</details>

<details>
<summary><strong>Admin · Manager · Dev Portals</strong></summary>

- Mỗi portal có login riêng biệt với session-based auth
- Route guards tự động redirect về đúng login portal
- Dev Portal: terminal aesthetic + scan line effect
- Cross-portal isolation: token của portal này không có giá trị ở portal khác

</details>

---

## Mobile App

### Cài đặt & Chạy

```bash
cd mobile
npm install
npx expo start           # Scan QR → Expo Go (iOS / Android)
npx expo start --ios     # iOS Simulator (cần Xcode)
npx expo start --android # Android Emulator
```

### Tech Stack

| Layer | Công nghệ | Ghi chú |
|:--|:--|:--|
| Framework | React Native + Expo SDK 53 | |
| Routing | Expo Router v4 | File-based routing |
| Navigation | Stack + Bottom Tabs | Safe area aware |
| State | Module pub/sub store | Không cần Redux/Context |
| Styling | `StyleSheet.create()` + design tokens | `shared/theme.ts` |
| TypeScript | Strict mode | 0 errors `tsc --noEmit` |

### 4-Agent Chat Hub

Tab Chat là trung tâm AI của mobile — chuyển đổi giữa 4 agents bằng selector ngang:

```
┌────────────────────────────────────────────────────┐
│  ●  Super  ●  Concierge  ●  Contract  ●  Verifier  │  ← Agent selector
├────────────────────────────────────────────────────┤
│  [Quick prompts phù hợp theo agent đang chọn]     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Chat bubble · Lịch sử độc lập mỗi agent    │  │
│  └──────────────────────────────────────────────┘  │
│  [Input] ─────────────────────────────────── [Send]│
└────────────────────────────────────────────────────┘
```

| Agent | Màu accent | Deep link param |
|:--|:--|:--|
| Super Broker AI | Cyan `#22D3EE` | `?agent=broker` |
| Smart Concierge | Emerald `#34D399` | `?agent=concierge` |
| Contract & Admin | Violet `#A78BFA` | `?agent=contract` |
| Listing Verifier | Amber `#F59E0B` | `?agent=verifier` |

### Màn hình Mobile

| Route | Màn hình | Agent tích hợp |
|:--|:--|:--|
| `(tabs)/` | Home Feed | Listing Verifier (badge "AI Verified") |
| `(tabs)/search` | Khám phá + Filter | — |
| `(tabs)/chat` | **4-Agent Hub** | Tất cả 4 agents |
| `(tabs)/saved` | Đã lưu | Super Broker (nút "Hỏi AI so sánh") |
| `(tabs)/profile` | Tài khoản | Deep links → agents |
| `listing/[id]` | Chi tiết tin | Verifier badge + Super Broker CTA |
| `notifications` | Thông báo | Feed từ 4 agents |

---

## Design System

### Web — Liquid Glass

```css
/* Core tokens */
--bg-dark:    #070B16;
--bg-light:   #F0F4FF;
/* Glass effect */
backdrop-filter: blur(24px) saturate(180%);
/* Aurora background */
3 radial-gradient blobs: cyan · violet · emerald;
/* Card hover */
shadow theo badge color + border glow;
```

### Mobile — Dark Space

| Token | Hex | Dùng cho |
|:--|:--|:--|
| `Colors.bg` | `#030B14` | Nền chính |
| `Colors.bgCard` | `#070F20` | Card, input |
| `Colors.cyan` | `#22D3EE` | Tenant accent · Super Broker |
| `Colors.emerald` | `#34D399` | AI Verified · Smart Concierge |
| `Colors.violet` | `#A78BFA` | Landlord accent · Contract Admin |
| `Colors.amber` | `#F59E0B` | Listing Verifier |
| `Colors.border` | `rgba(255,255,255,0.06)` | Đường kẻ, divider |

---

## Auth & Bảo mật

### Web Auth

| Vai trò | Storage | Guard |
|:--|:--|:--|
| Cư dân | `localStorage: nv-tenant-logged-in` | `TenantGuard` |
| Chủ nhà | `localStorage: nv-landlord-logged-in` | `LandlordGuard` |
| Admin | `sessionStorage: nv-admin-auth` | `AdminGuard` |
| Manager | `sessionStorage: nv-manager-session` | `ManagerGuard` |
| Developer | `sessionStorage: nv-dev-session` | `DevGuard` |

- Route guards tự động redirect về đúng login portal
- Cross-portal isolation: token của portal này không có giá trị ở portal khác
- Session token chứa expiry (8h) — tự hết hạn, không cần logout thủ công

### Mobile Auth

Mock auth hiện tại (`router.replace` sau submit). JWT + `AsyncStorage` sẽ implement cùng backend thực.

---

## Trạng thái dự án

| Hạng mục | Web | Mobile | Ghi chú |
|:--|:--:|:--:|:--|
| Landing Page | ✅ | — | Scroll animations, bento, heatmap, stats |
| Command Palette ⌘K | ✅ | — | Tìm kiếm nhanh toàn bộ |
| Rental Calculator | ✅ | — | Tính chi phí thuê |
| Comparison Drawer | ✅ | — | So sánh 3 căn hộ |
| 4-Agent Hub UI | ✅ | ✅ | Web: tabs · Mobile: switcher |
| **Listing Verifier** | ✅ API | ✅ Mock | Web: Gemini 2.5-Flash thực |
| **Super Broker AI** | ✅ Mock | ✅ Mock | RAG UI đầy đủ |
| **Smart Concierge** | ✅ Mock | ✅ Mock | Ticket board + SLA timer |
| **Contract & Admin** | ✅ Mock | ✅ Mock | HĐ + VietQR + báo cáo |
| Portal Tenant | ✅ | ✅ | Chat, Explore, Service, Invoice |
| Portal Landlord | ✅ | ✅ auth | Dashboard, Listing, Reports |
| Portal Admin | ✅ | — | System monitoring |
| Portal Manager | ✅ | — | Building operations |
| Portal Developer | ✅ | — | Terminal aesthetic |
| Saved listings | — | ✅ | Reactive pub/sub |
| Notifications | — | ✅ | 7 loại từ 4 agents |
| Hợp đồng điện tử | ✅ | — | Form → Preview → Done |
| VietQR thanh toán | ✅ | — | SVG mock chuẩn QR spec |
| Báo cáo tài chính | ✅ | — | Recharts: Area/Bar/Pie |
| Dữ liệu địa chính | ✅ | ✅ | 34 tỉnh hợp nhất · 3,321 đơn vị |
| Backend API | — | — | NestJS + Prisma *(in development)* |
| Database | — | — | PostgreSQL + Supabase *(planned)* |
| AI Core mở rộng | Partial | — | Listing Verifier → Gemini thực |

---

<div align="center">

**NestaVietAI v1.0.0** · Made with ❤️ in Vietnam

*Frontend prototype đủ demo toàn bộ luồng sản phẩm với 4 AI Agents.*  
*Backend NestJS + Prisma — in development.*

</div>
