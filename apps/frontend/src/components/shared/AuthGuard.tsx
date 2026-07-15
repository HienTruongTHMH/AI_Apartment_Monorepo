'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('TENANT' | 'OWNER' | 'GUEST')[];
  requireActive?: boolean;
}

export default function AuthGuard({ children, allowedRoles, requireActive = false }: AuthGuardProps) {
  const { user, isLoggedIn } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    console.log('[AuthGuard Debug]: Checking authorization...', {
      isLoggedIn,
      userRole: user?.role,
      userEmail: user?.email,
      allowedRoles,
      pathname,
      isActive: user?.isActive,
      requireActive
    });

    // If not logged in and requires a role, redirect to login
    if (!isLoggedIn || !user) {
      if (allowedRoles) {
        console.log('[AuthGuard Debug]: Redirecting to /login because user is not authenticated.');
        router.push('/login');
      } else {
        console.log('[AuthGuard Debug]: Public page accessed without login.');
        setIsAuthorized(true);
      }
      return;
    }

    // Normalize user role and allowed roles to uppercase for robust comparison
    const normalizedUserRole = (user.role || '').toUpperCase();
    const normalizedAllowedRoles = (allowedRoles || []).map(r => r.toUpperCase());

    // Role check
    if (allowedRoles && !normalizedAllowedRoles.includes(normalizedUserRole)) {
      console.log(`[AuthGuard Debug]: Access denied for role "${normalizedUserRole}". Allowed:`, normalizedAllowedRoles);
      if (normalizedUserRole === 'OWNER') {
        console.log('[AuthGuard Debug]: Redirecting Owner to /owner/dashboard');
        router.push('/owner/dashboard');
      } else {
        console.log('[AuthGuard Debug]: Redirecting Tenant/Guest to /tenant/dashboard');
        router.push('/tenant/dashboard');
      }
      return;
    }

    // Active status check
    if (requireActive && !user.isActive) {
      console.log('[AuthGuard Debug]: User is not active. Redirecting to activation page.');
      router.push('/tenant/dashboard/activate');
      return;
    }

    console.log('[AuthGuard Debug]: Authorization successful. Access granted.');
    setIsAuthorized(true);
  }, [user, isLoggedIn, allowedRoles, requireActive, router, pathname]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
