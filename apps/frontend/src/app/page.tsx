'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/shared/HeroSection';
import FeatureHighlight from '@/components/landing/FeatureHighlight';
import BusinessWorkflow from '@/components/landing/BusinessWorkflow';
import FeaturedListings from '@/components/landing/FeaturedListings';
import OwnerCallout from '@/components/landing/OwnerCallout';
import { apiService, ListingItem } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function LandingPage() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const { toggleAiPanel } = useAuthStore();

  useEffect(() => {
    let isMounted = true;
    apiService.getListings().then((data) => {
      if (isMounted) {
        // Guard phòng thủ: Chỉ hiển thị listing Published + apartment Available
        // TODO: Sau này nếu muốn hiển thị căn hộ "Đã thuê" với badge trạng thái,
        // bỏ filter này và thêm UI badge trên PropertyCard thay vì ẩn hoàn toàn.
        const available = data.filter(
          (item) =>
            item.listingStatus === 'Published' &&
            item.apartment.apartmentStatus === 'Available'
        );
        setListings(available);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-24 pb-20">
      <HeroSection toggleAiPanel={toggleAiPanel} />
      <FeatureHighlight onCtaClick={toggleAiPanel} />
      <BusinessWorkflow />
      <FeaturedListings listings={listings} />
      <OwnerCallout />
    </div>
  );
}