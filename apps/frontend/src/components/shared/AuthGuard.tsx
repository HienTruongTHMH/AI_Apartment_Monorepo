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
    // If not logged in and requires a role, redirect to login
    if (!isLoggedIn || !user) {
      if (allowedRoles) {
        router.push('/login');
      } else {
        setIsAuthorized(true); // Public page
      }
      return;
    }

    // Role check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === 'OWNER') {
        router.push('/owner/dashboard');
      } else {
        router.push('/tenant/dashboard');
      }
      return;
    }

    // Active status check
    if (requireActive && !user.isActive) {
      // If inactive tenant tries to access restricted routes, redirect them
      router.push('/tenant/dashboard/activate');
      return;
    }

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
