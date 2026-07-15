'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { apiService } from '@/lib/api';
import { ShieldCheck, ShieldAlert, FileCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function AccountActivationHub() {
  const { user, setAccountActive } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleActivateAccount = async () => {
    setLoading(true);
    try {
      await apiService.confirmOfflineRentalAndActivateAccount('ctr-101');
      setSuccessMsg('Tài khoản của bạn đã được kích hoạt thành công và Hợp đồng đã cập nhật trạng thái hoạt động!');
    } catch {
      setAccountActive(true);
      setSuccessMsg('Đã kích hoạt thành công tài khoản demo!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#E03C3D]/10 text-[#E03C3D]">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-[#2C2C2C]">Trung Tâm Xác Nhận & Kích Hoạt Tài Khoản</h1>
        <p className="text-xs text-[#5A5A5A] max-w-lg mx-auto">
          Quản lý trạng thái hoạt động tài khoản và xác nhận kết quả ký kết hợp đồng bản cứng ngoài đời thực.
        </p>
      </div>

      {/* Current Status Box */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8E8E8] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F9F9F9] border border-[#E8E8E8]">
          <div className="space-y-1">
            <div className="text-xs text-[#5A5A5A]">Chủ tài khoản: <span className="text-[#2C2C2C] font-bold">{mounted ? (user?.fullName || 'Khách Thuê') : 'Khách Thuê'}</span></div>
            <div className="text-xs text-[#5A5A5A]">Email liên hệ: <span className="text-[#2C2C2C]">{mounted ? user?.email : ''}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#5A5A5A]">Trạng thái hiện tại:</span>
            {mounted && user?.isActive ? (
              <span className="px-3.5 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Đã kích hoạt
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-xl bg-[#FFFBEB] border border-[#FEF3C7] text-[#D97706] text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <ShieldAlert className="w-4 h-4" /> Chưa kích hoạt
              </span>
            )}
          </div>
        </div>

        {/* Business Process Rules Explanation */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#2C2C2C] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#E03C3D]" /> Luồng Kích Hoạt Nghiệp Vụ Chuẩn
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FEF3C7] space-y-2">
              <div className="text-xs font-bold text-[#D97706]">1. Khi mới tạo tài khoản (Chưa kích hoạt)</div>
              <p className="text-[11px] text-[#5A5A5A] leading-relaxed">
                Người dùng có thể đăng ký tự do, tìm kiếm căn hộ, trao đổi qua trợ lý AI Broker và nhận hợp đồng nháp từ Chủ nhà.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
              <div className="text-xs font-bold text-[#166534]">2. Sau khi ký giấy hợp đồng bản cứng</div>
              <p className="text-[11px] text-[#5A5A5A] leading-relaxed">
                Sau khi ký hợp đồng giấy bản cứng ngoài hệ thống, bấm nút xác nhận dưới đây để kích hoạt tài khoản và đưa hợp đồng vào trạng thái hoạt động chính thức.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        {successMsg ? (
          <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-bold text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-[#065F46] mx-auto" />
            <p>{successMsg}</p>
            <div className="pt-2">
              <Link
                href="/tenant/dashboard/contracts"
                className="px-6 py-2.5 rounded-xl bg-[#E03C3D] text-white font-bold inline-flex items-center gap-2 hover:bg-[#C92F30] transition-colors"
              >
                <span>Xem Hợp Đồng Đã Kích Hoạt</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            {mounted && user?.isActive ? (
              <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-bold text-center">
                Tài khoản của bạn đang ở trạng thái HOẠT ĐỘNG (Đã kích hoạt). Quyền truy cập các tính năng thuê nhà đã được mở đầy đủ!
              </div>
            ) : (
              <button
                onClick={handleActivateAccount}
                disabled={loading || !mounted}
                className="w-full py-4 rounded-2xl bg-[#E03C3D] hover:bg-[#C92F30] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Sparkles className="w-5 h-5" />
                <span>{loading ? 'Đang xác nhận...' : 'Xác Nhận Đã Ký Bản Cứng & Kích Hoạt Tài Khoản'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
