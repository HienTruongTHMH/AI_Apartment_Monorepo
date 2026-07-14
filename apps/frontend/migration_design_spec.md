# Frontend Migration Design Specification

## 1. Understanding Summary
- **What is being built:** Completing the new Next.js App Router frontend by migrating missing pages (search, listings, contracts, payments, reports, map, chat) from the old frontend.
- **Why it exists:** To retain the old app's completeness and good UX, but in a clean, modern Next.js codebase without duplicated logic or messy mock data.
- **Who it is for:** Strictly two roles: **Tenant** (`isActive` = false/true) and **Owner**.
- **Key constraints:** Replace all old mock data with real API integration. Maintain strict separation between Tenant and Owner views based on login. 
- **Explicit non-goals:** We will **not** migrate any Admin or Manager roles/pages. We will **not** use temporary fake fallbacks or "bừa" (messy) code. No "persona switcher" will be implemented.

## 2. Assumptions (Non-Functional Requirements)
- **Performance:** Leverage Next.js Server Components and Server-Side Rendering (SSR) for SEO-critical pages, and Client Components for interactive dashboards.
- **Security & Routing:** Role-based access control will be enforced via Next.js Middleware and Layouts.
- **Maintenance:** Rely heavily on shared components to keep the codebase DRY and maintainable.
- **Data Integrity:** The frontend relies strictly on existing Backend APIs. No backend code will be modified without explicit permission.

## 3. Final Design: Route Mapping
All routes focus strictly on Tenant and Owner.

**Public / Guest Routes (`isActive = false`)**
- `/` (Landing page)
- `/search` (Map and listing search)
- `/apartment/[id]` (Apartment details)
- `/register` & `/login` (Auth flows)

**Tenant Dashboard Routes (`isActive = true`)**
- `/tenant/dashboard` (Overview)
- `/tenant/dashboard/contracts` (View lease agreements)
- `/tenant/dashboard/payments` (Rent payments/history)
- `/tenant/dashboard/chat` (Communicate with Owner/AI)
- `/tenant/dashboard/reports` (Maintenance requests/issues)

**Owner Dashboard Routes**
- `/owner/dashboard` (Property & income overview)
- `/owner/dashboard/apartments` (Manage properties)
- `/owner/dashboard/create-listing` (AI-assisted posting)
- `/owner/dashboard/contracts` (Manage leases)
- `/owner/dashboard/payments` (Track revenue)
- `/owner/dashboard/chat` (Communicate with Tenants)

## 4. Final Design: Architecture & Components
- **Shared Feature Components:** Use a `src/components/features` directory for components like `<ContractsTable role="tenant" | "owner" />` to maximize code reuse while keeping UI flexible per role.
- **Data Flow:** Custom hooks (e.g., `useContracts()`) will fetch real data from the backend APIs. 
- **No Mock Data:** All legacy mock data will be deleted.
- **State Management:** Zustand (`useAuthStore`) maintains session state.

## 5. Security & Edge Cases
- **Role Identification:** The header will explicitly display the logged-in role ("Tenant" or "Owner"). There will be **no button to switch roles**.
- **Inactive Tenants:** Users with `isActive = false` attempting to access protected routes will be redirected.
- **Error Handling:** Global `error.tsx` layouts and toast notifications will handle UI and API failures gracefully.

## 6. Decision Log
| Decision | Alternatives Considered | Why this option was chosen |
| :--- | :--- | :--- |
| **Drop Admin/Manager Roles** | Migrate all old roles to new frontend. | Focus strictly on Owner and Tenant as per the new product vision. Reduces bloat and complexity. |
| **Migrate Cross-cutting Features (Payments, Reports, Map)** | Discard them or build them later. | Retains the completeness and full feature-set of the old frontend application. |
| **Route Segregation with Shared Components** | Unified generic routes (e.g., `/dashboard/contracts`) with role-based rendering. | Strict route segregation (`/(tenant)` vs `/(owner)`) keeps layouts clean and simplifies access control, while shared components keep the code DRY. |
| **No Persona Switcher** | Implement a toggle to switch between Tenant/Owner view. | A fixed role based on login is more secure, less confusing, and aligns with the user's explicit request. The role will simply be displayed in the header. |
