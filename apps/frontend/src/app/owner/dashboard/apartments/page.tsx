'use client';

import React from 'react';
import { Building2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useApartments } from '@/lib/api-hooks';

export default function OwnerApartmentsPage() {
  const { data: apartments, isLoading, error } = useApartments();

  return (
    <div className="p-6 text-white w-full">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white">
            Quản lý Căn hộ
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Xem danh sách các căn hộ bạn đang cho thuê và trạng thái hiện tại.
          </p>
        </div>
        <Link 
          href="/owner/dashboard/create-listing"
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-900 bg-amber-400 hover:bg-amber-500 transition-colors text-sm"
        >
          <Plus size={16} /> Đăng tin mới
        </Link>
      </div>

      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-white font-bold text-lg mb-6">Căn hộ của bạn</h2>
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : apartments.length === 0 ? (
          <div className="py-16 text-center text-gray-400 rounded-xl border border-white/5 bg-slate-950/30">
            <Building2 size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Chưa có căn hộ nào được đăng</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apt: any) => (
              <div key={apt.id} className="bg-slate-950 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all cursor-pointer group">
                <div className="aspect-video bg-slate-900 relative">
                  {apt.apartmentListing?.images?.[0] ? (
                    <img src={apt.apartmentListing.images[0].imageUrl} alt="Căn hộ" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <Building2 size={40} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      apt.apartmentStatus === 'Available' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                    }`}>
                      {apt.apartmentStatus === 'Available' ? 'Trống' : 'Đã thuê'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-1 truncate">{apt.fullAddress || 'Căn hộ mới'}</h3>
                  <p className="text-gray-400 text-sm mb-3">Loại: {apt.type || 'Normal'} • Tầng {apt.floor || 1}</p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-amber-400 font-bold">
                      {apt.apartmentListing?.pricePerMonth 
                        ? `${Number(apt.apartmentListing.pricePerMonth).toLocaleString('vi-VN')} đ/tháng` 
                        : 'Chưa có giá'}
                    </span>
                    <span className="text-gray-500 text-sm">{apt.area || 0} m²</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
