import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function OwnerCallout() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-xl bg-[#F2F2F2] border border-[#E8E8E8] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <span className="text-xs font-bold text-[#5A5A5A] uppercase tracking-wider">Dành Cho Chủ Nhà</span>
          <h2 className="text-2xl font-semibold text-[#2C2C2C]">Bạn Muốn Đăng Tin Cho Thuê Căn Hộ?</h2>
          <p className="text-sm text-[#5A5A5A] leading-relaxed">
            Trải nghiệm trình đăng tin được tối ưu hóa thông minh giúp tự động sắp xếp thông số căn hộ, kiểm tra tính đầy đủ thông tin pháp lý ban đầu và xuất bản bài đăng chuẩn hóa để tiếp cận khách thuê mục tiêu tốt nhất.
          </p>
        </div>
        <Link
          href="/owner/dashboard/create-listing"
          className="px-8 py-3 rounded-[8px] bg-[#E03C3D] hover:bg-[#C92F30] border-0 text-white font-semibold text-sm flex items-center gap-2 transition-colors duration-200 shrink-0"
        >
          <span>Đăng Bài Ngay</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
