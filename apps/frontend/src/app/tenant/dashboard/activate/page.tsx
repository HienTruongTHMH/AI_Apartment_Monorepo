'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useContracts } from '@/lib/api-hooks';
import { apiService } from '@/lib/api';
import { ShieldCheck, ShieldAlert, FileCheck, AlertCircle } from 'lucide-react';

export default function AccountActivationHub() {
  const { user, setAccountActive, refreshUser } = useAuthStore();
  const { data: contracts, isLoading: loadingContracts } = useContracts('tenant');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    refreshUser();

    const checkTenantProfileStatus = async () => {
      try {
        const tenantProfile = await apiService.getTenantProfile();
        if (tenantProfile) {
          if (tenantProfile.isActive) {
            setAccountActive(true);
          } else {
            setAccountActive(false);
          }
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra hồ sơ khách thuê:', err);
      }
    };

    checkTenantProfileStatus();
  }, [setAccountActive, refreshUser]);

  const hasActiveContract = contracts?.some(c => c.contractStatus === 'Active') || false;

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
            {mounted && user?.isTenancyActivated ? (
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
                Người dùng có thể đăng ký tự do, tìm kiếm căn hộ, trao đổi qua trợ lý ảo và nhận hợp đồng nháp từ Chủ nhà.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
              <div className="text-xs font-bold text-[#166534]">2. Sau khi ký giấy hợp đồng bản cứng</div>
              <p className="text-[11px] text-[#5A5A5A] leading-relaxed">
                Sau khi ký hợp đồng giấy bản cứng ngoài hệ thống, tài khoản của bạn sẽ tự động được chuyển sang trạng thái kích hoạt hoạt động chính thức.
              </p>
            </div>
          </div>
        </div>

        {/* Contract status info indicator */}
        {mounted && !user?.isTenancyActivated && (
          <div className={`p-4 rounded-2xl flex items-start gap-3 text-xs ${hasActiveContract ? 'bg-emerald-50 border border-emerald-200 text-[#065F46]' : 'bg-rose-50 border border-rose-100 text-[#C53030]'}`}>
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold">{hasActiveContract ? 'Hợp đồng đã ký thành công!' : 'Chưa có hợp đồng có hiệu lực!'}</div>
              <p className="opacity-90 mt-0.5">
                {hasActiveContract 
                  ? 'Hệ thống phát hiện bạn đã có hợp đồng ở trạng thái hoạt động (Active).'
                  : 'Bạn phải có ít nhất một hợp đồng ở trạng thái hoạt động (Active) để tài khoản được tự động kích hoạt.'}
              </p>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2">
          {mounted && user?.isTenancyActivated ? (
            <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-bold text-center">
              Tài khoản của bạn đang ở trạng thái HOẠT ĐỘNG (Đã kích hoạt). Quyền truy cập các tính năng thuê nhà đã được mở đầy đủ!
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FEF3C7] text-[#D97706] text-xs font-bold text-center">
              Tài khoản của bạn chưa được kích hoạt. Trạng thái này sẽ tự động thay đổi khi hồ sơ khách thuê của bạn được kích hoạt trên hệ thống.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
