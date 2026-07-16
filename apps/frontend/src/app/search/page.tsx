'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/shared/PropertyCard';
import { apiService, ListingItem } from '@/lib/api';
import { Search, SlidersHorizontal, Building2, Bot, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialDistrict = searchParams.get('district') || '';
  const initialBedroom = searchParams.get('bedroom') || '';
  const initialType = searchParams.get('type') || '';

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState(initialDistrict);
  const [bedroom, setBedroom] = useState(initialBedroom);
  const [type, setType] = useState(initialType);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const { toggleAiPanel } = useAuthStore();

  const fetchFilteredListings = async () => {
    setLoading(true);
    try {
      const data = await apiService.getListings({
        district: district || undefined,
        bedroom: bedroom ? Number(bedroom) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page: page,
        limit: 9
      });

      let results = data;
      if (type) {
        results = results.filter((item) => item.apartment.type.toLowerCase() === type.toLowerCase());
      }
      setListings(results);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [district, bedroom, type, minPrice, maxPrice]);

  useEffect(() => {
    fetchFilteredListings();
  }, [district, bedroom, type, minPrice, maxPrice, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E8E8] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#2C2C2C] flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#E03C3D]" /> Tìm Kiếm & Duyệt Căn Hộ
          </h1>
          <p className="text-xs text-[#5A5A5A] mt-1">
            Khám phá danh sách bất động sản đã kiểm định AI minh bạch hợp đồng
          </p>
        </div>

        <button
          onClick={toggleAiPanel}
          className="px-5 py-3 rounded-xl bg-[#FFF5F5] border border-[#E03C3D]/20 text-[#E03C3D] hover:bg-[#FEE2E2] text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Bot className="w-4.5 h-4.5 text-[#E03C3D]" />
          <span>Tìm Nhanh Bằng Trợ Lý Ảo</span>
        </button>
      </div>

      {/* Filter Control Console */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#F9F9F9] border border-[#E8E8E8] shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-[#FF8E15]" /> Bộ Lọc Tìm Kiếm
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* District Input */}
          <div className="space-y-1">
            <label className="text-xs text-[#5A5A5A]">Quận / Khu vực</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="VD: Bình Thạnh, Quận 1..."
              className="w-full bg-white border border-[#E8E8E8] hover:border-[#999999] focus:border-[#999999] rounded-[8px] px-3.5 py-2 text-xs text-[#2C2C2C] placeholder-gray-400 focus:outline-none transition-all"
            />
          </div>

          {/* Bedroom Select */}
          <div className="space-y-1">
            <label className="text-xs text-[#5A5A5A]">Số phòng ngủ</label>
            <select
              value={bedroom}
              onChange={(e) => setBedroom(e.target.value)}
              className="w-full bg-white border border-[#E8E8E8] hover:border-[#999999] focus:border-[#999999] rounded-[8px] px-3.5 py-2 text-xs text-[#2C2C2C] focus:outline-none transition-all"
            >
              <option value="">Tất cả phòng ngủ</option>
              <option value="1">1 PN</option>
              <option value="2">2 PN</option>
              <option value="3">3+ PN</option>
            </select>
          </div>

          {/* Apartment Type Select */}
          <div className="space-y-1">
            <label className="text-xs text-[#5A5A5A]">Loại căn hộ</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white border border-[#E8E8E8] hover:border-[#999999] focus:border-[#999999] rounded-[8px] px-3.5 py-2 text-xs text-[#2C2C2C] focus:outline-none transition-all"
            >
              <option value="">Tất cả phân loại</option>
              <option value="Normal">Căn hộ thường (Normal)</option>
              <option value="Studio">Studio</option>
              <option value="Officetel">Officetel</option>
              <option value="Shophouse">Shophouse</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Duplex">Duplex</option>
              <option value="SkyVilla">Sky Villa</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <label className="text-xs text-[#5A5A5A]">Giá tối đa (VNĐ/tháng)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="VD: 30000000"
              className="w-full bg-white border border-[#E8E8E8] hover:border-[#999999] focus:border-[#999999] rounded-[8px] px-3.5 py-2 text-xs text-[#2C2C2C] placeholder-gray-400 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Results Display */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-gray-400">Đang truy vấn danh sách căn hộ...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-2xl bg-[#F9F9F9] border border-[#E8E8E8] p-8 shadow-sm">
          <AlertCircle className="w-10 h-10 text-[#FF8E15] mx-auto" />
          <h3 className="text-base font-bold text-[#2C2C2C]">Không tìm thấy căn hộ phù hợp</h3>
          <p className="text-xs text-[#5A5A5A] max-w-sm mx-auto">
            Hãy thử điều chỉnh lại bộ lọc hoặc bấm nút bên dưới để nhờ trợ lý ảo tìm thêm dữ liệu khác.
          </p>
          <button
            onClick={toggleAiPanel}
            className="px-5 py-2.5 rounded-[8px] bg-[#E03C3D] hover:bg-[#C92F30] text-white font-bold text-xs border-0 transition-colors inline-flex items-center gap-2"
          >
            <Bot className="w-4 h-4" /> Hỏi Trợ Lý Ảo
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((item) => (
              <PropertyCard key={item.id} listing={item} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-4 pt-6 border-t border-[#E8E8E8]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-[8px] bg-white border border-[#E8E8E8] hover:border-[#999999] text-[#5A5A5A] hover:text-[#2C2C2C] disabled:opacity-50 text-xs font-semibold transition-all"
            >
              Trang trước
            </button>
            <span className="text-xs text-[#5A5A5A]">
              Trang {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={listings.length < 9}
              className="px-4 py-2 rounded-[8px] bg-white border border-[#E8E8E8] hover:border-[#999999] text-[#5A5A5A] hover:text-[#2C2C2C] disabled:opacity-50 text-xs font-semibold transition-all"
            >
              Trang sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-400">Đang tải trang tìm kiếm...</div>}>
      <SearchContent />
    </Suspense>
  );
}
