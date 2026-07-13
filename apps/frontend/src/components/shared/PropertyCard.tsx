'use client';

import React from 'react';
import Link from 'next/link';
import { ListingItem } from '@/lib/api';
import { Building2, Bed, Bath, Maximize2, MapPin, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface PropertyCardProps {
  listing: ListingItem;
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  const primaryImg = listing.images.find((i) => i.isPrimary)?.imageUrl || listing.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';

  return (
    <div className="group relative rounded-2xl bg-slate-900/60 border border-white/10 overflow-hidden glass-panel hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col">
      {/* Property Image & Badges Overlay */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-950">
        <img
          src={primaryImg}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

        {/* Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-white/20 text-white text-[11px] font-semibold backdrop-blur-md">
            {listing.apartment.type}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold backdrop-blur-md flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> AI Verified
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-amber-500/30 text-amber-400 font-black text-sm backdrop-blur-md shadow-lg">
            {listing.pricePerMonth.toLocaleString('vi-VN')} <span className="text-[11px] font-normal text-gray-300">đ/tháng</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-lg backdrop-blur-md">
            Phòng {listing.apartment.room_number} • Tầng {listing.apartment.floor}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
            {listing.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {listing.apartment.fullAddress}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-xs text-gray-300">
          <div className="flex items-center gap-1.5 justify-center bg-slate-950/40 p-2 rounded-xl border border-white/5">
            <Bed className="w-3.5 h-3.5 text-emerald-400" />
            <span>{listing.apartment.bedroom} PN</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center bg-slate-950/40 p-2 rounded-xl border border-white/5">
            <Bath className="w-3.5 h-3.5 text-emerald-400" />
            <span>{listing.apartment.bathroom} WC</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center bg-slate-950/40 p-2 rounded-xl border border-white/5">
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{listing.apartment.area} m²</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/apartment/${listing.id}`}
          className="w-full py-2.5 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-white font-semibold text-xs flex items-center justify-center gap-2 group-hover:text-emerald-300 transition-all"
        >
          <span>Xem Chi Tiết & Hợp Đồng Nháp</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
