'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { ShieldCheck, ShieldAlert, FileText, ArrowRight, Sparkles, Home, Clock } from 'lucide-react';

export default function TenantDashboardOverview() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Dashboard Khách Hàng</div>
          <h1 className="text-3xl font-black text-white">Xin chào, {mounted ? (user?.fullName || 'Khách Hàng') : 'Khách Hàng'}</h1>
          <p className="text-xs text-gray-400">
            Quản lý hồ sơ thuê căn hộ, theo dõi hợp đồng bản cứng & kích hoạt tài khoản
          </p>
        </div>

        {/* Account Activation Badge Status */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 shrink-0 space-y-2">
          <div className="text-[11px] text-gray-400">Trạng Thái Kích Hoạt Tài Khoản</div>
          {mounted && user?.isActive ? (
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Đã Kích Hoạt</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl animate-pulse">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Chưa Kích Hoạt</span>
              </div>
              <Link
                href="/tenant/dashboard/activate"
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Xác nhận đã ký bản cứng để kích hoạt</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/tenant/dashboard/contracts"
          className="group p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel hover:border-emerald-500/40 transition-all space-y-4"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300">Quản Lý Hợp Đồng</h3>
            <p className="text-xs text-gray-400 mt-1">Xem hợp đồng nháp & trạng thái Active sau xác nhận giấy</p>
          </div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-2">
            <span>Chi tiết hợp đồng</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/tenant/dashboard/activate"
          className="group p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel hover:border-amber-500/40 transition-all space-y-4"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300">Kích Hoạt Tài Khoản</h3>
            <p className="text-xs text-gray-400 mt-1">Xác nhận đã ký bản cứng để kích hoạt tài khoản sử dụng dịch vụ</p>
          </div>
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1 pt-2">
            <span>Kích hoạt ngay</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/search"
          className="group p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel hover:border-cyan-500/40 transition-all space-y-4"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300">Duyệt Thêm Căn Hộ</h3>
            <p className="text-xs text-gray-400 mt-1">Tìm kiếm không giới hạn & nhận gợi ý từ AI Broker Agent</p>
          </div>
          <div className="text-xs font-bold text-cyan-400 flex items-center gap-1 pt-2">
            <span>Khám phá ngay</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
