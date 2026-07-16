import {
  Injectable,
  InternalServerErrorException,
  GatewayTimeoutException,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError, timeout, TimeoutError } from 'rxjs';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { VerifyListingDto } from './dto/verify-listing.dto';
import { SearchBrokerDto } from './dto/search-broker.dto';
import { Apartment } from '@prisma/client';

const _MAX_HISTORY_MESSAGES = 6; // 3 user + 3 assistant turns

/** Kiểm tra lỗi kết nối TCP bị từ chối (ECONNREFUSED). */
function isConnectionRefused(err: any): boolean {
  return (
    err?.code === 'ECONNREFUSED' ||
    err?.cause?.code === 'ECONNREFUSED' ||
    (typeof err?.message === 'string' && err.message.includes('ECONNREFUSED'))
  );
}

@Injectable()
export class AiAgentsService {
  private readonly logger = new Logger(AiAgentsService.name);
  private readonly aiBaseUrl = 'http://127.0.0.1:8000'; // Cổng chạy FastAPI

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async verifyApartmentListing(dto: VerifyListingDto) {

    let dbApartment: (Apartment & { apartmentListing?: any }) | null = null;

    if(dto.apartmentId && dto.apartmentId !== "NEW_DRAFT"){
      dbApartment = await this.prisma.apartment.findUnique({
        where: { id: dto.apartmentId },
        include: { apartmentListing: true }
      }) as any;

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

    const payload = {
      owner_id: dto.ownerId,
      listing_id: dbApartment?.apartmentListing?.id || null, // Pass real Listing UUID if it exists
      rawText: constructedRawText,
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

    this.logger.log(`Gửi dữ liệu kiểm duyệt cho Agent: Apartment ${dto.apartmentId} (listing_id=${payload.listing_id})`);

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.aiBaseUrl}/api/verify-listing`, payload).pipe(
        timeout(60_000),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            this.logger.error('AI Verification Agent timeout sau 60 giây.');
            throw new GatewayTimeoutException('AI Verification Engine xử lý quá lâu. Vui lòng thử lại.');
          }
          if (isConnectionRefused(error)) {
            this.logger.error('AI Verification Agent: ECONNREFUSED — FastAPI không chạy.');
            throw new ServiceUnavailableException('AI Verification Engine chưa khởi động. Vui lòng thử lại sau.');
          }
          this.logger.error(`AI Agent Error: ${error.message}`);
          throw new InternalServerErrorException('AI Verification Engine đang bận.');
        }),
      ),
    );

    return data;
  }

  async searchBroker(dto: SearchBrokerDto) {
    // 1. Session management
    const sessionId = dto.sessionId || randomUUID();
    const sessionKey = `chat:${sessionId}`;

    // Load conversation history từ Redis (ưu tiên hơn history từ client)
    const cachedRaw = await this.redisService.get(sessionKey);
    const fullHistory: { role: string; content: string }[] = cachedRaw
      ? JSON.parse(cachedRaw)
      : (dto.conversation_history || []);

    // Trim history — chỉ giữ N tin nhắn gần nhất để giảm token
    const history = fullHistory.slice(-_MAX_HISTORY_MESSAGES);

    this.logger.log(`[Session: ${sessionId}] History: ${history.length} messages. Query: "${dto.query}"`);

    // 2. Fetch published listings from PostgreSQL as fallback source if Qdrant has missing points
    const dbListings = await this.prisma.listing.findMany({
      where: { listingStatus: 'Published' },
      include: {
        apartment: { select: { room_number: true, floor: true, area: true, district: true, fullAddress: true } },
        images: { where: { isPrimary: true }, take: 1 }
      },
      take: 50,
    });

    const listings = dbListings.map(l => ({
      listing_id: l.id,
      title: l.title,
      description: l.description,
      pricePerMonth: Number(l.pricePerMonth),
      roomNumber: String(l.apartment?.room_number ?? ''),
      floor: l.apartment?.floor ?? 1,
      area: Number(l.apartment?.area ?? 0),
      district: l.apartment?.district ?? '',
      fullAddress: l.apartment?.fullAddress ?? '',
      imageUrl: l.images?.[0]?.imageUrl || null,
    }));

    const payload = {
      query: dto.query,
      tenant_id: dto.tenant_id,
      conversation_history: history,
      audio_url: dto.audio_url || null,
      listings,
    };

    // 3. Gọi FastAPI Broker endpoint
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.aiBaseUrl}/api/search`, payload).pipe(
        timeout(35_000),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            this.logger.error('AI Broker Agent timeout sau 35 giây.');
            throw new GatewayTimeoutException('AI Broker Engine xử lý quá lâu. Vui lòng thử lại.');
          }
          if (isConnectionRefused(error)) {
            this.logger.error('AI Broker Agent: ECONNREFUSED — FastAPI service không chạy.');
            throw new ServiceUnavailableException('Trợ lý AI chưa khởi động. Vui lòng thử lại sau ít phút.');
          }
          this.logger.error(`AI Broker Agent Error: ${error.message}`);
          throw new InternalServerErrorException('AI Broker Engine đang bận.');
        }),
      ),
    );

    // 4. Enrich recommendations — thay thế Qdrant hash-ID bằng listing_id thật từ PostgreSQL
    const agentOutput = data?.data || data;
    const rawRecs: any[] = agentOutput?.recommendations || [];

    const enrichedRecs = await Promise.all(
      rawRecs.map(async (rec) => {
        // Kiểm tra xem listing_id đã là UUID hợp lệ chưa
        const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          rec.listing_id || '',
        );

        if (isValidUuid) {
          // listing_id đã đúng — chỉ enrich imageUrl nếu thiếu
          if (!rec.imageUrl) {
            const listing = await this.prisma.listing.findUnique({
              where: { id: rec.listing_id },
              select: { images: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } } },
            });
            rec.imageUrl = listing?.images?.[0]?.imageUrl || null;
          }
          return rec;
        }

        // listing_id là hash — tìm listing thật qua title + price
        this.logger.warn(
          `[Enrich] Qdrant listing_id "${rec.listing_id}" là hash, đang tra cứu PostgreSQL...`,
        );

        const priceVnd = Number(rec.pricePerMonth ?? 0);
        // Tìm listing khớp title (case-insensitive) trong khoảng giá ±5%
        const candidates = await this.prisma.listing.findMany({
          where: {
            listingStatus: 'Published',
            title: { contains: (rec.title || '').split(' ').slice(0, 4).join(' '), mode: 'insensitive' },
          },
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            apartment: { select: { area: true, district: true, fullAddress: true, room_number: true } },
          },
          take: 5,
        });

        // Chọn candidate gần giá nhất
        const matched = candidates.sort((a, b) => {
          const diffA = Math.abs(Number(a.pricePerMonth) - priceVnd);
          const diffB = Math.abs(Number(b.pricePerMonth) - priceVnd);
          return diffA - diffB;
        })[0];

        if (matched) {
          this.logger.log(
            `[Enrich] Resolved hash "${rec.listing_id}" → real listing_id="${matched.id}"`,
          );
          return {
            ...rec,
            listing_id: matched.id,
            title: matched.title,
            pricePerMonth: Number(matched.pricePerMonth),
            imageUrl: matched.images?.[0]?.imageUrl || rec.imageUrl || null,
            roomNumber: String(matched.apartment?.room_number ?? rec.roomNumber ?? ''),
            area: Number(matched.apartment?.area ?? rec.area ?? 0),
          };
        }

        this.logger.warn(`[Enrich] Không tìm thấy listing thật cho hash "${rec.listing_id}".`);
        return rec;
      }),
    );

    // Ghép lại response với recommendations đã enrich
    const enrichedData = {
      ...data,
      data: {
        ...agentOutput,
        recommendations: enrichedRecs,
      },
      sessionId,
    };

    // 5. Cập nhật history và lưu vào Redis (TTL: 1 giờ)
    const botResponse: string = agentOutput?.bot_response ?? '';
    const updatedHistory = [
      ...fullHistory,
      { role: 'user', content: dto.query },
      { role: 'assistant', content: botResponse },
    ];
    await this.redisService.set(sessionKey, JSON.stringify(updatedHistory), 3600);

    // 6. Trả kết quả kèm sessionId
    return enrichedData;
  }
}