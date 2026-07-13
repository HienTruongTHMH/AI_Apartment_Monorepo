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
  const { toggleAiPanel } = useAuthStore();

  const fetchFilteredListings = async () => {
    setLoading(true);
    try {
      const data = await apiService.getListings({
        district: district || undefined,
        bedroom: bedroom ? Number(bedroom) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined
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
    fetchFilteredListings();
  }, [district, bedroom, type, minPrice, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-emerald-400" /> Tìm Kiếm & Duyệt Căn Hộ
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Khám phá danh sách bất động sản đã kiểm định AI minh bạch hợp đồng
          </p>
        </div>

        <button
          onClick={toggleAiPanel}
          className="px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
        >
          <Bot className="w-4.5 h-4.5 text-emerald-400" />
          <span>Tìm Nhanh Bằng AI Broker Agent</span>
        </button>
      </div>

      {/* Filter Control Console */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-white/10 glass-panel space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" /> Bộ Lọc Tìm Kiếm
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* District Input */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Quận / Khu vực</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="VD: Bình Thạnh, Quận 1..."
              className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Bedroom Select */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Số phòng ngủ</label>
            <select
              value={bedroom}
              onChange={(e) => setBedroom(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="" className="bg-slate-900">Tất cả phòng ngủ</option>
              <option value="1" className="bg-slate-900">1 PN</option>
              <option value="2" className="bg-slate-900">2 PN</option>
              <option value="3" className="bg-slate-900">3+ PN</option>
            </select>
          </div>

          {/* Apartment Type Select */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Loại căn hộ</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
            >
              <option value="" className="bg-slate-900">Tất cả phân loại</option>
              <option value="Studio" className="bg-slate-900">Studio</option>
              <option value="Normal" className="bg-slate-900">Normal</option>
              <option value="Penthouse" className="bg-slate-900">Penthouse</option>
              <option value="SkyVilla" className="bg-slate-900">Sky Villa</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Giá tối đa (VNĐ/tháng)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="VD: 30000000"
              className="w-full bg-slate-950 border border-white/10 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
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
        <div className="py-20 text-center space-y-4 rounded-2xl bg-slate-900/40 border border-white/5 p-8">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Không tìm thấy căn hộ phù hợp</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Hãy thử điều chỉnh lại bộ lọc hoặc bấm nút bên dưới để nhờ AI Broker tìm thêm dữ liệu khác.
          </p>
          <button
            onClick={toggleAiPanel}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors inline-flex items-center gap-2"
          >
            <Bot className="w-4 h-4" /> Hỏi Trợ Lý AI Broker
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item) => (
            <PropertyCard key={item.id} listing={item} />
          ))}
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
