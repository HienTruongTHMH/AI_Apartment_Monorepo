'use client';

import React from 'react';
import ContractManager from '@/components/features/contracts/ContractManager';
import AuthGuard from '@/components/shared/AuthGuard';
import { useRentalRequests } from '@/lib/api-hooks';
import { FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TenantContractsPage() {
  const { data: requests, isLoading } = useRentalRequests('tenant');

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-[#5A5A5A]">
        Đang tải kiểm tra yêu cầu thuê...
      </div>
    );
  }

  const hasRentalRequest = requests.length > 0;

  if (!hasRentalRequest) {
    return (
      <AuthGuard requireActive={false}>
        <div className="max-w-md mx-auto my-20 p-8 bg-white border border-[#E8E8E8] rounded-3xl shadow-sm text-center space-y-4">
          <FileText className="w-12 h-12 text-[#E03C3D] mx-auto opacity-30" />
          <h2 className="text-xl font-bold text-[#2C2C2C]">Hợp Đồng Bị Khóa</h2>
          <p className="text-xs text-[#5A5A5A] leading-relaxed">
            Trang hợp đồng chỉ được mở sau khi bạn đã gửi ít nhất một yêu cầu thuê căn hộ trên hệ thống.
          </p>
          <div className="pt-2">
            <Link
              href="/search"
              className="px-6 py-2.5 rounded-xl bg-[#E03C3D] hover:bg-[#C92F30] text-white font-bold text-xs inline-flex items-center gap-2 transition-all"
            >
              <span>Tìm kiếm căn hộ & Gửi yêu cầu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireActive={false}>
      <div className="p-6">
        <ContractManager role="tenant" />
      </div>
    </AuthGuard>
  );
}
