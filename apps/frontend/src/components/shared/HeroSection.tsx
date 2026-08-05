'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Building2, Bot, Sparkles, MapPin, Home } from 'lucide-react';
import { apiService } from '@/lib/api';

interface HeroSectionProps {
  toggleAiPanel: () => void;
}

const CARDS_DATA = [
  {
    id: '1',
    title: 'Vinhomes Central Park',
    location: 'Bình Thạnh, TP.HCM',
    price: '18.5 Triệu/tháng',
    specs: '2 PN • 75m²',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
  },
  {
    id: '2',
    title: 'Masteri Thảo Điền',
    location: 'Quận 2, TP.HCM',
    price: '16 Triệu/tháng',
    specs: '2 PN • 68m²',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
  },
  {
    id: '3',
    title: 'Sunrise City',
    location: 'Quận 7, TP.HCM',
    price: '14 Triệu/tháng',
    specs: '1 PN • 55m²',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
  },
];

export default function HeroSection({ toggleAiPanel }: HeroSectionProps) {
  const [searchType, setSearchType] = useState<'rent' | 'buy' | 'project'>('rent');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchBedrooms, setSearchBedrooms] = useState('');
  const [cards, setCards] = useState(CARDS_DATA);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await apiService.getListings({ limit: 10 });
        if (data && data.length > 0) {
          const listingsToUse = data.slice(0, 3);
          const mappedCards = listingsToUse.map((listing: any) => {
            const primaryImage = listing.images?.find((img: any) => img.isPrimary)?.imageUrl || listing.images?.[0]?.imageUrl;
            return {
              id: listing.id,
              title: listing.title,
              location: `${listing.apartment?.district || 'Đà Nẵng'}, Đà Nẵng`,
              price: listing.pricePerMonth >= 1000000 
                ? `${listing.pricePerMonth / 1000000} Triệu/tháng` 
                : `${listing.pricePerMonth.toLocaleString('vi-VN')} VND/tháng`,
              specs: `${listing.apartment?.bedroom || 0} PN • ${listing.apartment?.area || 0}m²`,
              imageUrl: primaryImage || null
            };
          });

          // Pad with mock data if we have less than 3 cards
          while (mappedCards.length < 3) {
            const mock = CARDS_DATA[mappedCards.length % CARDS_DATA.length];
            mappedCards.push({
              ...mock,
              imageUrl: mock.imageUrl
            });
          }
          setCards(mappedCards);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách căn hộ cho Hero:', err);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    if (cards.length === 0) return;
    const interval = setInterval(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const frontCard = newCards.shift();
        if (frontCard) newCards.push(frontCard);
        return newCards;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [cards.length]);

  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-r from-[#F5C870] via-[#E9AC3C] to-[#E09015] min-h-[550px] overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-[#2C2C2C] text-xs font-semibold shadow-sm"
            >
              <Building2 className="w-4 h-4 text-[#E03C3D]" />
              <span>Nền Tảng Thuê & Quản Lý Căn Hộ Với Trợ Lý Thông Minh</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-6xl font-bold tracking-tight text-[#2C2C2C] leading-[1.1]"
            >
              Trải Nghiệm Thuê Căn Hộ <br className="hidden sm:inline" />
              <span className="text-[#E03C3D] drop-shadow-sm">An Tâm & Minh Bạch</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-[#2C2C2C]/90 max-w-xl leading-relaxed font-medium"
            >
              Kết nối trực tiếp khách thuê và chủ nhà thông qua bộ lọc thông minh. Quy trình xác nhận thuê rõ ràng, hỗ trợ ký kết hợp đồng bản cứng ngoài đời thực đảm bảo tính pháp lý tối đa.
            </motion.p>

            {/* Premium Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden max-w-xl"
            >
              {/* Search Tabs */}
              <div className="flex border-b border-[#E8E8E8]">
                {[
                  { id: 'rent', label: 'Cho thuê' },
                  { id: 'buy', label: 'Mua bán' },
                  { id: 'project', label: 'Dự án' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSearchType(tab.id as any)}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                      searchType === tab.id
                        ? 'text-[#E03C3D] border-b-2 border-[#E03C3D] bg-white'
                        : 'text-[#5A5A5A] hover:bg-[#F9F9F9]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-center">
                <div className="flex-1 w-full bg-[#F9F9F9] border border-[#E8E8E8] rounded-lg px-4 py-3 flex items-center gap-3 focus-within:border-[#999999] transition-colors">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={searchDistrict}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                    placeholder="Nhập quận, khu vực..."
                    className="bg-transparent text-[#2C2C2C] text-sm placeholder-gray-400 focus:outline-none w-full"
                  />
                </div>

                <div className="w-full sm:w-40 bg-[#F9F9F9] border border-[#E8E8E8] rounded-lg px-4 py-3 flex items-center gap-3 focus-within:border-[#999999] transition-colors">
                  <Home className="w-5 h-5 text-gray-400 shrink-0" />
                  <select
                    value={searchBedrooms}
                    onChange={(e) => setSearchBedrooms(e.target.value)}
                    className="bg-transparent text-[#2C2C2C] text-sm focus:outline-none w-full cursor-pointer"
                  >
                    <option value="">Phòng ngủ</option>
                    <option value="1">1 Phòng ngủ</option>
                    <option value="2">2 Phòng ngủ</option>
                    <option value="3">3+ Phòng ngủ</option>
                  </select>
                </div>

                <Link
                  href={`/search?district=${encodeURIComponent(searchDistrict)}&bedroom=${searchBedrooms}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#E03C3D] hover:bg-[#C92F30] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0 shadow-md"
                >
                  <Search className="w-4 h-4" />
                  <span>Tìm Kiếm</span>
                </Link>
              </div>
            </motion.div>

            {/* Glowing CTA for AI */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="inline-block mt-4"
            >
              <button
                onClick={toggleAiPanel}
                className="relative group px-6 py-3 rounded-full bg-[#2C2C2C] hover:bg-black text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <div className="absolute inset-0 rounded-full bg-[#2C2C2C] blur-md opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
                <Sparkles className="w-4 h-4 text-[#FF8E15] relative z-10" />
                <span className="relative z-10">Khám Phá Trợ Lý AI</span>
              </button>
            </motion.div>

          </div>

          {/* Right Side - 3D Card Layout */}
          <div className="hidden lg:block relative h-[500px] w-full perspective-1000">
            {cards.map((card, index) => {
              const isFront = index === 0;
              return (
                <motion.div 
                  key={card.id}
                  className="absolute right-10 top-10 w-80 bg-white rounded-xl shadow-2xl p-4 border border-[#E8E8E8]"
                  initial={false}
                  animate={{
                    scale: isFront ? 1 : index === 1 ? 0.92 : 0.84,
                    opacity: isFront ? 1 : index === 1 ? 0.8 : 0.5,
                    zIndex: isFront ? 30 : index === 1 ? 20 : 10,
                    x: index === 2 ? [0, 80, -60] : isFront ? 0 : -30,
                    y: index === 2 ? [0, 0, 60] : isFront ? 0 : 30,
                    rotateY: isFront ? -15 : index === 1 ? -20 : -25,
                    rotateX: 10,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    x: index === 2 ? { type: "tween", duration: 0.6, ease: "easeInOut" } : undefined,
                    y: index === 2 ? { type: "tween", duration: 0.6, ease: "easeInOut" } : undefined
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-100"></div>
                    {isFront && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#E03C3D] text-white text-[10px] font-bold rounded">
                        NỔI BẬT
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-[#2C2C2C] text-lg leading-tight mb-1">{card.title}</h3>
                  <p className="text-[#5A5A5A] text-sm mb-3"><MapPin className="w-3 h-3 inline mr-1"/>{card.location}</p>
                  <div className="flex justify-between items-center border-t border-[#E8E8E8] pt-3">
                    <span className="text-[#E03C3D] font-bold text-lg">{card.price}</span>
                    <span className="text-[#777777] text-xs">{card.specs}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
