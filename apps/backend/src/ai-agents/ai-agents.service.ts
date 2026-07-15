import { Injectable, InternalServerErrorException, GatewayTimeoutException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError, timeout, TimeoutError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifyListingDto } from './dto/verify-listing.dto';
import { SearchBrokerDto } from './dto/search-broker.dto';
import { Apartment } from '@prisma/client';


@Injectable()
export class AiAgentsService {
  private readonly logger = new Logger(AiAgentsService.name);
  private readonly aiBaseUrl = 'http://127.0.0.1:8000'; // Cổng chạy FastAPI

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService
  ) {}

  async verifyApartmentListing(dto: VerifyListingDto) {

    let dbApartment: Apartment | null = null;

    if(dto.apartmentId && dto.apartmentId !== "NEW_DRAFT"){
      // 1. Lấy dữ liệu gốc từ Database để Agent có thông tin đối soát
      dbApartment = await this.prisma.apartment.findUnique({
        where: { id: dto.apartmentId }
      });

      if (!dbApartment) {
        this.logger.warn(`Không tìm thấy Apartment ID: ${dto.apartmentId} trong DB dù có ID gửi lên.`);
      }
    }

    const constructedRawText = `
      [THÔNG TIN NGƯỜI DÙNG NHẬP]
      - Tiêu đề: ${dto.title}
      - Mô tả chi tiết: ${dto.description}
      - Giá thuê: ${dto.pricePerMonth} VND/tháng
      - Phân loại: ${dto.type}, Diện tích: ${dto.area}m2, Tầng: ${dto.floor}, Mã phòng: ${dto.room_number}
      - Địa chỉ: ${dto.fullAddress}, Khu vực: ${dto.district}
      - Bố trí phòng: ${dto.bedroom} ngủ, ${dto.bathroom} vệ sinh, ${dto.livingroom} khách, ${dto.kitchen} bếp.
          `.trim();
    // 2. Chuẩn bị payload khớp với Pydantic schema bên Python
    const payload = {
      owner_id: dto.ownerId,
      rawText: constructedRawText, // Đưa chuỗi vừa ghép vào đây
      images: (dto.imageUrls || []).map((url, index) => {
        if (url.startsWith('data:')) {
          const match = url.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            return {
              image_id: `img_${index}`,
              media_type: match[1],
              base64_data: match[2],
            };
          }
        }
        return {
          image_id: `img_${index}`,
          url: url,
          media_type: 'image/jpeg',
        };
      }),
      db_apartment_data: dbApartment ? {
        id: dbApartment.id,
        area: Number(dbApartment.area),
        floor: Number(dbApartment.floor),
        room_number: Number(dbApartment.room_number),
        type: dbApartment.type,
        kitchen: Number(dbApartment.kitchen),
        bathroom: Number(dbApartment.bathroom),
        livingroom: Number(dbApartment.livingroom),
        bedroom: Number(dbApartment.bedroom),
        fullAddress: dbApartment.fullAddress,
        apartmentStatus: dbApartment.apartmentStatus,
        note: dbApartment.note || "",
      } : null,
    };

    this.logger.log(`Gửi dữ liệu kiểm duyệt cho Agent: Apartment ${dto.apartmentId}`);

    // 3. Gọi sang FastAPI (timeout 60s — phân tích ảnh có thể chậm)
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.aiBaseUrl}/api/verify-listing`, payload).pipe(
        timeout(60_000),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            this.logger.error('AI Verification Agent timeout sau 60 giây.');
            throw new GatewayTimeoutException('AI Verification Engine xử lý quá lâu. Vui lòng thử lại.');
          }
          this.logger.error(`AI Agent Error: ${error.message}`);
          throw new InternalServerErrorException('AI Verification Engine đang bận.');
        }),
      ),
    );

    // 4. Trả kết quả JSON chuẩn từ Pydantic về cho NestJS xử lý tiếp
    return data; 
  }

  async searchBroker(dto: SearchBrokerDto) {
    this.logger.log(`Truy vấn danh sách căn hộ từ Supabase để gửi cho Agent Broker...`);

    // 1. Lấy tất cả bài đăng đã duyệt từ Postgres / Supabase
    const dbListings = await this.prisma.listing.findMany({
      where: { listingStatus: 'Published' },
      include: {
        apartment: {
          include: {
            apartmentAmenities: {
              include: {
                amenity: true
              }
            }
          }
        },
        images: true
      }
    });

    this.logger.log(`Đã tìm thấy ${dbListings.length} căn hộ. Đang chuẩn bị dữ liệu gửi sang Python Broker...`);

    // 2. Định dạng cấu trúc danh sách khớp với Python RAG
    const listings = dbListings.map(listing => {
      const amenities = (listing.apartment.apartmentAmenities || []).map(aa => aa.amenity.name);
      const primaryImage = listing.images.find(img => img.isPrimary)?.imageUrl || listing.images[0]?.imageUrl || null;
      return {
        listing_id: listing.id,
        title: listing.title,
        description: listing.description,
        pricePerMonth: Number(listing.pricePerMonth),
        roomNumber: String(listing.apartment.room_number),
        floor: listing.apartment.floor,
        area: Number(listing.apartment.area),
        district: listing.apartment.district,
        fullAddress: listing.apartment.fullAddress,
        amenities,
        imageUrl: primaryImage,
      };
    });

    // 3. Chuẩn bị payload gửi sang FastAPI
    const payload = {
      query: dto.query,
      tenant_id: dto.tenant_id,
      conversation_history: dto.conversation_history || [],
      audio_url: dto.audio_url || null,
      listings,
    };

    // 4. Gọi sang FastAPI Broker endpoint
    // NOTE: Gemini AI có thể mất 30-60s để xử lý RAG pipeline
    // Set 90s để có đủ buffer, tránh timeout giả (false positive)
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.aiBaseUrl}/api/search`, payload).pipe(
        timeout(90_000),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            this.logger.error('AI Broker Agent timeout sau 90 giây.');
            throw new GatewayTimeoutException('AI Broker Engine xử lý quá lâu. Vui lòng thử lại.');
          }
          this.logger.error(`AI Broker Agent Error: ${error.message}`);
          throw new InternalServerErrorException('AI Broker Engine đang bận.');
        }),
      ),
    );

    return data;
  }
}