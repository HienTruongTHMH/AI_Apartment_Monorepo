'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService, ListingItem } from '@/lib/api';
import { Building2, Plus, ShieldCheck, MapPin, Bed, Bath, Maximize2, ExternalLink } from 'lucide-react';

export default function OwnerApartmentsPage() {
  const [apartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getMyApartments().then((data) => {
      setApartments(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-emerald-400" /> Quản Lý Căn Hộ Đang Sở Hữu
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Danh sách căn hộ thuộc quyền sở hữu của bạn và tình trạng cho thuê
          </p>
        </div>

        <Link
          href="/owner/dashboard/create-listing"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Tin Đăng Mới Với AI</span>
        </Link>
      </div>

      {/* Grid of Owner Apartments */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs">Đang tải danh sách căn hộ...</div>
      ) : apartments.length === 0 ? (
        <div className="py-20 text-center space-y-3 rounded-2xl bg-slate-900/40 border border-white/5">
          <p className="text-sm font-bold text-white">Bạn chưa tạo căn hộ nào</p>
          <Link
            href="/owner/dashboard/create-listing"
            className="text-xs text-emerald-400 font-bold hover:underline inline-block"
          >
            Đăng bài căn hộ đầu tiên ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apt) => (
            <div
              key={apt.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 glass-panel flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    {apt.type || 'Studio'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-emerald-400 text-xs font-bold border border-white/10">
                    {apt.apartmentStatus || 'Available'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">Phòng {apt.room_number} • Tầng {apt.floor}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {apt.fullAddress || apt.district}
                </p>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-xs text-gray-300">
                  <div className="flex items-center gap-1 justify-center bg-slate-950 p-1.5 rounded-lg">
                    <Bed className="w-3.5 h-3.5 text-emerald-400" /> {apt.bedroom || 1} PN
                  </div>
                  <div className="flex items-center gap-1 justify-center bg-slate-950 p-1.5 rounded-lg">
                    <Bath className="w-3.5 h-3.5 text-emerald-400" /> {apt.bathroom || 1} WC
                  </div>
                  <div className="flex items-center gap-1 justify-center bg-slate-950 p-1.5 rounded-lg">
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-400" /> {apt.area || 50} m²
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/apartment/${apt.id}`}
                  className="w-full py-2 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-500/40 text-gray-300 hover:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Xem Chi Tiết Bài Đăng</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
