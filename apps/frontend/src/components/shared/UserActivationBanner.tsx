'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ShieldAlert, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserActivationBanner() {
  const { user, isLoggedIn } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOwnerPath = pathname.startsWith('/owner');
  const isOwner = user?.role === 'OWNER';

  if (!mounted || !isLoggedIn || !user || user.isTenancyActivated || isOwnerPath || isOwner || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-6 z-50 max-w-[360px] md:max-w-[380px] w-[calc(100vw-48px)] p-4.5 rounded-xl border border-[#E5E7EB] bg-white shadow-xl"
      >
        {/* Close Button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#9CA3AF] hover:text-[#4B5563] transition-colors"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Row */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0 p-1.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-[#111827]">
            Trạng Thái Tài Khoản: Chưa Kích Hoạt
          </div>
        </div>

        {/* Body Paragraph */}
        <div className="mt-2.5">
          <p className="text-xs md:text-[13px] text-[#4B5563] leading-relaxed">
            Bạn có thể tìm kiếm căn hộ và dùng AI Broker. Sau khi ký kết <span className="font-bold text-[#E03C3D]">hợp đồng bản cứng ngoài hệ thống</span> & xác nhận thuê, tài khoản của bạn sẽ được kích hoạt chính thức.
          </p>
        </div>

        {/* Action Row */}
        <div className="mt-3.5 flex justify-end">
          <Link
            href="/tenant/dashboard/activate"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E03C3D] hover:bg-[#C92F30] text-white font-bold transition-all text-xs shadow-md shadow-red-500/10 active:scale-95"
          >
            <span>Xác Nhận & Kích Hoạt</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
