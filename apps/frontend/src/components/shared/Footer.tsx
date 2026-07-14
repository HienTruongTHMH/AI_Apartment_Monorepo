'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Sparkles, ShieldCheck, Cpu, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 pt-16 pb-12 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">AI APARTMENT</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Nền tảng thuê căn hộ cao cấp thế hệ mới tích hợp Trợ lý AI Broker & AI Verifier đối soát hợp đồng minh bạch.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 p-2 rounded-xl">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>NestJS + FastAPI AI Agent Architecture</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Khám Phá</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Trang chủ</Link></li>
            <li><Link href="/search" className="hover:text-emerald-400 transition-colors">Tìm kiếm căn hộ</Link></li>
            <li><Link href="/search?type=Studio" className="hover:text-emerald-400 transition-colors">Căn hộ Studio</Link></li>
            <li><Link href="/search?type=Penthouse" className="hover:text-emerald-400 transition-colors">Penthouse & Sky Villa</Link></li>
          </ul>
        </div>

        {/* Business Workflow Info */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Quy Trình Nghiệp Vụ</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2 text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              1. Đăng ký (Chưa kích hoạt)
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              2. Trao đổi & duyệt hợp đồng nháp
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              3. Ký giấy hợp đồng bản cứng ngoài
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              4. Xác nhận hệ thống -&gt; Đã kích hoạt
            </li>
          </ul>
        </div>

        {/* Tech Badges */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Công Nghệ AI</h4>
          <p className="text-xs text-gray-400">
            Trợ lý AI Broker hỗ trợ RAG tìm kiếm ngữ nghĩa, AI Verifier kiểm định tin đăng tự động theo thời gian thực.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-[11px] text-emerald-400 font-mono">
              FastAPI Python RAG
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-[11px] text-cyan-400 font-mono">
              NestJS Microservices
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-[11px] text-amber-400 font-mono">
              Prisma PostgreSQL
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div>© 2026 AI Apartment Monorepo. All Rights Reserved.</div>
        <div className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for AI Luxury Rental Demo
        </div>
      </div>
    </footer>
  );
}
