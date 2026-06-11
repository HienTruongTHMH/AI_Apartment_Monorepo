import { LISTINGS } from "./seed-listings";

const GALLERY_EXTRAS = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80&fit=crop",
];

export const MOCK_AGENT = {
  name: "Nguyễn Văn An",
  role: "Môi Giới",
  phone: "098168***",
  isOnline: true,
  listingCount: 7,
  yearsActive: 3,
  responseRate: 79,
};

const SORTED = [...LISTINGS].sort((a, b) => b.rating - a.rating);

export function getMockListing(id: string) {
  let listing = SORTED[0];

  const numId = Number(id);
  if (numId < 0) {
    const idx = Math.abs(numId) - 1;
    listing = SORTED[idx] ?? SORTED[0];
  } else {
    listing = LISTINGS.find(l => l.id === id) ?? SORTED[0];
  }

  const images = [
    listing.image.replace("w=600", "w=800"),
    ...GALLERY_EXTRAS,
  ];

  return { listing, agent: MOCK_AGENT, images };
}
