import React from 'react';
import AuthGuard from '@/components/shared/AuthGuard';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['TENANT']}>
      {children}
    </AuthGuard>
  );
}
