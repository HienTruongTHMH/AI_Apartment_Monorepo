'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '@/components/shared/PropertyCard';
import { apiService, ListingItem } from '@/lib/api';
import { 
  Search, 
  SlidersHorizontal, 
  Building2, 
  Bot, 
  RefreshCw, 
  AlertCircle, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Map 
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

// Hierarchical category tree view list structure
const PROPERTY_TYPE_TREE = [
  {
    id: 'apartment_standard',
    label: 'Căn hộ chung cư',
    children: [
      { id: 'Normal', label: 'Căn hộ thường (Normal)' },
      { id: 'Studio', label: 'Căn hộ Studio' },
      { id: 'Officetel', label: 'Căn hộ Officetel' },
    ]
  },
  {
    id: 'apartment_luxury',
    label: 'Căn hộ cao cấp',
    children: [
      { id: 'Penthouse', label: 'Penthouse' },
      { id: 'Duplex', label: 'Duplex' },
      { id: 'SkyVilla', label: 'Sky Villa' },
    ]
  },
  {
    id: 'commercial',
    label: 'Bất động sản thương mại',
    children: [
      { id: 'Shophouse', label: 'Shophouse' },
    ]
  }
];

function SearchContent() {
  const searchParams = useSearchParams();
  
  // Initial parameters from URL
  const initialQuery = searchParams.get('query') || searchParams.get('keyword') || searchParams.get('district') || '';
  const initialType = searchParams.get('type') || '';

  // Applied Filter States
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialType ? [initialType] : []);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100_000_000);
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState(200);
  const [locationQuery, setLocationQuery] = useState('');
  const [transactionType, setTransactionType] = useState<'buy' | 'rent'>('rent');

  // Local/Temporary Filter States (for Popovers / Right Drawer edits)
  const [searchVal, setSearchVal] = useState(initialQuery);
  const [tempSelectedTypes, setTempSelectedTypes] = useState<string[]>(initialType ? [initialType] : []);
  const [tempMinPrice, setTempMinPrice] = useState(0);
  const [tempMaxPrice, setTempMaxPrice] = useState(100_000_000);
  const [tempMinArea, setTempMinArea] = useState(0);
  const [tempMaxArea, setTempMaxArea] = useState(200);

  // UI Interactive States
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [activePopover, setActivePopover] = useState<'property_type' | 'price_range' | 'area_range' | null>(null);
  const [showDrawerPropertyTree, setShowDrawerPropertyTree] = useState(false);

  // Listing Data States
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  const { toggleAiPanel } = useAuthStore();

  // Fetch data from API and apply filters
  const fetchFilteredListings = async () => {
    setLoading(true);
    try {
      const queryKeyword = searchQuery || locationQuery || undefined;

      const data = await apiService.getListings({
        keyword: queryKeyword,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice: maxPrice < 100_000_000 ? maxPrice : undefined,
        page: page,
        limit: 9
      });

      let results = data;

      // Guard phòng thủ: Chỉ hiển thị listing Published + apartment Available
      // TODO: Sau này nếu muốn hiển thị căn hộ "Đã thuê" với badge trạng thái,
      // bỏ filter này và thêm UI badge trên PropertyCard thay vì ẩn hoàn toàn.
      results = results.filter(
        (item) =>
          item.listingStatus === 'Published' &&
          item.apartment.apartmentStatus === 'Available'
      );

      // Filter by Property Type (Case-insensitive match on selected tree items)
      if (selectedTypes.length > 0) {
        results = results.filter((item) =>
          selectedTypes.some(t => t.toLowerCase() === item.apartment.type.toLowerCase())
        );
      }

      // Filter by Area (Client-side selection)
      if (minArea > 0 || maxArea < 200) {
        results = results.filter((item) => {
          const area = item.apartment.area;
          return area >= minArea && (maxArea >= 200 ? true : area <= maxArea);
        });
      }

      // Filter by transaction type if needed (Simulated client-side check)
      // Since all mock listings are rentals in our mock system, rent is default.
      
      setListings(results);
    } catch (error) {
      console.error('[Fetch Listings Error]:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Sync parameters on initial load
  useEffect(() => {
    fetchFilteredListings();
  }, [searchQuery, selectedTypes, minPrice, maxPrice, minArea, maxArea, locationQuery, transactionType, page]);

  const handleSearchSubmit = () => {
    setSearchQuery(searchVal);
    setPage(1);
  };

  const togglePopover = (popover: 'property_type' | 'price_range' | 'area_range') => {
    if (activePopover === popover) {
      setActivePopover(null);
    } else {
      setActivePopover(popover);
      // Sync temp states
      if (popover === 'property_type') {
        setTempSelectedTypes(selectedTypes);
      } else if (popover === 'price_range') {
        setTempMinPrice(minPrice);
        setTempMaxPrice(maxPrice);
      } else if (popover === 'area_range') {
        setTempMinArea(minArea);
        setTempMaxArea(maxArea);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans" style={{ fontFamily: 'Inter, Roboto, sans-serif' }}>
      
      {/* Click-outside backdrop for Popovers */}
      {activePopover && (
        <div className="fixed inset-0 z-20" onClick={() => setActivePopover(null)} />
      )}

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
          className="px-5 py-3 rounded-xl bg-[#FFF5F5] border border-[#E03C3D]/20 text-[#E03C3D] hover:bg-[#FEE2E2] text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          
          <span>Tìm Nhanh Bằng Trợ Lý Ảo</span>
        </button>
      </div>

      {/* Standardized Search / Filter Stack */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#F9F9F9] border border-[#E8E8E8] shadow-sm space-y-4">
        
        {/* ROW 1: Unified Search & View Map Button */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          
          {/* Unified search input wrapper */}
          <div className="flex-grow bg-[#FFFFFF] border border-[#E8E8E8] rounded-lg p-1.5 pl-4 flex items-center shadow-sm">
            <Search className="w-5 h-5 text-[#2C2C2C] mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit();
              }}
              placeholder="Tìm Kiếm Nhà"
              className="w-full bg-transparent text-[14px] text-[#2C2C2C] placeholder-[#747474] focus:outline-none"
            />
            <button
              onClick={handleSearchSubmit}
              className="bg-[#E03C3D] hover:bg-[#C92F30] text-[#FFFFFF] text-[14px] font-bold rounded-md px-5 py-2 transition-colors flex-shrink-0 cursor-pointer"
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* ROW 2: Filter settings button and chips dropdown triggers */}
        <div className="flex items-center flex-wrap gap-2 mt-3 relative">
          
          {/* Main filter drawer button */}
          <button
            onClick={() => {
              // Sync Drawer Temp state before opening
              setTempSelectedTypes(selectedTypes);
              setTempMinPrice(minPrice);
              setTempMaxPrice(maxPrice);
              setTempMinArea(minArea);
              setTempMaxArea(maxArea);
              setShowAllFilters(true);
            }}
            className="flex items-center gap-2 bg-white border border-[#E8E8E8] hover:bg-[#F9F9F9] rounded-lg px-4 py-2.5 text-[13px] font-medium text-[#2C2C2C] cursor-pointer shadow-sm transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2C2C2C]" />
            <span>Lọc</span>
          </button>

          {/* Popover 1: Property Type */}
          <div className="relative">
            <button
              onClick={() => togglePopover('property_type')}
              className={`flex items-center gap-1.5 bg-white border rounded-lg px-4 py-2.5 text-[13px] font-medium text-[#2C2C2C] cursor-pointer shadow-sm transition-all ${
                activePopover === 'property_type' || selectedTypes.length > 0
                  ? 'border-[#00A49F] text-[#00A49F] bg-[#F4FDFD]'
                  : 'border-[#E8E8E8] hover:bg-[#F9F9F9]'
              }`}
            >
              <span>Loại nhà đất</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence>
              {activePopover === 'property_type' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 z-30 bg-white border border-[#E8E8E8] shadow-lg rounded-xl p-4 w-[320px]"
                >
                  <div className="border-b border-[#E8E8E8] pb-2 mb-3">
                    <h4 className="text-sm font-semibold text-[#2C2C2C]">Loại nhà đất</h4>
                  </div>

                  <div className="max-h-[240px] overflow-y-auto space-y-3.5 pr-1">
                    {PROPERTY_TYPE_TREE.map((parent) => {
                      const isAllChecked = parent.children.every(child => tempSelectedTypes.includes(child.id));
                      const isSomeChecked = parent.children.some(child => tempSelectedTypes.includes(child.id));
                      
                      return (
                        <div key={parent.id} className="space-y-1.5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isAllChecked}
                              ref={(el) => {
                                if (el) {
                                  el.indeterminate = isSomeChecked && !isAllChecked;
                                }
                              }}
                              onChange={() => {
                                if (isAllChecked) {
                                  setTempSelectedTypes(prev => prev.filter(id => !parent.children.some(c => c.id === id)));
                                } else {
                                  setTempSelectedTypes(prev => {
                                    const newSelections = [...prev];
                                    parent.children.forEach(c => {
                                      if (!newSelections.includes(c.id)) {
                                        newSelections.push(c.id);
                                      }
                                    });
                                    return newSelections;
                                  });
                                }
                              }}
                              className="rounded border-[#E8E8E8] text-[#00A49F] focus:ring-[#00A49F] w-4 h-4 cursor-pointer"
                            />
                            <span className="text-[13px] font-semibold text-[#2C2C2C]">{parent.label}</span>
                          </label>

                          <div className="pl-6 space-y-1.5">
                            {parent.children.map((child) => (
                              <label key={child.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={tempSelectedTypes.includes(child.id)}
                                  onChange={() => {
                                    if (tempSelectedTypes.includes(child.id)) {
                                      setTempSelectedTypes(prev => prev.filter(id => id !== child.id));
                                    } else {
                                      setTempSelectedTypes(prev => [...prev, child.id]);
                                    }
                                  }}
                                  className="rounded border-[#E8E8E8] text-[#00A49F] focus:ring-[#00A49F] w-3.5 h-3.5 cursor-pointer"
                                />
                                <span className="text-xs text-[#5A5A5A]">{child.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-3 mt-4 gap-2">
                    <button
                      onClick={() => setTempSelectedTypes([])}
                      className="text-xs font-semibold text-[#747474] hover:text-[#2C2C2C] px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                      Đặt lại
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTypes(tempSelectedTypes);
                        setActivePopover(null);
                        setPage(1);
                      }}
                      className="bg-[#00A49F] hover:bg-[#009197] text-white text-xs font-bold px-4 py-1.5 rounded-md transition-colors cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Popover 2: Price Range */}
          <div className="relative">
            <button
              onClick={() => togglePopover('price_range')}
              className={`flex items-center gap-1.5 bg-white border rounded-lg px-4 py-2.5 text-[13px] font-medium text-[#2C2C2C] cursor-pointer shadow-sm transition-all ${
                activePopover === 'price_range' || minPrice > 0 || maxPrice < 100_000_000
                  ? 'border-[#00A49F] text-[#00A49F] bg-[#F4FDFD]'
                  : 'border-[#E8E8E8] hover:bg-[#F9F9F9]'
              }`}
            >
              <span>Khoảng giá</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence>
              {activePopover === 'price_range' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 z-30 bg-white border border-[#E8E8E8] shadow-lg rounded-xl p-4 w-[340px]"
                >
                  <div className="border-b border-[#E8E8E8] pb-2 mb-3">
                    <h4 className="text-sm font-semibold text-[#2C2C2C]">Khoảng giá</h4>
                  </div>

                  <div className="space-y-4">
                    {/* Inputs */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-[#747474] font-semibold">Từ (Triệu VNĐ)</label>
                        <input
                          type="number"
                          value={tempMinPrice / 1_000_000}
                          onChange={(e) => {
                            const val = Number(e.target.value) * 1_000_000;
                            setTempMinPrice(Math.min(val, tempMaxPrice));
                          }}
                          className="w-full bg-[#F9F9F9] border border-[#E8E8E8] rounded-md px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none focus:border-[#00A49F]"
                        />
                      </div>
                      <span className="text-xs text-[#747474] mt-4">→</span>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-[#747474] font-semibold">Đến (Triệu VNĐ)</label>
                        <input
                          type="number"
                          value={tempMaxPrice / 1_000_000}
                          onChange={(e) => {
                            const val = Number(e.target.value) * 1_000_000;
                            setTempMaxPrice(Math.max(val, tempMinPrice));
                          }}
                          className="w-full bg-[#F9F9F9] border border-[#E8E8E8] rounded-md px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none focus:border-[#00A49F]"
                        />
                      </div>
                    </div>

                    {/* Interactive Slider */}
                    <div className="pt-2 px-1">
                      <div className="relative w-full h-5 flex items-center">
                        <div className="absolute left-0 right-0 h-1 bg-[#E8E8E8] rounded-full"></div>
                        <div 
                          className="absolute h-1 bg-[#00A49F] rounded-full"
                          style={{
                            left: `${(tempMinPrice / 100_000_000) * 100}%`,
                            width: `${((tempMaxPrice - tempMinPrice) / 100_000_000) * 100}%`
                          }}
                        ></div>
                        <input
                          type="range"
                          min="0"
                          max="100000000"
                          step="1000000"
                          value={tempMinPrice}
                          onChange={(e) => {
                            const val = Math.min(Number(e.target.value), tempMaxPrice - 1000000);
                            setTempMinPrice(val);
                          }}
                          className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none focus:outline-none z-20 
                            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00A49F] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#00A49F] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100000000"
                          step="1000000"
                          value={tempMaxPrice}
                          onChange={(e) => {
                            const val = Math.max(Number(e.target.value), tempMinPrice + 1000000);
                            setTempMaxPrice(val);
                          }}
                          className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none focus:outline-none z-20 
                            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00A49F] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#00A49F] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#747474] font-medium mt-1">
                        <span>0 tr</span>
                        <span>50 tr</span>
                        <span>100 tr+</span>
                      </div>
                    </div>

                    {/* Predefined Shortcuts with Radio Buttons */}
                    <div className="space-y-2 pt-2 border-t border-[#E8E8E8]">
                      <span className="text-[10px] font-bold text-[#747474] uppercase tracking-wider">Lựa chọn nhanh</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Tất cả', min: 0, max: 100_000_000 },
                          { label: 'Dưới 5 triệu', min: 0, max: 5_000_000 },
                          { label: '5 - 10 triệu', min: 5_000_000, max: 10_000_000 },
                          { label: '10 - 20 triệu', min: 10_000_000, max: 20_000_000 },
                          { label: '20 - 50 triệu', min: 20_000_000, max: 50_000_000 },
                          { label: 'Trên 50 triệu', min: 50_000_000, max: 100_000_000 },
                        ].map((preset, index) => {
                          const isChecked = tempMinPrice === preset.min && tempMaxPrice === preset.max;
                          return (
                            <label key={index} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="price_shortcut"
                                checked={isChecked}
                                onChange={() => {
                                  setTempMinPrice(preset.min);
                                  setTempMaxPrice(preset.max);
                                }}
                                className="text-[#00A49F] focus:ring-[#00A49F] border-[#E8E8E8] w-3.5 h-3.5 cursor-pointer"
                              />
                              <span className="text-xs text-[#5A5A5A]">{preset.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-3 mt-4 gap-2">
                    <button
                      onClick={() => {
                        setTempMinPrice(0);
                        setTempMaxPrice(100_000_000);
                      }}
                      className="text-xs font-semibold text-[#747474] hover:text-[#2C2C2C] px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                      Đặt lại
                    </button>
                    <button
                      onClick={() => {
                        setMinPrice(tempMinPrice);
                        setMaxPrice(tempMaxPrice);
                        setActivePopover(null);
                        setPage(1);
                      }}
                      className="bg-[#00A49F] hover:bg-[#009197] text-white text-xs font-bold px-4 py-1.5 rounded-md transition-colors cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Popover 3: Area Range */}
          <div className="relative">
            <button
              onClick={() => togglePopover('area_range')}
              className={`flex items-center gap-1.5 bg-white border rounded-lg px-4 py-2.5 text-[13px] font-medium text-[#2C2C2C] cursor-pointer shadow-sm transition-all ${
                activePopover === 'area_range' || minArea > 0 || maxArea < 200
                  ? 'border-[#00A49F] text-[#00A49F] bg-[#F4FDFD]'
                  : 'border-[#E8E8E8] hover:bg-[#F9F9F9]'
              }`}
            >
              <span>Diện tích</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence>
              {activePopover === 'area_range' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 z-30 bg-white border border-[#E8E8E8] shadow-lg rounded-xl p-4 w-[340px]"
                >
                  <div className="border-b border-[#E8E8E8] pb-2 mb-3">
                    <h4 className="text-sm font-semibold text-[#2C2C2C]">Diện tích</h4>
                  </div>

                  <div className="space-y-4">
                    {/* Inputs */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-[#747474] font-semibold">Từ (m²)</label>
                        <input
                          type="number"
                          value={tempMinArea}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTempMinArea(Math.min(val, tempMaxArea));
                          }}
                          className="w-full bg-[#F9F9F9] border border-[#E8E8E8] rounded-md px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none focus:border-[#00A49F]"
                        />
                      </div>
                      <span className="text-xs text-[#747474] mt-4">→</span>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-[#747474] font-semibold">Đến (m²)</label>
                        <input
                          type="number"
                          value={tempMaxArea}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTempMaxArea(Math.max(val, tempMinArea));
                          }}
                          className="w-full bg-[#F9F9F9] border border-[#E8E8E8] rounded-md px-2.5 py-1.5 text-xs text-[#2C2C2C] focus:outline-none focus:border-[#00A49F]"
                        />
                      </div>
                    </div>

                    {/* Interactive Slider */}
                    <div className="pt-2 px-1">
                      <div className="relative w-full h-5 flex items-center">
                        <div className="absolute left-0 right-0 h-1 bg-[#E8E8E8] rounded-full"></div>
                        <div 
                          className="absolute h-1 bg-[#00A49F] rounded-full"
                          style={{
                            left: `${(tempMinArea / 200) * 100}%`,
                            width: `${((tempMaxArea - tempMinArea) / 200) * 100}%`
                          }}
                        ></div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="5"
                          value={tempMinArea}
                          onChange={(e) => {
                            const val = Math.min(Number(e.target.value), tempMaxArea - 5);
                            setTempMinArea(val);
                          }}
                          className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none focus:outline-none z-20 
                            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00A49F] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#00A49F] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                        />
                        <input
                          type="range"
                          min="0"
                          max="200"
                          step="5"
                          value={tempMaxArea}
                          onChange={(e) => {
                            const val = Math.max(Number(e.target.value), tempMinArea + 5);
                            setTempMaxArea(val);
                          }}
                          className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none focus:outline-none z-20 
                            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00A49F] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#00A49F] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#747474] font-medium mt-1">
                        <span>0 m²</span>
                        <span>100 m²</span>
                        <span>200 m²+</span>
                      </div>
                    </div>

                    {/* Shortcuts with Radio Buttons */}
                    <div className="space-y-2 pt-2 border-t border-[#E8E8E8]">
                      <span className="text-[10px] font-bold text-[#747474] uppercase tracking-wider">Lựa chọn nhanh</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Tất cả', min: 0, max: 200 },
                          { label: 'Dưới 30 m²', min: 0, max: 30 },
                          { label: '30 - 50 m²', min: 30, max: 50 },
                          { label: '50 - 80 m²', min: 50, max: 80 },
                          { label: '80 - 120 m²', min: 80, max: 120 },
                          { label: 'Trên 120 m²', min: 120, max: 200 },
                        ].map((preset, index) => {
                          const isChecked = tempMinArea === preset.min && tempMaxArea === preset.max;
                          return (
                            <label key={index} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="area_shortcut"
                                checked={isChecked}
                                onChange={() => {
                                  setTempMinArea(preset.min);
                                  setTempMaxArea(preset.max);
                                }}
                                className="text-[#00A49F] focus:ring-[#00A49F] border-[#E8E8E8] w-3.5 h-3.5 cursor-pointer"
                              />
                              <span className="text-xs text-[#5A5A5A]">{preset.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-3 mt-4 gap-2">
                    <button
                      onClick={() => {
                        setTempMinArea(0);
                        setTempMaxArea(200);
                      }}
                      className="text-xs font-semibold text-[#747474] hover:text-[#2C2C2C] px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                      Đặt lại
                    </button>
                    <button
                      onClick={() => {
                        setMinArea(tempMinArea);
                        setMaxArea(tempMaxArea);
                        setActivePopover(null);
                        setPage(1);
                      }}
                      className="bg-[#00A49F] hover:bg-[#009197] text-white text-xs font-bold px-4 py-1.5 rounded-md transition-colors cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* RightDrawer_AllFilters Modal Drawer Component */}
      <AnimatePresence>
        {showAllFilters && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setShowAllFilters(false)}
            />

            {/* Slide-over drawer container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8]">
                <h3 className="text-base font-bold text-[#2C2C2C]">Bộ lọc</h3>
                <button
                  onClick={() => setShowAllFilters(false)}
                  className="p-1 rounded-md hover:bg-[#F9F9F9] text-[#2C2C2C] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Drawer Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                
                {/* Transaction Type Segmented Control Tab */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">Hình thức giao dịch</span>
                  <div className="flex bg-[#F9F9F9] border border-[#E8E8E8] p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setTransactionType('buy')}
                      className={`flex-1 text-center py-2 text-xs font-semibold transition-all cursor-pointer ${
                        transactionType === 'buy'
                          ? 'bg-[#404040] text-[#FFFFFF] rounded-[4px]'
                          : 'bg-transparent text-[#747474]'
                      }`}
                    >
                      Tìm mua
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransactionType('rent')}
                      className={`flex-1 text-center py-2 text-xs font-semibold transition-all cursor-pointer ${
                        transactionType === 'rent'
                          ? 'bg-[#404040] text-[#FFFFFF] rounded-[4px]'
                          : 'bg-transparent text-[#747474]'
                      }`}
                    >
                      Tìm thuê
                    </button>
                  </div>
                </div>

                {/* Location Selection Section */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">Khu vực & Dự án</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Trên toàn quốc"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-xs text-[#2C2C2C] placeholder-[#747474] focus:outline-none focus:border-[#E03C3D] pr-10"
                    />
                    <div className="absolute right-3 text-[#747474] pointer-events-none">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Property Type selection in Drawer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wider">Loại bất động sản</span>
                    <button
                      type="button"
                      onClick={() => setShowDrawerPropertyTree(!showDrawerPropertyTree)}
                      className="text-xs font-bold text-[#E03C3D] hover:underline cursor-pointer"
                    >
                      {showDrawerPropertyTree ? 'Thu gọn' : '+ Thêm'}
                    </button>
                  </div>

                  {tempSelectedTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tempSelectedTypes.map(typeId => {
                        const label = PROPERTY_TYPE_TREE.flatMap(p => p.children).find(c => c.id === typeId)?.label || typeId;
                        return (
                          <span key={typeId} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FFF5F5] border border-[#E03C3D]/10 text-xs font-medium text-[#E03C3D]">
                            {label}
                            <button
                              type="button"
                              onClick={() => setTempSelectedTypes(prev => prev.filter(id => id !== typeId))}
                              className="hover:text-[#C92F30] font-bold cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {showDrawerPropertyTree && (
                    <div className="bg-[#F9F9F9] border border-[#E8E8E8] rounded-lg p-3 space-y-3.5 max-h-[220px] overflow-y-auto">
                      {PROPERTY_TYPE_TREE.map((parent) => {
                        const isAllChecked = parent.children.every(child => tempSelectedTypes.includes(child.id));
                        const isSomeChecked = parent.children.some(child => tempSelectedTypes.includes(child.id));
                        
                        return (
                          <div key={parent.id} className="space-y-1.5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isAllChecked}
                                ref={(el) => {
                                  if (el) {
                                    el.indeterminate = isSomeChecked && !isAllChecked;
                                  }
                                }}
                                onChange={() => {
                                  if (isAllChecked) {
                                    setTempSelectedTypes(prev => prev.filter(id => !parent.children.some(c => c.id === id)));
                                  } else {
                                    setTempSelectedTypes(prev => {
                                      const newSelections = [...prev];
                                      parent.children.forEach(c => {
                                        if (!newSelections.includes(c.id)) {
                                          newSelections.push(c.id);
                                        }
                                      });
                                      return newSelections;
                                    });
                                  }
                                }}
                                className="rounded border-[#E8E8E8] text-[#00A49F] focus:ring-[#00A49F] w-4 h-4 cursor-pointer"
                              />
                              <span className="text-[13px] font-semibold text-[#2C2C2C]">{parent.label}</span>
                            </label>
                            <div className="pl-6 space-y-1.5">
                              {parent.children.map((child) => (
                                <label key={child.id} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={tempSelectedTypes.includes(child.id)}
                                    onChange={() => {
                                      if (tempSelectedTypes.includes(child.id)) {
                                        setTempSelectedTypes(prev => prev.filter(id => id !== child.id));
                                      } else {
                                        setTempSelectedTypes(prev => [...prev, child.id]);
                                      }
                                    }}
                                    className="rounded border-[#E8E8E8] text-[#00A49F] focus:ring-[#00A49F] w-3.5 h-3.5 cursor-pointer"
                                  />
                                  <span className="text-xs text-[#5A5A5A]">{child.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Price Range in Drawer */}
                <div className="space-y-3 border-t border-[#E8E8E8] pt-4">
                  <span className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wider block">Khoảng giá</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={tempMinPrice / 1_000_000}
                        onChange={(e) => {
                          const val = Number(e.target.value) * 1_000_000;
                          setTempMinPrice(Math.min(val, tempMaxPrice));
                        }}
                        className="w-full bg-[#FFFFFF] border border-[#E8E8E8] rounded-md px-2.5 py-2 text-xs text-[#2C2C2C] focus:outline-none focus:border-[#E03C3D]"
                      />
                    </div>
                    <span className="text-xs text-[#747474]">-</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Đến"
                        value={tempMaxPrice / 1_000_000}
                        onChange={(e) => {
                          const val = Number(e.target.value) * 1_000_000;
                          setTempMaxPrice(Math.max(val, tempMinPrice));
                        }}
                        className="w-full bg-[#FFFFFF] border border-[#E8E8E8] rounded-md px-2.5 py-2 text-xs text-[#2C2C2C] focus:outline-none focus:border-[#E03C3D]"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 px-1">
                    <div className="relative w-full h-5 flex items-center">
                      <div className="absolute left-0 right-0 h-1 bg-[#E8E8E8] rounded-full"></div>
                      <div 
                        className="absolute h-1 bg-[#00A49F] rounded-full"
                        style={{
                          left: `${(tempMinPrice / 100_000_000) * 100}%`,
                          width: `${((tempMaxPrice - tempMinPrice) / 100_000_000) * 100}%`
                        }}
                      ></div>
                      <input
                        type="range"
                        min="0"
                        max="100000000"
                        step="1000000"
                        value={tempMinPrice}
                        onChange={(e) => {
                          const val = Math.min(Number(e.target.value), tempMaxPrice - 1000000);
                          setTempMinPrice(val);
                        }}
                        className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none focus:outline-none z-20 
                          [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00A49F] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                          [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#00A49F] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100000000"
                        step="1000000"
                        value={tempMaxPrice}
                        onChange={(e) => {
                          const val = Math.max(Number(e.target.value), tempMinPrice + 1000000);
                          setTempMaxPrice(val);
                        }}
                        className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none focus:outline-none z-20 
                          [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00A49F] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                          [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#00A49F] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Area Range in Drawer */}
                <div className="space-y-3 border-t border-[#E8E8E8] pt-4">
                  <span className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wider block">Diện tích (m²)</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={tempMinArea}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTempMinArea(Math.min(val, tempMaxArea));
                        }}
                        className="w-full bg-[#FFFFFF] border border-[#E8E8E8] rounded-md px-2.5 py-2 text-xs text-[#2C2C2C] focus:outline-none focus:border-[#E03C3D]"
                      />
                    </div>
                    <span className="text-xs text-[#747474]">-</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Đến"
                        value={tempMaxArea}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTempMaxArea(Math.max(val, tempMinArea));
                        }}
                        className="w-full bg-[#FFFFFF] border border-[#E8E8E8] rounded-md px-2.5 py-2 text-xs text-[#2C2C2C] focus:outline-none focus:border-[#E03C3D]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 px-1">
                    <div className="relative w-full h-5 flex items-center">
                      <div className="absolute left-0 right-0 h-1 bg-[#E8E8E8] rounded-full"></div>
                      <div 
                        className="absolute h-1 bg-[#00A49F] rounded-full"
                        style={{
                          left: `${(tempMinArea / 200) * 100}%`,
                          width: `${((tempMaxArea - tempMinArea) / 200) * 100}%`
                        }}
                      ></div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="5"
                        value={tempMinArea}
                        onChange={(e) => {
                          const val = Math.min(Number(e.target.value), tempMaxArea - 5);
                          setTempMinArea(val);
                        }}
                        className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none focus:outline-none z-20 
                          [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00A49F] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                          [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#00A49F] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                      />
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="5"
                        value={tempMaxArea}
                        onChange={(e) => {
                          const val = Math.max(Number(e.target.value), tempMinArea + 5);
                          setTempMaxArea(val);
                        }}
                        className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none focus:outline-none z-20 
                          [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00A49F] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                          [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#00A49F] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Sticky Footer */}
              <div className="p-4 border-t border-[#E8E8E8] bg-white flex items-center justify-between gap-3 shadow-md">
                <button
                  type="button"
                  onClick={() => {
                    setTempSelectedTypes([]);
                    setTempMinPrice(0);
                    setTempMaxPrice(100_000_000);
                    setTempMinArea(0);
                    setTempMaxArea(200);
                    setLocationQuery('');
                    setTransactionType('buy');
                  }}
                  className="px-5 py-2.5 border border-[#E8E8E8] rounded-lg text-xs font-semibold text-[#2C2C2C] hover:bg-[#F9F9F9] transition-colors cursor-pointer"
                >
                  Đặt lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTypes(tempSelectedTypes);
                    setMinPrice(tempMinPrice);
                    setMaxPrice(tempMaxPrice);
                    setMinArea(tempMinArea);
                    setMaxArea(tempMaxArea);
                    setShowAllFilters(false);
                    setPage(1);
                  }}
                  className="flex-1 py-2.5 bg-[#E03C3D] hover:bg-[#C92F30] text-white text-xs font-bold rounded-lg text-center transition-colors shadow-sm cursor-pointer"
                >
                  Xem kết quả
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            className="px-5 py-2.5 rounded-[8px] bg-[#E03C3D] hover:bg-[#C92F30] text-white font-bold text-xs border-0 transition-colors inline-flex items-center gap-2 cursor-pointer"
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
              className="px-4 py-2 rounded-[8px] bg-white border border-[#E8E8E8] hover:border-[#999999] text-[#5A5A5A] hover:text-[#2C2C2C] disabled:opacity-50 text-xs font-semibold transition-all cursor-pointer"
            >
              Trang trước
            </button>
            <span className="text-xs text-[#5A5A5A]">
              Trang {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={listings.length < 9}
              className="px-4 py-2 rounded-[8px] bg-white border border-[#E8E8E8] hover:border-[#999999] text-[#5A5A5A] hover:text-[#2C2C2C] disabled:opacity-50 text-xs font-semibold transition-all cursor-pointer"
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

