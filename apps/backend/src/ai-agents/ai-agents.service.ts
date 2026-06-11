import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifyListingDto } from './dto/verify-listing.dto';
import { Apartment } from '@prisma/client';


@Injectable()
export class AiAgentsService {
  private readonly logger = new Logger(AiAgentsService.name);
  private readonly aiBaseUrl = 'http://0.0.0.0:8000'; // Cổng chạy FastAPI

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
      images: (dto.imageUrls || []).map((url, index) => ({
        image_id: `img_${index}`,
        url: url,
        media_type: 'image/jpeg'
      })),
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

    // 3. Gọi sang FastAPI
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.aiBaseUrl}/api/verify-listing`, payload).pipe(
        catchError((error) => {
          this.logger.error(`AI Agent Error: ${error.message}`);
          throw new InternalServerErrorException('AI Verification Engine đang bận.');
        }),
      ),
    );

    // 4. Trả kết quả JSON chuẩn từ Pydantic về cho NestJS xử lý tiếp
    return data; 
  }
}