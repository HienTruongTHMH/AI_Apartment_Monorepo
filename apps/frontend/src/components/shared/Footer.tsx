'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, Heart, Quote, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#F9F9F9] border-t border-[#E8E8E8] pt-16 pb-12 text-[#5A5A5A] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E03C3D] p-0.5 shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Building2 className="w-4 h-4 text-[#E03C3D]" />
              </div>
            </div>
            <span className="font-extrabold text-[#2C2C2C] text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2C2C2C] to-[#5A5A5A]">
              NestaVIET
            </span>
          </div>
          <p className="text-xs text-[#5A5A5A] leading-relaxed">
            Nền tảng công nghệ hỗ trợ thuê căn hộ chính chủ cao cấp, giúp kết nối nhanh chóng, minh bạch và tối ưu hóa thời gian tìm kiếm không gian sống lý tưởng.
          </p>
          
          {/* Lời hứa thương hiệu thay thế cho thông số Tech Stack */}
          <div className="flex items-center gap-2 text-xs text-[#2C2C2C] bg-[#FFF5F5] border border-[#E03C3D]/10 p-2.5 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-[#E03C3D]" />
            <span className="font-medium text-[#E03C3D]">Giao Dịch An Tâm • Thông Tin Xác Thực</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-[#2C2C2C] font-bold text-xs uppercase tracking-wider">Khám Phá Danh Mục</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="text-[#5A5A5A] hover:text-[#E03C3D] transition-colors flex items-center gap-0.5">Trang chủ</Link></li>
            <li><Link href="/search" className="text-[#5A5A5A] hover:text-[#E03C3D] transition-colors flex items-center gap-0.5">Tìm kiếm căn hộ</Link></li>
            <li><Link href="/search?type=Studio" className="text-[#5A5A5A] hover:text-[#E03C3D] transition-colors flex items-center gap-0.5">Căn hộ Studio tiện nghi</Link></li>
            <li><Link href="/search?type=Penthouse" className="text-[#5A5A5A] hover:text-[#E03C3D] transition-colors flex items-center gap-0.5">Premium Penthouse & Sky Villa</Link></li>
          </ul>
        </div>

        {/* Business Workflow Info */}
        <div className="space-y-3">
          <h4 className="text-[#2C2C2C] font-bold text-xs uppercase tracking-wider">Quy Trình Thuê Nhà</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2 text-[#5A5A5A]">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              1. Khởi tạo & Trải nghiệm tìm kiếm
            </li>
            <li className="flex items-center gap-2 text-[#5A5A5A]">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              2. Kết nối chủ nhà & Xem căn hộ thực tế
            </li>
            <li className="flex items-center gap-2 text-[#5A5A5A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E03C3D]" />
              3. Ký kết hợp đồng giấy trực tiếp ngoài đời
            </li>
            <li className="flex items-center gap-2 text-[#5A5A5A]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              4. Xác nhận thuê thành công trên hệ thống
            </li>
          </ul>
        </div>

        {/* Value Proposition Tags (Thay thế hoàn toàn mảng Tech Badges cũ) */}
        <div className="space-y-3">
          <h4 className="text-[#2C2C2C] font-bold text-xs uppercase tracking-wider">Về Chúng Tôi</h4>
          <p className="text-xs text-[#5A5A5A] leading-relaxed">
            Ứng dụng công nghệ xử lý ngôn ngữ tự nhiên giúp tối giản quy trình tìm kiếm nhà truyền thống, loại bỏ tin đăng trùng lặp.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-[6px] bg-[#F2F2F2] border border-[#E8E8E8] text-[11px] text-[#2C2C2C] font-medium">
              Thông Tin Xác Thực
            </span>
            <span className="px-2.5 py-1 rounded-[6px] bg-[#F2F2F2] border border-[#E8E8E8] text-[11px] text-[#2C2C2C] font-medium">
              Hỗ Trợ Tìm Kiếm 24/7
            </span>
            <span className="px-2.5 py-1 rounded-[6px] bg-[#F2F2F2] border border-[#E8E8E8] text-[11px] text-[#2C2C2C] font-medium">
              Bảo Mật Dữ Liệu
            </span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[#E8E8E8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5A5A5A] gap-4">
        <div>© 2026 NestaVIET Platforms. Bản quyền đã được bảo hộ.</div>
        <div className="flex items-center gap-1 text-[#777777]">
          Developed by <Heart className="w-3.5 h-3.5 text-[#E03C3D] fill-[#E03C3D]" /> VNUK23
        </div>
      </div>
    </footer>
  );
}