'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  Building2,
  ShieldCheck,
  Zap,
  ArrowRight,
  SlidersHorizontal,
  Bot,
  FileCheck,
  UserCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import PropertyCard from '@/components/shared/PropertyCard';
import { apiService, ListingItem } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function LandingPage() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchBedrooms, setSearchBedrooms] = useState('');
  const { toggleAiPanel } = useAuthStore();

  useEffect(() => {
    apiService.getListings().then(setListings);
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Nền tảng Thuê Căn Hộ Tích Hợp Trợ Lý AI Broker Đột Phá</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]"
          >
            Trải Nghiệm Thuê Căn Hộ <br className="hidden sm:inline" />
            <span className="text-gradient-gold-cyan">Thông Minh & Minh Bạch</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Trợ lý AI Broker tự động kết nối khách thuê với căn hộ mơ ước. Quy trình xác nhận thuê minh bạch, ký hợp đồng bản cứng và kích hoạt tài khoản chuẩn nghiệp vụ.
          </motion.p>

          {/* Glass Search Input Console */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 max-w-4xl mx-auto p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-3 items-center"
          >
            {/* District Selector */}
            <div className="flex-1 w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <input
                type="text"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                placeholder="Khu vực (VD: Bình Thạnh, Thủ Thiêm, Quận 1)..."
                className="bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none w-full"
              />
            </div>

            {/* Bedroom Filter */}
            <div className="w-full md:w-48 bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-amber-400 shrink-0" />
              <select
                value={searchBedrooms}
                onChange={(e) => setSearchBedrooms(e.target.value)}
                className="bg-transparent text-white text-sm focus:outline-none w-full cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-gray-300">Tất cả phòng ngủ</option>
                <option value="1" className="bg-slate-900 text-gray-300">1 Phòng ngủ</option>
                <option value="2" className="bg-slate-900 text-gray-300">2 Phòng ngủ</option>
                <option value="3" className="bg-slate-900 text-gray-300">3+ Phòng ngủ</option>
              </select>
            </div>

            {/* Direct Search Button */}
            <Link
              href={`/search?district=${encodeURIComponent(searchDistrict)}&bedroom=${searchBedrooms}`}
              className="w-full md:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Tìm Căn Hộ</span>
            </Link>

            {/* Trigger AI Agent Chat */}
            <button
              onClick={toggleAiPanel}
              className="w-full md:w-auto px-5 py-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <Bot className="w-4.5 h-4.5 text-emerald-400" />
              <span>Hỏi AI Broker</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHT: AI BROKER SIGNATURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/30 p-8 md:p-12 relative overflow-hidden glass-panel">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Signature Feature
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Trợ Lý AI Broker Thông Minh <br />
                <span className="text-gradient-emerald">Tự Động Đề Xuất Căn Hộ Chuẩn Xác</span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Được tích hợp trực tiếp từ dịch vụ Python FastAPI AI Agent, Trợ lý AI Broker không chỉ tìm kiếm theo từ khóa mà còn phân tích nhu cầu phong cách sống, ngân sách và gợi ý 3D thẻ căn hộ phù hợp nhất.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  'Tìm kiếm bằng giọng nói và hội thoại tự nhiên',
                  'Gợi ý thẻ 3D căn hộ trực quan kèm hình ảnh thực tế',
                  'So sánh giá và tiện ích xung quanh thời gian thực'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-xs text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <button
                  onClick={toggleAiPanel}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Bot className="w-5 h-5" />
                  <span>Trải Nghiệm AI Broker Ngay</span>
                </button>
              </div>
            </div>

            {/* Interactive Preview Box */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Bot className="w-4 h-4" /> Live AI Broker Agent Session
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">RAG Engine Connected</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs text-gray-300">
                <span className="text-gray-500">Khách thuê:</span> &quot;Tôi muốn tìm căn hộ Studio tại Metropole Thủ Thiêm dưới 20 triệu, full khóa vân tay.&quot;
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" /> AI Broker Agent:
                </div>
                <p>Tôi tìm thấy Căn Studio Luxury Metropole (Tầng 18, 55m2) với giá 18.5tr/tháng. Đã có khóa FaceID và quản lý miễn phí 1 năm!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS WORKFLOW EXPLANATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-bold text-white">Quy Trình Nghiệp Vụ Minh Bạch & Chuẩn Xác</h2>
          <p className="text-sm text-gray-400">
            Hệ thống tuân thủ luồng quản lý tài khoản và hợp đồng bản cứng chặt chẽ từ khi tạo tài khoản đến kích hoạt thuê thành công.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Tạo Tài Khoản Khách',
              badge: 'Chưa kích hoạt',
              badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
              icon: UserCheck,
              desc: 'Tài khoản được tạo với trạng thái chưa kích hoạt. Khách thuê tự do duyệt căn hộ & chat với AI Broker.'
            },
            {
              step: '02',
              title: 'Tìm & Chọn Căn Hộ',
              badge: 'Duyệt bài đăng',
              badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
              icon: Search,
              desc: 'Tìm kiếm căn hộ qua bộ lọc thông minh hoặc gửi câu hỏi trực tiếp cho AI Broker gợi ý.'
            },
            {
              step: '03',
              title: 'Ký Giấy Bản Cứng',
              badge: 'Hợp đồng ngoài',
              badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
              icon: FileCheck,
              desc: 'Hợp đồng không ký online. Chủ nhà và Khách thuê trao đổi và ký hợp đồng bản cứng ngoài đời thực.'
            },
            {
              step: '04',
              title: 'Xác Nhận & Kích Hoạt',
              badge: 'Đã kích hoạt',
              badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
              icon: ShieldCheck,
              desc: 'Sau khi xác nhận thuê trên hệ thống, tài khoản chuyển sang trạng thái đã kích hoạt và hợp đồng đi vào hiệu lực chính thức.'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 glass-panel hover:border-emerald-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-emerald-400 font-mono">{item.step}</span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <item.icon className="w-8 h-8 text-amber-400" />
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED LUXURY LISTINGS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Danh Mục Nổi Bật</div>
            <h2 className="text-3xl font-bold text-white mt-1">Căn Hộ Sang Trọng Đã Kiểm Định</h2>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Xem tất cả danh sách</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item) => (
            <PropertyCard key={item.id} listing={item} />
          ))}
        </div>
      </section>

      {/* OWNER CALLOUT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 border border-amber-500/30 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 glass-panel-amber">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Dành Cho Chủ Nhà</span>
            <h2 className="text-3xl font-bold text-white">Bạn Muốn Đăng Bài Cho Thuê Căn Hộ?</h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Sử dụng Trợ lý **AI Verifier Engine** để tự động chuẩn hóa văn bản thô, kiểm tra thông tin pháp lý căn hộ và xuất bản bài đăng thu hút khách thuê tiềm năng nhất.
            </p>
          </div>
          <Link
            href="/owner/dashboard/create-listing"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-transform shrink-0 flex items-center gap-2"
          >
            <span>Đăng Bài Với AI Verifier</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
