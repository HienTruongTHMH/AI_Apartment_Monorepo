'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function UserActivationBanner() {
  const { user, isLoggedIn } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOwnerPath = pathname.startsWith('/owner');
  const isOwner = user?.role === 'OWNER';

  if (!mounted || !isLoggedIn || !user || user.isTenancyActivated || isOwnerPath || isOwner) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-b border-amber-500/30 py-3 px-4 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 animate-pulse">
            <ShieldAlert className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="font-bold text-amber-300 flex items-center gap-2">
              Trạng Thái Tài Khoản: Chưa Kích Hoạt
            </div>
            <p className="text-gray-300 mt-0.5">
              Bạn có thể tìm kiếm căn hộ và dùng AI Broker. Sau khi ký kết <span className="font-semibold">hợp đồng bản cứng ngoài hệ thống</span> & xác nhận thuê, tài khoản của bạn sẽ được kích hoạt chính thức.
            </p>
          </div>
        </div>

        <Link
          href="/tenant/dashboard/activate"
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all text-xs shadow-md shadow-amber-500/20"
        >
          <span>Xác Nhận & Kích Hoạt</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
