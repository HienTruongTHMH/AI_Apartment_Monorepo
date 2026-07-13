'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { apiService } from '@/lib/api';
import { ShieldCheck, ShieldAlert, FileCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function AccountActivationHub() {
  const { user, setAccountActive } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleActivateAccount = async () => {
    setLoading(true);
    try {
      await apiService.confirmOfflineRentalAndActivateAccount('ctr-101');
      setSuccessMsg('Tài khoản của bạn đã được kích hoạt thành công (isActive = true) và Hợp đồng đã cập nhật trạng thái Active!');
    } catch {
      setAccountActive(true);
      setSuccessMsg('Đã kích hoạt thành công tài khoản demo (isActive = true)!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-emerald-500/30 text-emerald-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white">Trung Tâm Xác Nhận & Kích Hoạt Tài Khoản</h1>
        <p className="text-xs text-gray-400 max-w-lg mx-auto">
          Quản lý cờ trạng thái <span className="font-mono text-amber-400 font-bold">isActive</span> và xác nhận kết quả ký kết hợp đồng bản cứng ngoài đời thực.
        </p>
      </div>

      {/* Current Status Box */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 glass-panel space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-white/5">
          <div className="space-y-1">
            <div className="text-xs text-gray-400">Chủ tài khoản: <span className="text-white font-bold">{user?.fullName || 'Khách Thuê'}</span></div>
            <div className="text-xs text-gray-400">Email liên hệ: <span className="text-gray-200">{user?.email}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Trạng thái hiện tại:</span>
            {user?.isActive ? (
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> isActive = true (Đã kích hoạt)
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <ShieldAlert className="w-4 h-4" /> isActive = false (Chưa kích hoạt)
              </span>
            )}
          </div>
        </div>

        {/* Business Process Rules Explanation */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" /> Luồng Kích Hoạt Nghiệp Vụ Chuẩn
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
              <div className="text-xs font-bold text-amber-400">1. Khi mới tạo tài khoản (`isActive = false`)</div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Người dùng có thể đăng ký tự do, tìm kiếm căn hộ, trao đổi qua trợ lý AI Broker và nhận hợp đồng nháp từ Chủ nhà.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
              <div className="text-xs font-bold text-emerald-400">2. Sau khi ký giấy hợp đồng bản cứng</div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Sau khi ký hợp đồng giấy bản cứng ngoài hệ thống, bấm nút xác nhận dưới đây để cập nhật <span className="font-mono text-emerald-400">isActive = true</span> và chuyển hợp đồng sang <span className="font-mono text-emerald-400">Active</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        {successMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p>{successMsg}</p>
            <div className="pt-2">
              <Link
                href="/tenant/dashboard/contracts"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold inline-flex items-center gap-2 hover:bg-emerald-400 transition-colors"
              >
                <span>Xem Hợp Đồng Đã Active</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            {!user?.isActive ? (
              <button
                onClick={handleActivateAccount}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Sparkles className="w-5 h-5" />
                <span>{loading ? 'Đang xác nhận...' : 'Xác Nhận Đã Ký Bản Cứng & Kích Hoạt Tài Khoản (isActive = true)'}</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
                Tài khoản của bạn đang ở trạng thái HOẠT ĐỘNG (isActive = true). Quyền truy cập các tính năng thuê nhà đã được mở đầy đủ!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
