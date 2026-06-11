import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router";
import { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LandingPage } from "@features/landing/LandingPage";
import { TenantRegister } from "@features/tenant/TenantRegister";
import { TenantLogin } from "@features/tenant/TenantLogin";
import { LandlordRegister } from "@features/landlord/LandlordRegister";
import { LandlordLogin } from "@features/landlord/LandlordLogin";
import { AdminLogin, isAdminAuthenticated } from "@features/admin/AdminLogin";
import { ManagerLogin, isManagerAuthenticated } from "@features/manager/ManagerLogin";
import { DevLogin, isDevAuthenticated } from "@features/dev/DevLogin";
import { PortalDirectory } from "@features/shared-pages/PortalDirectory";

const TenantApp     = lazy(() => import("@features/tenant/TenantApp").then(m => ({ default: m.TenantApp })));
const LandlordApp   = lazy(() => import("@features/landlord/LandlordApp").then(m => ({ default: m.LandlordApp })));
const AdminPanel    = lazy(() => import("@features/admin/AdminPanel").then(m => ({ default: m.AdminPanel })));
const ManagerApp    = lazy(() => import("@features/manager/ManagerApp").then(m => ({ default: m.ManagerApp })));
const DevApp        = lazy(() => import("@features/dev/DevApp").then(m => ({ default: m.DevApp })));
const ContractsPage = lazy(() => import("@features/shared-pages/ContractsPage").then(m => ({ default: m.ContractsPage })));
const PaymentsPage  = lazy(() => import("@features/shared-pages/PaymentsPage").then(m => ({ default: m.PaymentsPage })));
const ReportsPage   = lazy(() => import("@features/shared-pages/ReportsPage").then(m => ({ default: m.ReportsPage })));
const SecurityPage    = lazy(() => import("@features/shared-pages/SecurityPage").then(m => ({ default: m.SecurityPage })));
const ChatPage           = lazy(() => import("@features/chat/ChatPage").then(m => ({ default: m.ChatPage })));
const PostListingPage    = lazy(() => import("@features/post/PostListingPage").then(m => ({ default: m.PostListingPage })));
const ListingDetailPage  = lazy(() => import("@features/listing/ListingDetailPage").then(m => ({ default: m.ListingDetailPage })));

function isQuickAuthenticated() {
  try {
    return (
      !!localStorage.getItem("nv-quick-email") ||
      localStorage.getItem("nv-tenant-logged-in") === "true" ||
      localStorage.getItem("nv-landlord-logged-in") === "true"
    );
  } catch { return false; }
}

function ChatGuard() {
  return isQuickAuthenticated() ? <ChatPage /> : <Navigate to="/" replace />;
}
function PostGuard() {
  return isQuickAuthenticated() ? <PostListingPage /> : <Navigate to="/" replace />;
}

function isLandlordAuthenticated() {
  try { return localStorage.getItem("nv-landlord-logged-in") === "true"; } catch { return false; }
}
function isTenantAuthenticated() {
  try { return localStorage.getItem("nv-tenant-logged-in") === "true"; } catch { return false; }
}

function TenantGuard() {
  return isTenantAuthenticated() ? <TenantApp /> : <Navigate to="/tenant/login" replace />;
}
function LandlordGuard() {
  return isLandlordAuthenticated() ? <LandlordApp /> : <Navigate to="/landlord/login" replace />;
}
function AdminGuard() {
  return isAdminAuthenticated() ? <AdminPanel /> : <Navigate to="/admin/login" replace />;
}
function ManagerGuard() {
  return isManagerAuthenticated() ? <ManagerApp /> : <Navigate to="/manager/login" replace />;
}
function DevGuard() {
  return isDevAuthenticated() ? <DevApp /> : <Navigate to="/dev/login" replace />;
}
function SecurityGuard() {
  return (isAdminAuthenticated() || isDevAuthenticated()) ? <SecurityPage /> : <Navigate to="/admin/login" replace />;
}
function ContractsGuard() {
  return isLandlordAuthenticated() ? <ContractsPage /> : <Navigate to="/landlord/login" replace />;
}
function ReportsGuard() {
  return isLandlordAuthenticated() ? <ReportsPage /> : <Navigate to="/landlord/login" replace />;
}
function PaymentsGuard() {
  return isTenantAuthenticated() ? <PaymentsPage /> : <Navigate to="/tenant/login" replace />;
}

type RouteVariant = {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit: Record<string, unknown>;
  transition: Record<string, unknown>;
  style?: Record<string, unknown>;
};

function getRouteVariant(pathname: string): RouteVariant {
  // Landing — iris circle expand (Option 4)
  if (pathname === "/") return {
    initial:    { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
    animate:    { clipPath: "circle(150% at 50% 50%)", opacity: 1 },
    exit:       { opacity: 0, scale: 1.03, filter: "blur(10px)" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  };

  // Portal routes — clip curtain reveal (Option 3)
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/manager") ||
    pathname.startsWith("/dev")
  ) return {
    initial:    { clipPath: "inset(0 0 100% 0)" },
    animate:    { clipPath: "inset(0 0 0% 0)" },
    exit:       { clipPath: "inset(100% 0 0% 0)" },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  };

  // Auth pages — page flip (Option 5)
  if (pathname.endsWith("/login") || pathname.endsWith("/register")) return {
    initial:    { opacity: 0, rotateY: 9, scale: 0.97 },
    animate:    { opacity: 1, rotateY: 0, scale: 1 },
    exit:       { opacity: 0, rotateY: -6, scale: 0.97 },
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
    style:      { perspective: "1200px", transformStyle: "preserve-3d" },
  };

  // App routes — directional slide + scale (Option 1 + 2)
  if (pathname.startsWith("/tenant") || pathname.startsWith("/landlord")) return {
    initial:    { opacity: 0, x: -30, scale: 0.985 },
    animate:    { opacity: 1, x: 0,   scale: 1 },
    exit:       { opacity: 0, x: 26,  scale: 0.99 },
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  };

  // Sub-pages — enhanced morph scale + blur (Option 2 boosted)
  return {
    initial:    { opacity: 0, scale: 0.96, y: 20, filter: "blur(10px)" },
    animate:    { opacity: 1, scale: 1,    y: 0,  filter: "blur(0px)" },
    exit:       { opacity: 0, scale: 1.03, y: -16, filter: "blur(8px)" },
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  };
}

function PageTransition() {
  const location = useLocation();
  const variant = getRouteVariant(location.pathname);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={variant.initial as never}
        animate={variant.animate as never}
        exit={variant.exit as never}
        transition={variant.transition as never}
        style={{ minHeight: "100vh", ...(variant.style ?? {}) }}
      >
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center" style={{ background: "#030B14" }}>
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          </div>
        }>
          <Outlet />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export const router = createBrowserRouter([
  {
    element: <PageTransition />,
    children: [
      { path: "/",                    Component: LandingPage },
      { path: "/portals",             Component: PortalDirectory },
      // Tenant
      { path: "/tenant/register",     Component: TenantRegister },
      { path: "/tenant/login",        Component: TenantLogin },
      { path: "/tenant/*",            Component: TenantGuard },
      // Landlord
      { path: "/landlord/register",   Component: LandlordRegister },
      { path: "/landlord/login",      Component: LandlordLogin },
      { path: "/landlord/*",          Component: LandlordGuard },
      // Admin (siêu quản trị)
      { path: "/admin/login",         Component: AdminLogin },
      { path: "/admin/*",             Component: AdminGuard },
      // Building Manager
      { path: "/manager/login",       Component: ManagerLogin },
      { path: "/manager/*",           Component: ManagerGuard },
      // Developer
      { path: "/dev/login",           Component: DevLogin },
      { path: "/dev/*",               Component: DevGuard },
      // Sub-pages
      { path: "/security",            Component: SecurityGuard },
      { path: "/contracts",           Component: ContractsGuard },
      { path: "/payments",            Component: PaymentsGuard },
      { path: "/reports",             Component: ReportsGuard },
      { path: "/chat",                Component: ChatGuard },
      { path: "/post",                Component: PostGuard },
      { path: "/listing/:id",         Component: ListingDetailPage },
    ],
  },
]);
