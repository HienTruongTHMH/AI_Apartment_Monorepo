import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';
import PropertyCard from '@/components/shared/PropertyCard';
import { ListingItem } from '@/lib/api';

export default function FeaturedListings({ listings }: { listings: ListingItem[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-xs font-semibold text-[#E03C3D] uppercase tracking-widest">Danh Mục Nổi Bật</div>
          <h2 className="text-2xl font-semibold text-[#2C2C2C] mt-1">Căn Hộ Sang Trọng Đã Kiểm Định</h2>
        </div>
        <Link
          href="/search"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#E03C3D] hover:text-[#C82A2A] transition-colors"
        >
          <span>Xem tất cả danh sách</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item) => (
            <PropertyCard key={item.id} listing={item} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 rounded-2xl bg-[#F9F9F9] border border-[#E8E8E8] shadow-sm">
          <Building2 className="w-10 h-10 text-[#E03C3D]/40 mx-auto" />
          <h3 className="text-base font-bold text-[#2C2C2C]">
            Hiện chưa có căn hộ nổi bật
          </h3>
          <p className="text-xs text-[#5A5A5A] max-w-sm mx-auto">
            Tất cả căn hộ đang được thuê. Hãy quay lại sau hoặc tìm kiếm với bộ lọc chi tiết hơn.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#E03C3D] hover:bg-[#C92F30] text-white font-semibold text-xs transition-colors"
          >
            Tìm kiếm tất cả căn hộ <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
