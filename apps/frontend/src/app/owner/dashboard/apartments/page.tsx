'use client';

import React from 'react';
import { Building2, Plus, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApartments } from '@/lib/api-hooks';

export default function OwnerApartmentsPage() {
  const router = useRouter();
  const { data: apartments, isLoading, error } = useApartments();

  return (
    <div className="p-6 text-[#2C2C2C] w-full">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-[#2C2C2C]">
            Quản lý Căn hộ
          </h1>
          <p className="text-[#5A5A5A] text-sm max-w-xl">
            Xem danh sách các căn hộ bạn đang cho thuê và trạng thái hiện tại.
          </p>
        </div>
        <Link 
          href="/owner/dashboard/create-listing"
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-[#E03C3D] hover:bg-[#C02C2D] transition-colors text-sm shadow-sm"
        >
          <Plus size={16} /> Đăng tin mới
        </Link>
      </div>

      <div className="bg-[#F9F9F9] border border-[#E8E8E8] rounded-2xl p-6 shadow-sm">
        <h2 className="text-[#2C2C2C] font-bold text-lg mb-6">Căn hộ của bạn</h2>
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E03C3D]"></div>
          </div>
        ) : apartments.length === 0 ? (
          <div className="py-16 text-center text-[#5A5A5A] rounded-xl border border-[#E8E8E8] bg-white shadow-inner">
            <Building2 size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Chưa có căn hộ nào được đăng</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apt: any) => (
              <Link 
                key={apt.id} 
                href={`/apartment/${apt.id}`}
                className="block bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <div className="aspect-video bg-[#F2F2F2] relative overflow-hidden">
                  {apt.apartmentListing?.images?.[0] ? (
                    <img src={apt.apartmentListing.images[0].imageUrl} alt="Căn hộ" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Building2 size={40} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm ${
                      apt.apartmentStatus === 'Available' ? 'bg-[#10B981]' : 'bg-[#E03C3D]'
                    }`}>
                      {apt.apartmentStatus === 'Available' ? 'Trống' : 'Đã thuê'}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-[#2C2C2C] font-bold text-lg mb-1 truncate">{apt.fullAddress || 'Căn hộ mới'}</h3>
                    <p className="text-[#5A5A5A] text-sm">Loại: {apt.type || 'Normal'} • Tầng {apt.floor || 1}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-[#E8E8E8]">
                    <span className="text-[#E03C3D] font-bold text-lg">
                      {apt.apartmentListing?.pricePerMonth 
                        ? `${Number(apt.apartmentListing.pricePerMonth).toLocaleString('vi-VN')} đ/tháng` 
                        : 'Chưa có giá'}
                    </span>
                    <span className="text-[#777777] text-sm">{apt.area || 0} m²</span>
                  </div>

                  {apt.apartmentListing && (
                    <button
                      className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 rounded-[8px] bg-[#F5F5F5] text-[#5A5A5A] hover:bg-[#E03C3D]/10 hover:text-[#E03C3D] border border-[#E8E8E8] transition-all font-semibold text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent card click event
                        router.push(`/owner/dashboard/apartments/${apt.apartmentListing.id}/edit`);
                      }}
                    >
                      <Edit2 size={16} /> Chỉnh sửa tin
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
