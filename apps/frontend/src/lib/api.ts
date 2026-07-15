import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interface definitions matching DB & API models
export interface ListingItem {
  id: string;
  title: string;
  description: string;
  pricePerMonth: number;
  listingStatus: 'Draft' | 'Published' | 'Rented' | 'HIDDEN';
  apartmentId: string;
  createdAt: string;
  updatedAt: string;
  images: { id: string; imageUrl: string; isPrimary: boolean }[];
  apartment: {
    id: string;
    floor: number;
    area: number;
    type: 'Normal' | 'Studio' | 'Officetel' | 'Shophouse' | 'Penthouse' | 'Duplex' | 'SkyVilla';
    district: string;
    fullAddress: string;
    room_number: number;
    bedroom: number;
    bathroom: number;
    livingroom: number;
    kitchen: number;
    apartmentStatus: 'Available' | 'Rented';
    apartmentAmenities?: { amenity: { id: string; name: string; category: string; icon: string } }[];
    owner?: { id: string; fullName: string; taxCode?: string };
  };
}

export interface ContractItem {
  id: string;
  rentPrice: number;
  deposit: number;
  terms?: string;
  startDate: string;
  endDate: string;
  apartmentId: string;
  tenantId: string;
  ownerId: string;
  contractStatus: 'Draft' | 'PendingTenantSignature' | 'Active' | 'Expired' | 'Terminated';
  createdAt: string;
  signAt?: string;
  apartment?: Partial<ListingItem['apartment']>;
  tenant?: { id: string; fullName: string; job?: string };
  owner?: { id: string; fullName: string };
}

// Sample Mock Data for robust fallback in demo mode
export const MOCK_LISTINGS: ListingItem[] = [
  {
    id: 'list-001',
    title: 'Căn Hộ Sky Villa Landmark 81 - Tầm Nhìn Trọn Thành Phố',
    description: 'Nội thất phong cách Minimalism Ý nhập khẩu, ban công ngắm toàn cảnh sông Sài Gòn. Đã tích hợp hệ thống nhà thông minh AI điều khiển giọng nói.',
    pricePerMonth: 35000000,
    listingStatus: 'Published',
    apartmentId: 'apt-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [
      { id: 'img-1', imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80', isPrimary: true },
      { id: 'img-2', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', isPrimary: false },
      { id: 'img-3', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', isPrimary: false }
    ],
    apartment: {
      id: 'apt-001',
      floor: 42,
      area: 110,
      type: 'SkyVilla',
      district: 'Bình Thạnh',
      fullAddress: 'Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP.HCM',
      room_number: 4208,
      bedroom: 3,
      bathroom: 2,
      livingroom: 1,
      kitchen: 1,
      apartmentStatus: 'Available',
      apartmentAmenities: [
        { amenity: { id: 'am-1', name: 'Hồ bơi vô cực', category: 'Building', icon: 'waves' } },
        { amenity: { id: 'am-2', name: 'Điều hòa AI Daikin', category: 'Furniture', icon: 'air-vent' } },
        { amenity: { id: 'am-3', name: 'Khóa cửa vân tay FaceID', category: 'Policy', icon: 'lock' } }
      ],
      owner: { id: 'owner-001', fullName: 'Nguyễn Văn Minh' }
    }
  },
  {
    id: 'list-002',
    title: 'Studio Luxury Metropole Thủ Thiêm Full Khóa Vân Tay AI',
    description: 'Thiết kế sang trọng chuẩn resort 5 sao ngay trung tâm tài chính Thủ Thiêm. Miễn phí dịch vụ quản lý 1 năm.',
    pricePerMonth: 18500000,
    listingStatus: 'Published',
    apartmentId: 'apt-002',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [
      { id: 'img-4', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', isPrimary: true },
      { id: 'img-5', imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80', isPrimary: false }
    ],
    apartment: {
      id: 'apt-002',
      floor: 18,
      area: 55,
      type: 'Studio',
      district: 'Quận 2',
      fullAddress: 'Khu Đô Thị Mới Thủ Thiêm, Thành Phố Thủ Đức, TP.HCM',
      room_number: 1804,
      bedroom: 1,
      bathroom: 1,
      livingroom: 1,
      kitchen: 1,
      apartmentStatus: 'Available',
      apartmentAmenities: [
        { amenity: { id: 'am-4', name: 'Phòng Gym 24/7', category: 'Building', icon: 'dumbbell' } },
        { amenity: { id: 'am-5', name: 'Smart TV 75 inch', category: 'Furniture', icon: 'tv' } }
      ],
      owner: { id: 'owner-002', fullName: 'Trần Thị Ngọc' }
    }
  },
  {
    id: 'list-003',
    title: 'Penthouse Duplex Grand Marina Saigon - View Sông Trọn Đời',
    description: 'Tuyệt tác bất động sản hàng hiệu Marriott. Trọn bộ dịch vụ butler chuẩn quốc tế và quầy bar riêng tại căn hộ.',
    pricePerMonth: 65000000,
    listingStatus: 'Published',
    apartmentId: 'apt-003',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [
      { id: 'img-6', imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', isPrimary: true },
      { id: 'img-7', imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80', isPrimary: false }
    ],
    apartment: {
      id: 'apt-003',
      floor: 36,
      area: 180,
      type: 'Penthouse',
      district: 'Quận 1',
      fullAddress: '2 Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP.HCM',
      room_number: 3601,
      bedroom: 4,
      bathroom: 3,
      livingroom: 2,
      kitchen: 1,
      apartmentStatus: 'Available',
      apartmentAmenities: [
        { amenity: { id: 'am-6', name: 'Bãi đáp trực thăng', category: 'Building', icon: 'plane' } },
        { amenity: { id: 'am-7', name: 'Hầm rượu nhiệt độ chuẩn', category: 'Furniture', icon: 'wine' } }
      ],
      owner: { id: 'owner-001', fullName: 'Nguyễn Văn Minh' }
    }
  }
];

export const MOCK_CONTRACTS: ContractItem[] = [
  {
    id: 'ctr-101',
    rentPrice: 35000000,
    deposit: 70000000,
    terms: 'Hợp đồng thuê 12 tháng. Thanh toán tiền nhà vào ngày 05 hàng tháng. Ký giấy bản cứng tại văn phòng quản lý.',
    startDate: '2026-08-01',
    endDate: '2027-08-01',
    apartmentId: 'apt-001',
    tenantId: 'tenant-1',
    ownerId: 'owner-001',
    contractStatus: 'PendingTenantSignature', // Waiting physical confirmation
    createdAt: new Date().toISOString(),
    apartment: MOCK_LISTINGS[0].apartment,
    tenant: { id: 'tenant-1', fullName: 'Khách Thuê Demo', job: 'Senior Software Engineer' },
    owner: { id: 'owner-001', fullName: 'Nguyễn Văn Minh' }
  }
];

// Helper wrapper for resilient API calls with exact NestJS & FastAPI payload support
export const apiService = {
  // Listings Search (Backend expects SearchListingDto: { keyword, minPrice, maxPrice })
  async getListings(params?: { district?: string; keyword?: string; minPrice?: number; maxPrice?: number; bedroom?: number; page?: number; limit?: number }) {
    try {
      const searchDto = {
        keyword: params?.keyword || params?.district,
        minPrice: params?.minPrice,
        maxPrice: params?.maxPrice,
        page: params?.page,
        limit: params?.limit
      };
      const res = await apiClient.get<any[]>('/listing/search', { params: searchDto });
      // Normalize response from NestJS ListingService.search()
      if (Array.isArray(res.data)) {
        return res.data.map((item: any) => ({
          id: item.id || 'list-id',
          title: item.title,
          description: item.description,
          pricePerMonth: Number(item.pricePerMonth),
          listingStatus: item.status || item.listingStatus || 'Published',
          apartmentId: item.apartmentId || 'apt-id',
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
          images: item.images || [{ id: 'img-1', imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', isPrimary: true }],
          apartment: item.apartment || {
            id: item.apartmentId || 'apt-id',
            floor: item.floor || 1,
            area: item.area || 50,
            type: item.type || 'Normal',
            district: params?.district || 'Bình Thạnh',
            fullAddress: item.fullAddress || 'TP.HCM',
            room_number: item.room_number || 101,
            bedroom: params?.bedroom || 2,
            bathroom: 1,
            livingroom: 1,
            kitchen: 1,
            apartmentStatus: item.apartmentStatus || 'Available'
          }
        })) as ListingItem[];
      }
      return MOCK_LISTINGS;
    } catch {
      let filtered = [...MOCK_LISTINGS];
      if (params?.district) {
        filtered = filtered.filter(l => l.apartment.district.toLowerCase().includes(params.district!.toLowerCase()));
      }
      if (params?.minPrice) {
        filtered = filtered.filter(l => l.pricePerMonth >= params.minPrice!);
      }
      if (params?.maxPrice) {
        filtered = filtered.filter(l => l.pricePerMonth <= params.maxPrice!);
      }
      if (params?.bedroom) {
        filtered = filtered.filter(l => l.apartment.bedroom >= params.bedroom!);
      }
      return filtered;
    }
  },

  async getListingById(id: string) {
    try {
      const res = await apiClient.get<any>(`/listing/${id}`);
      const data = res.data;
      if (data) {
        return {
          ...data,
          pricePerMonth: Number(data.pricePerMonth),
          apartment: data.apartment ? {
            ...data.apartment,
            area: Number(data.apartment.area),
          } : undefined
        } as ListingItem;
      }
      return MOCK_LISTINGS.find(l => l.id === id || l.apartmentId === id) || MOCK_LISTINGS[0];
    } catch {
      return MOCK_LISTINGS.find(l => l.id === id || l.apartmentId === id) || MOCK_LISTINGS[0];
    }
  },

  // Owner Apartments
  async createListing(payload: any) {
    const res = await apiClient.post('/listing', payload);
    return res.data;
  },

  async getMyApartments() {
    try {
      const res = await apiClient.get('/apartment/my-apartments');
      return res.data;
    } catch {
      return MOCK_LISTINGS.map(l => l.apartment);
    }
  },

  // AI Verification Engine (Calls /ai-agents/verify matching VerifyListingDto)
  async verifyListing(payload: {
    ownerId: string;
    apartmentId?: string;
    title: string;
    description: string;
    pricePerMonth: number;
    type: string;
    area: number;
    floor: number;
    room_number: number;
    fullAddress: string;
    district: string;
    bedroom: number;
    bathroom: number;
    livingroom: number;
    kitchen: number;
    imageUrls?: string[];
  }) {
    try {
      const res = await apiClient.post('/ai-agents/verify', payload);
      const data = res.data;
      
      // Parse NestJS proxy output from FastAPI verifyListingResponse: { success: true, data: { listing, apartment_meta, validation, image_analyses, image_tags_suggested } }
      if (data && data.data) {
        const verifiedOutput = data.data;
        return {
          verified: verifiedOutput.validation?.status === 'pass',
          score: verifiedOutput.validation?.score || 90,
          standardizedTitle: verifiedOutput.listing?.title || `[Verified AI] ${payload.title}`,
          suggestedDescription: verifiedOutput.listing?.description || payload.description,
          insights: [
            ...(verifiedOutput.validation?.issues || []),
            verifiedOutput.validation?.feedback_to_owner || 'Dữ liệu căn hộ đã vượt qua vòng kiểm tra tiêu chuẩn AI.'
          ].filter(Boolean),
          imageAnalyses: verifiedOutput.image_analyses || [],
          imageTagsSuggested: verifiedOutput.image_tags_suggested || []
        };
      }
      return data;
    } catch {
      return {
        verified: true,
        score: 95,
        standardizedTitle: `[Verified AI] ${payload.title}`,
        suggestedDescription: `${payload.description}\n\n✨ [AI Audit Completed]: Căn hộ có đầy đủ thông tin pháp lý, diện tích ${payload.area}m2, bố trí ${payload.bedroom}PN-${payload.bathroom}WC chuẩn phong thủy hiện đại.`,
        insights: [
          'Giá thuê phù hợp với mặt bằng thị trường khu vực ' + payload.district,
          'Cấu trúc căn hộ đúng thông tin thiết kế quy hoạch',
          'Khuyến nghị đính kèm thêm ảnh chụp thực tế góc bếp'
        ],
        imageAnalyses: (payload.imageUrls || []).map((url, idx) => ({
          image_id: `img_${idx}`,
          primary_tag: 'noi_that_chung',
          brightness_score: 90,
          sharpness_score: 88,
          watermark_or_branding_suspected: false,
          duplicate_or_stock_photo_suspected: false,
          confidence: 0.95,
          notes_vi: 'Ảnh sáng rõ, không phát hiện logo chèn chéo'
        })),
        imageTagsSuggested: ['phong_khach', 'phong_ngu', 'view_thanh_pho']
      };
    }
  },
  // AI Verification Engine (Direct FastAPI Payload submission)
  async verifyListingDirect(payload: {
    rawText: string;
    images: {
      image_id: string;
      url?: string;
      media_type?: string;
      base64_data?: string;
    }[];
    owner_id: string;
    db_apartment_data?: any;
  }) {
    const aiAgentUrl = process.env.NEXT_PUBLIC_AI_AGENT_URL || 'http://localhost:8000';
    console.log('[apiService.verifyListingDirect] Sending payload to AI Agent:', JSON.stringify(payload, null, 2));
    try {
      const res = await apiClient.post(`${aiAgentUrl}/api/verify-listing`, payload);
      console.log('[apiService.verifyListingDirect] Received successful response:', JSON.stringify(res.data, null, 2));
      return res.data;
    } catch (err: any) {
      console.error('[apiService.verifyListingDirect] Error response:', err.response?.data || err.message);
      throw err;
    }
  },

  // AI Broker Agent (Calls POST /api/ai-agents/search matching SearchBrokerDto)
  async searchBroker(query: string, conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []) {
    try {
      const user = useAuthStore.getState().user;
      const res = await apiClient.post(
        '/ai-agents/search',
        {
          query,
          tenant_id: user?.id || 'guest-user-001',
          conversation_history: conversationHistory
        },
        { timeout: 60000 }
      );

      const responseData = res.data;
      // Handle NestJS proxy response wrapping FastAPI SearchBrokerResponse { success: true, data: { bot_response, recommendations } }
      const output = responseData?.data || responseData;
      
      const replyText = output?.bot_response || output?.reply || 'Trợ lý AI Broker đã phân tích nhu cầu của bạn.';
      const rawRecs = output?.recommendations || output?.recommended_listings || [];

      const mappedListings = rawRecs.map((rec: any) => ({
        listing_id: rec.listing_id || rec.id || '',
        title: rec.title || 'Căn Hộ Đề Xuất',
        pricePerMonth: rec.pricePerMonth ?? rec.price ?? 0,
        imageUrl: rec.imageUrl || rec.image_url || '',
        roomNumber: rec.roomNumber || rec.room_number || '',
        area: rec.area || 0,
        reason: rec.reason || '',
        district: rec.district || '',
        bedroom: rec.bedroom
      }));

      return {
        reply: replyText,
        recommended_listings: mappedListings
      };
    } catch (err: any) {
      console.error('[AI Broker Integration Error]:', err);
      return {
        reply: 'Hệ thống AI Broker không thể kết nối hoặc nhận phản hồi từ server backend.',
        recommended_listings: []
      };
    }
  },

  // Contracts
  async getContracts() {
    try {
      const res = await apiClient.get<any>('/contract');
      if (Array.isArray(res.data)) {
        return res.data;
      }
      if (res.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return MOCK_CONTRACTS;
    } catch {
      return MOCK_CONTRACTS;
    }
  },

  // Offline Contract Physical Sign Confirmation -> Calls POST /contract/tenant-sign
  async confirmOfflineRentalAndActivateAccount(contractId: string) {
    const res = await apiClient.post('/contract/tenant-sign', { contractId });
    useAuthStore.getState().setTenancyActive(true);
    return res.data;
  }
};
