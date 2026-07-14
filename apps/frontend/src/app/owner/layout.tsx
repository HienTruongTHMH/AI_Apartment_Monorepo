import React from 'react';
import AuthGuard from '@/components/shared/AuthGuard';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['OWNER']}>
      {children}
    </AuthGuard>
  );
}
