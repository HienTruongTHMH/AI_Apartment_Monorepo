'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Building2, Plus, FileText, ArrowRight, ShieldCheck, DollarSign, Users, MessageSquare } from 'lucide-react';
import { useApartments, useContracts, usePayments } from '@/lib/api-hooks';

export default function OwnerDashboardOverview() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const { data: apartments, isLoading: loadingApts } = useApartments();
  const { data: contracts, isLoading: loadingContracts } = useContracts('owner');
  const { data: payments, isLoading: loadingPayments } = usePayments('owner');

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoading = loadingApts || loadingContracts || loadingPayments;

  // Calculate actual stats
  const totalApartments = Array.isArray(apartments) ? apartments.length : 0;
  const availableApartments = Array.isArray(apartments)
    ? apartments.filter((a: any) => a.apartmentStatus === 'Available' || a.status === 'available').length
    : 0;
  const rentedApartments = Array.isArray(apartments)
    ? apartments.filter((a: any) => a.apartmentStatus === 'Rented' || a.status === 'rented').length
    : 0;

  const activeContracts = Array.isArray(contracts)
    ? contracts.filter((c: any) => c.contractStatus === 'Active' || c.status === 'active').length
    : 0;
  const pendingContracts = Array.isArray(contracts)
    ? contracts.filter((c: any) => c.contractStatus === 'PendingTenantSignature' || c.contractStatus === 'Draft' || c.status === 'pending' || c.status === 'draft').length
    : 0;

  const expectedRevenue = Array.isArray(contracts)
    ? contracts
        .filter((c: any) => c.contractStatus === 'Active' || c.status === 'active')
        .reduce((sum: number, c: any) => sum + Number(c.rentPrice || c.amount || 0), 0)
    : 0;

  if (mounted && isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        {/* Header Summary Skeleton */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 h-36 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="h-3 bg-slate-800 rounded w-1/4"></div>
            <div className="h-7 bg-slate-800 rounded w-1/2"></div>
            <div className="h-3 bg-slate-800 rounded w-2/3"></div>
          </div>
          <div className="w-48 h-12 bg-slate-800 rounded-xl shrink-0"></div>
        </div>

        {/* Stats Counter Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 h-32 space-y-3">
              <div className="h-3 bg-slate-800 rounded w-1/3"></div>
              <div className="h-7 bg-slate-800 rounded w-2/3"></div>
              <div className="h-3 bg-slate-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>

        {/* Quick Action Navigation Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 h-40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
              <div className="h-5 bg-slate-800 rounded w-3/4"></div>
              <div className="h-3 bg-slate-800 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Summary */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Dashboard Chủ hộ</div>
          <h1 className="text-3xl font-black text-white">Bảng Quản Lý Chủ hộ: {mounted ? (user?.fullName || 'Chủ hộ') : 'Chủ hộ'}</h1>
          <p className="text-xs text-gray-400">
            Quản lý danh sách căn hộ, tạo tin đăng bằng AI Verifier và xác nhận hợp đồng với khách thuê
          </p>
        </div>

        <Link
          href="/owner/dashboard/create-listing"
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng Tin Mới Với AI Verifier</span>
        </Link>
      </div>

      {/* Empty Data Warning */}
      {mounted && totalApartments === 0 && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            🏠 **Bạn chưa sở hữu căn hộ nào trên hệ thống**: Hãy bắt đầu bằng cách soạn bài đăng căn hộ mới cùng AI Verifier để thu hút khách thuê.
          </div>
          <Link
            href="/owner/dashboard/create-listing"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 text-xs transition-colors"
          >
            Tạo Căn Hộ Ngay
          </Link>
        </div>
      )}

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Tổng Căn Hộ Sở Hữu</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalApartments} Căn Hộ</div>
          <div className="text-[11px] text-emerald-400 font-semibold">{availableApartments} Đang Trống • {rentedApartments} Đã Thuê</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Hợp Đồng Đang Hiệu Lực</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{activeContracts} Hợp Đồng</div>
          <div className="text-[11px] text-gray-400">Trạng thái: {pendingContracts} hợp đồng đang chờ ký</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Doanh Thu Dự Kiến / Tháng</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{expectedRevenue.toLocaleString('vi-VN')} đ</div>
          <div className="text-[11px] text-gray-400">Cổng VietQR tự động tích hợp</div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Chức năng quản trị nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/owner/dashboard/apartments"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel hover:border-emerald-500/40 transition-all space-y-4 flex flex-col justify-between h-44"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300">Danh Sách Căn Hộ</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">Quản lý chi tiết trạng thái phòng (Trống/Đã thuê), xem danh sách và cập nhật căn hộ.</p>
            </div>
          </Link>

          <Link
            href="/owner/dashboard/contracts"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel hover:border-amber-500/40 transition-all space-y-4 flex flex-col justify-between h-44"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300">Hợp Đồng Cho Thuê</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">Theo dõi trạng thái hợp đồng (Active, Draft, Chờ ký), duyệt yêu cầu chấm dứt.</p>
            </div>
          </Link>

          <Link
            href="/owner/dashboard/payments"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel hover:border-cyan-500/40 transition-all space-y-4 flex flex-col justify-between h-44"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300">Quản Lý Thanh Toán</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">Theo dõi hóa đơn, đối soát lịch sử nộp tiền nhà của khách thuê qua mã VietQR.</p>
            </div>
          </Link>

          <Link
            href="/owner/dashboard/chat"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel hover:border-purple-500/40 transition-all space-y-4 flex flex-col justify-between h-44"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300">Trò Chuyện & AI Broker</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">Trao đổi trực tiếp với khách thuê và xem nhật ký hoạt động của trợ lý AI Broker.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
