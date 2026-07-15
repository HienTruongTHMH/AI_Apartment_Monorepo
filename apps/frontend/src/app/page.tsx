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
      if (isMounted) setListings(data);
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