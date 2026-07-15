'use client';

import React from 'react';
import Link from 'next/link';
import { ListingItem } from '@/lib/api';
import { Building2, Bed, Bath, Maximize2, MapPin, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface PropertyCardProps {
  listing: ListingItem;
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  const primaryImg = listing.images.find((i) => i.isPrimary)?.imageUrl || listing.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';

  return (
    <div className="group relative rounded-lg bg-white border border-[#E8E8E8] overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Property Image & Badges Overlay */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <img
          src={primaryImg}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Heart Icon Wrapper (Neutral Soft Button) */}
        <button className="absolute top-3 right-3 p-2 rounded-[8px] bg-white/90 border border-[#E8E8E8] hover:border-[#999999] transition-all shadow-sm z-10 group/btn">
          <Heart className="w-4 h-4 text-[#777777] group-hover/btn:text-[#E03C3D] transition-colors" />
        </button>

        {/* Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-[8px] bg-[#F2F2F2] text-[#2C2C2C] border border-[#E8E8E8] text-[11px] font-semibold">
            {listing.apartment.type}
          </span>
          <span className="px-2.5 py-1 rounded-[8px] bg-green-100 text-green-700 text-[11px] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> AI Verified
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col space-y-3">
        <h3 className="text-base font-medium text-[#2C2C2C] line-clamp-2">
          {listing.title}
        </h3>
        
        <div className="text-base font-bold text-[#E03C3D]">
          {listing.pricePerMonth.toLocaleString('vi-VN')} đ/tháng · {listing.apartment.area} m²
        </div>

        <p className="text-sm text-[#5A5A5A] flex items-center gap-1.5 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {listing.apartment.fullAddress}
        </p>

        {/* Specs Grid */}
        <div className="flex items-center gap-4 py-3 border-t border-[#F2F2F2] text-sm text-[#5A5A5A]">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" />
            <span>{listing.apartment.bedroom} PN</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4" />
            <span>{listing.apartment.bathroom} WC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs bg-[#F2F2F2] px-1.5 py-0.5 rounded">P.{listing.apartment.room_number}</span>
            <span>Tầng {listing.apartment.floor}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/apartment/${listing.id}`}
          className="w-full mt-auto py-2.5 rounded-[8px] bg-transparent border border-[#E8E8E8] text-[#5A5A5A] hover:text-[#E03C3D] hover:border-[#E03C3D] font-semibold text-sm flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <span>Xem Chi Tiết</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
