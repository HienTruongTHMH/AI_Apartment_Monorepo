'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService, ContractItem } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  DollarSign,
  User,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function TenantContractsPage() {
  const { user, setAccountActive } = useAuthStore();
  const [contracts, setContracts] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSuccess, setActiveSuccess] = useState<string | null>(null);

  useEffect(() => {
    apiService.getContracts().then((data) => {
      setContracts(data);
      setLoading(false);
    });
  }, []);

  const handleConfirmPhysicalSign = async (contractId: string) => {
    await apiService.confirmOfflineRentalAndActivateAccount(contractId);
    setAccountActive(true);
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, contractStatus: 'Active' as const } : c))
    );
    setActiveSuccess('Hợp đồng đã chuyển sang trạng thái ACTIVE và Tài khoản của bạn đã được kích hoạt thành công!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-400" /> Quản Lý Hợp Đồng Thuê Nhà
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Theo dõi trạng thái hợp đồng bản cứng & cập nhật kích hoạt tài khoản
          </p>
        </div>

        <Link
          href="/tenant/dashboard/activate"
          className="px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-2 transition-all"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Trang Kích Hoạt Tài Khoản</span>
        </Link>
      </div>

      {activeSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <span>{activeSuccess}</span>
        </div>
      )}

      {/* Contract Cards List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs">Đang tải danh sách hợp đồng...</div>
      ) : contracts.length === 0 ? (
        <div className="py-20 text-center space-y-3 rounded-2xl bg-slate-900/40 border border-white/5">
          <p className="text-sm font-bold text-white">Bạn chưa có hợp đồng thuê nào</p>
          <Link href="/search" className="text-xs text-emerald-400 hover:underline inline-block font-bold">
            Tìm căn hộ và gửi yêu cầu thuê ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {contracts.map((ctr) => (
            <div
              key={ctr.id}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 glass-panel space-y-6 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Mã Hợp Đồng: #{ctr.id}</h3>
                    <p className="text-xs text-gray-400">Chủ nhà: {ctr.owner?.fullName || 'Nguyễn Văn Minh'}</p>
                  </div>
                </div>

                {/* Contract Status Badge */}
                <div>
                  {ctr.contractStatus === 'Active' ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Contract Status: ACTIVE
                    </span>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Status: {ctr.contractStatus} (Chờ Xác Nhận Ký Giấy)
                    </span>
                  )}
                </div>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                  <span className="text-[11px] text-gray-400 uppercase">Giá Thuê Hàng Tháng</span>
                  <div className="text-base font-bold text-amber-400">
                    {ctr.rentPrice.toLocaleString('vi-VN')} đ/tháng
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                  <span className="text-[11px] text-gray-400 uppercase">Tiền Đặt Cọc</span>
                  <div className="text-base font-bold text-emerald-400">
                    {ctr.deposit.toLocaleString('vi-VN')} đ
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                  <span className="text-[11px] text-gray-400 uppercase">Thời Hạn Hợp Đồng</span>
                  <div className="text-xs font-semibold text-white">
                    {ctr.startDate} -&gt; {ctr.endDate}
                  </div>
                </div>
              </div>

              {/* Contract Terms */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 text-xs text-gray-300 space-y-1">
                <div className="font-bold text-white">Điều khoản cam kết:</div>
                <p className="leading-relaxed">{ctr.terms}</p>
              </div>

              {/* Physical Sign Confirmation Action Button */}
              {ctr.contractStatus !== 'Active' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-amber-200">
                    * Bạn đã gặp Chủ nhà và ký kết **giấy hợp đồng bản cứng ngoài thực tế**? Nhấp nút bên cạnh để hoàn tất quy trình kích hoạt.
                  </div>
                  <button
                    onClick={() => handleConfirmPhysicalSign(ctr.id)}
                    className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                  >
                    Xác Nhận Đã Ký Bản Cứng (Kích Hoạt Active)
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
