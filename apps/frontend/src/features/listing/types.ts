export interface Listing {
  id: string;
  title: string;
  price: string;
  priceNum: number;
  area: string;
  district: string;
  province: string;
  type: string;
  image: string;
  tags: string[];
  verified: boolean;
  rating: number;
  description: string;
  amenities: string[];
  postedAt: string;
  sourceUrl: string;
  lat?: number;
  lng?: number ;
}

// Cấu trúc data của Dự Án 

// interface ListingDetail {
//   id: string;
//   title: string;
//   description: string;
//   pricePerMonth: number;
//   createdAt: string;
//   images: {
//     imageUrl: string;
//     isPrimary: boolean;
//   }[];
//   apartment: {
//     district: string;
//     area: number;
//     floor: number;
//     room_number: number;
//     type: string;
//     note: string;
//     fullAddress: string;
//     bedroom: number;
//     livingroom: number;
//     kitchen: number;
//     bathroom: number;
//     owner?: {
//       name: string;
//       phone: string;
//       email: string;
//     }
//   };
// }
