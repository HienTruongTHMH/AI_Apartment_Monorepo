'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Building2, Plus, FileText, ArrowRight, ShieldCheck, DollarSign, Users } from 'lucide-react';
import { useApartments, useContracts, usePayments } from '@/lib/api-hooks';

export default function OwnerDashboardOverview() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const { data: apartments } = useApartments();
  const { data: contracts } = useContracts('owner');
  const { data: payments } = usePayments('owner');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate actual stats
  const totalApartments = apartments.length;
  const availableApartments = apartments.filter((a: any) => a.apartmentStatus === 'Available').length;
  const rentedApartments = apartments.filter((a: any) => a.apartmentStatus === 'Rented').length;

  const activeContracts = contracts.filter((c: any) => c.contractStatus === 'Active').length;
  const pendingContracts = contracts.filter((c: any) => c.contractStatus === 'PendingTenantSignature' || c.contractStatus === 'Draft').length;

  const expectedRevenue = contracts
    .filter((c: any) => c.contractStatus === 'Active')
    .reduce((sum: number, c: any) => sum + Number(c.rentPrice || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Summary */}
      <div className="p-8 rounded-3xl bg-white border border-[#E8E8E8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs text-[#E03C3D] font-bold uppercase tracking-wider">Dashboard Chủ hộ</div>
          <h1 className="text-3xl font-black text-[#2C2C2C]">Bảng Quản Lý Chủ hộ: {mounted ? (user?.fullName || 'Chủ hộ') : 'Chủ hộ'}</h1>
          <p className="text-xs text-[#5A5A5A]">
            Quản lý danh sách căn hộ, tạo tin đăng bằng AI Verifier và xác nhận hợp đồng với khách thuê
          </p>
        </div>

        <Link
          href="/owner/dashboard/create-listing"
          className="px-6 py-3.5 rounded-xl bg-[#E03C3D] hover:bg-[#C92F30] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng Tin Mới Với AI Verifier</span>
        </Link>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5A5A5A]">
            <span>Tổng Căn Hộ Sở Hữu</span>
            <Building2 className="w-4 h-4 text-[#E03C3D]" />
          </div>
          <div className="text-3xl font-black text-[#2C2C2C]">{totalApartments} Căn Hộ</div>
          <div className="text-[11px] text-[#5A5A5A] font-semibold">
            <span className="text-[#E03C3D]">{availableApartments} Đang Trống</span> • <span>{rentedApartments} Đã Thuê</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5A5A5A]">
            <span>Hợp Đồng Đang Hiệu Lực</span>
            <ShieldCheck className="w-4 h-4 text-[#E03C3D]" />
          </div>
          <div className="text-3xl font-black text-[#E03C3D]">{activeContracts} Hợp Đồng</div>
          <div className="text-[11px] text-[#5A5A5A]">Trạng thái: {pendingContracts} hợp đồng đang chờ ký</div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5A5A5A]">
            <span>Doanh Thu Dự Kiến / Tháng</span>
            <DollarSign className="w-4 h-4 text-[#E03C3D]" />
          </div>
          <div className="text-3xl font-black text-[#2C2C2C]">{expectedRevenue.toLocaleString('vi-VN')} đ</div>
          <div className="text-[11px] text-[#5A5A5A]">Cổng VietQR tự động tích hợp</div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/owner/dashboard/apartments"
          className="group p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm hover:border-[#E03C3D]/40 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] text-[#E03C3D] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#E03C3D] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C2C2C] group-hover:text-[#E03C3D]">Danh Sách Căn Hộ Của Tôi</h3>
            <p className="text-xs text-[#5A5A5A] mt-1">Xem chi tiết trạng thái phòng (Available / Rented) và chỉnh sửa tin</p>
          </div>
        </Link>

        <Link
          href="/owner/dashboard/create-listing"
          className="group p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm hover:border-[#E03C3D]/40 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] text-[#E03C3D] flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#E03C3D] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C2C2C] group-hover:text-[#E03C3D]">Soạn Bài Đăng AI</h3>
            <p className="text-xs text-[#5A5A5A] mt-1">Sử dụng AI Verifier để phân tích tin đăng</p>
          </div>
        </Link>
        
        <Link
          href="/owner/dashboard/rental-requests"
          className="group p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm hover:border-[#E03C3D]/40 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] text-[#E03C3D] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#E03C3D] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C2C2C] group-hover:text-[#E03C3D]">Yêu Cầu Thuê</h3>
            <p className="text-xs text-[#5A5A5A] mt-1">Xem, duyệt hoặc từ chối các yêu cầu thuê gửi đến</p>
          </div>
        </Link>
        
        <Link
          href="/owner/dashboard/contracts"
          className="group p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-sm hover:border-[#E03C3D]/40 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] border border-[#FEE2E2] text-[#E03C3D] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#E03C3D] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C2C2C] group-hover:text-[#E03C3D]">Quản Lý Hợp Đồng</h3>
            <p className="text-xs text-[#5A5A5A] mt-1">Gửi hợp đồng cho khách và theo dõi trạng thái</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
