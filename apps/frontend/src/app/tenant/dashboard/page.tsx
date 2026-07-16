'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { ShieldCheck, ShieldAlert, FileText, ArrowRight, Sparkles, Home, Clock, Users } from 'lucide-react';

export default function TenantDashboardOverview() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E8E8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs text-[#2C2C2C] font-semibold uppercase tracking-wider">Dashboard Khách Hàng</div>
          <h1 className="text-3xl font-black text-[#2C2C2C]">Xin chào, {mounted ? (user?.fullName || 'Khách Hàng') : 'Khách Hàng'}</h1>
          <p className="text-xs text-[#5A5A5A]">
            Quản lý hồ sơ thuê căn hộ, theo dõi hợp đồng bản cứng & kích hoạt tài khoản
          </p>
        </div>
 
        {/* Account Activation Badge Status */}
        {mounted && !user?.isTenancyActivated && (
          <div className="p-4 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm shrink-0 space-y-2">
            <div className="text-[11px] text-[#5A5A5A]">Trạng Thái Kích Hoạt Tài Khoản</div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#B7791F] flex items-center gap-1.5 bg-[#FFF9E6] border border-[#FEEBC8] px-3 py-1.5 rounded-xl animate-pulse">
                <ShieldAlert className="w-4 h-4 text-[#B7791F]" />
                <span>Chưa Kích Hoạt</span>
              </div>
              <Link
                href="/tenant/dashboard/activate"
                className="text-[11px] text-[#E03C3D] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Xác nhận đã ký bản cứng để kích hoạt</span>
                <ArrowRight className="w-3 h-3 text-[#E03C3D]" />
              </Link>
            </div>
          </div>
        )}
      </div>
 
      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/tenant/dashboard/contracts"
          className="group p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm hover:border-[#E03C3D]/40 hover:shadow-md transition-all space-y-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] text-[#E03C3D] flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C2C2C] group-hover:text-[#E03C3D]">Quản Lý Hợp Đồng</h3>
            <p className="text-xs text-[#5A5A5A] mt-1">Xem hợp đồng nháp & trạng thái Active sau xác nhận giấy</p>
          </div>
          <div className="text-xs font-medium text-[#E03C3D] group-hover:underline flex items-center gap-1 pt-2">
            <span>Chi tiết hợp đồng</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        
        <Link
          href="/tenant/dashboard/rental-requests"
          className="group p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm hover:border-[#E03C3D]/40 hover:shadow-md transition-all space-y-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] text-[#E03C3D] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C2C2C] group-hover:text-[#E03C3D]">Yêu Cầu Thuê</h3>
            <p className="text-xs text-[#5A5A5A] mt-1">Theo dõi danh sách yêu cầu thuê bạn đã gửi cho các chủ nhà</p>
          </div>
          <div className="text-xs font-medium text-[#E03C3D] group-hover:underline flex items-center gap-1 pt-2">
            <span>Quản lý yêu cầu</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
 
        {!(mounted && user?.isTenancyActivated) && (
          <Link
            href="/tenant/dashboard/activate"
            className="group p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm hover:border-[#E03C3D]/40 hover:shadow-md transition-all space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] text-[#E03C3D] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C2C2C] group-hover:text-[#E03C3D]">Kích Hoạt Tài Khoản</h3>
              <p className="text-xs text-[#5A5A5A] mt-1">Xác nhận đã ký bản cứng để kích hoạt tài khoản sử dụng dịch vụ</p>
            </div>
            <div className="text-xs font-medium text-[#E03C3D] group-hover:underline flex items-center gap-1 pt-2">
              <span>Kích hoạt ngay</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        )}

        <Link
          href="/search"
          className="group p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm hover:border-[#E03C3D]/40 hover:shadow-md transition-all space-y-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] text-[#E03C3D] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C2C2C] group-hover:text-[#E03C3D]">Duyệt Thêm Căn Hộ</h3>
            <p className="text-xs text-[#5A5A5A] mt-1">Tìm kiếm không giới hạn & nhận gợi ý từ Trợ Lý Ảo</p>
          </div>
          <div className="text-xs font-medium text-[#E03C3D] group-hover:underline flex items-center gap-1 pt-2">
            <span>Khám phá ngay</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
