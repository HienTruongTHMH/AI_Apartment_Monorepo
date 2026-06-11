import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingDto } from './dto/search-listing.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createClient } from '@supabase/supabase-js'
import { sanitizeUpdateData } from 'utils/sanitize-data.utils';

@Injectable()
export class ListingService {
  constructor(private readonly prisma: PrismaService) { }

  private supabase = createClient(
    process.env.SUPABASE_PUBLIC as string,
    process.env.SUPABASE_SERVICE_KEY as string,
  )

  create(createListingDto: CreateListingDto) {
    const { apartmentId, apartment, ...listData } = createListingDto;

    if (apartmentId) {
      return this.prisma.listing.create({
        data: {
          ...listData,
          apartment: {
            connect: { id: apartmentId }
          }
        }
      });
    } else if (apartment) {
      return this.prisma.listing.create({
        data: {
          ...listData,
          apartment: {
            create: apartment
          }
        }
      })
    }
  }

  async search(searchDto: SearchListingDto) {
    const { keyword, minPrice, maxPrice } = searchDto;
    const whereCondition: Prisma.ListingWhereInput = {};

    if (keyword) {
      whereCondition.OR = [
        { title: { contains: keyword, mode: 'insensitive' } }, // mode insensitive không phân biệt hoa hay thường
        { description: { contains: keyword, mode: 'insensitive' } }
      ];
    }
    // Chỉ xét nếu có 1 trong 2 cần tìm
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereCondition.pricePerMonth = {}

      if (minPrice !== undefined) {
        whereCondition.pricePerMonth.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        whereCondition.pricePerMonth.lte = maxPrice;
      }
    }

    const rawListings = await this.prisma.listing.findMany({
      where: whereCondition,
      include: {
        apartment: true,
      }
    });

    // Lọc dữ liệu cho Agent
    return rawListings.map(listing => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      status: listing.listingStatus,

      // Ép kiểu từ String (Prisma Decimal) sang Number
      pricePerMonth: Number(listing.pricePerMonth),

      // Gộp dữ liệu căn hộ lên cùng một cấp cho gọn
      floor: listing.apartment.floor,
      area: Number(listing.apartment.area),
      apartmentStatus: listing.apartment.apartmentStatus,
    }))
  }

  async getPresignedUrl(body: { fileName: string }) {
    const { fileName } = body;
    const uniquePath = `listings/${Date.now()}-${fileName}`

    const { data, error } = await this.supabase.storage.from('/apartment-listings').createSignedUploadUrl(uniquePath)

    if (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      token: data.token,
      path: data.path
    }
  }

  async findAll() {
    return this.prisma.listing.findMany({
      where: { listingStatus: 'Published' }, // Chỉ lấy bài đã đăng
      include: {
        images: true, // Join bảng lấy ảnh
        apartment: true,
      }
    })
  }

  // async findAllByOwner(ownerId: string) {
  //   return this.prisma.listing.findMany({
  //     where: { listingStatus: 'Published' }, // Chỉ lấy bài đã đăng
  //     include: {
  //       images: true, // Join bảng lấy ảnh
  //       apartment: true,
  //     }
  //   })
  // }

  async findOne(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
      include: {
        apartment: true,
        images: true
      }
    });
  }

  async update(id: string, updateListingDto: UpdateListingDto) {
    // Phân nhóm dữ liệu
    const { apartment, imageUrls, ...listingData } = updateListingDto;
    const sanitizeListingData = sanitizeUpdateData(listingData);

    const updatedData: any = {
      ...sanitizeListingData,
    }

    // Check có thay đổi gì ở Căn hộ không ? 
    if (apartment) {
      const sanitizeApartmentData = sanitizeUpdateData(apartment);
      updatedData.apartment = {
        update: sanitizeApartmentData,
      }
    }

    if (updateListingDto.images) {
      updatedData.images = updateListingDto.images;
    } else if (imageUrls && imageUrls?.length > 0) {
      updatedData.images = {
        deleteMany: {}, // Xóa toàn bộ ảnh cũ của Listing này
        create: imageUrls.map((url, index) => ({
          imageUrl: url,
          isPrimary: index === 0 // Chọn ảnh đầu làm primary
        }))
      }
    }

    return this.prisma.listing.update({
      where: { id: id },
      data: updatedData,
      include: {
          apartment: true,
          images: true
      }
    });
  }

  remove(id: string) {
    return this.prisma.listing.delete({
      where: { id }
    });
  }
}
