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

  async create(createListingDto: CreateListingDto, ownerAccountId: string) {
    const { apartmentId, apartment, ...listData } = createListingDto;

    // Check if the owner profile exists and is valid
    const ownerProfile = await this.prisma.ownerProfile.findUnique({
      where: { accountId: ownerAccountId }
    });

    if (!ownerProfile) {
      throw new HttpException(
        'Tài khoản của bạn chưa được cấp quyền chủ hộ hoặc không hợp lệ.',
        HttpStatus.FORBIDDEN
      );
    }

    const ownerProfileId = ownerProfile.id;

    if (apartmentId) {
      // Validate that the apartment actually exists in the database
      const existingApartment = await this.prisma.apartment.findUnique({
        where: { id: apartmentId }
      });

      if (!existingApartment) {
        // If it doesn't exist but apartment details are provided, create it with forced ownerId
        if (apartment) {
          return this.prisma.listing.create({
            data: {
              ...listData,
              apartment: {
                create: {
                  id: apartmentId,
                  ...apartment,
                  ownerId: ownerProfileId
                }
              }
            }
          });
        }
        // If no details are provided, throw an error
        throw new HttpException(
          `Căn hộ với ID ${apartmentId} không tồn tại trong cơ sở dữ liệu.`,
          HttpStatus.BAD_REQUEST
        );
      }

      // Check if the existing apartment belongs to the authenticated owner
      if (existingApartment.ownerId !== ownerProfileId) {
        throw new HttpException(
          'Bạn không có quyền đăng tin cho căn hộ này vì nó thuộc sở hữu của chủ hộ khác.',
          HttpStatus.FORBIDDEN
        );
      }

      // If it exists and belongs to the owner, connect to it
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
            create: {
              ...apartment,
              ownerId: ownerProfileId
            }
          }
        }
      });
    }

    throw new HttpException(
      'Yêu cầu phải cung cấp thông tin căn hộ (apartment) hoặc ID căn hộ (apartmentId).',
      HttpStatus.BAD_REQUEST
    );
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

    const page = searchDto.page || 1;
    const limit = searchDto.limit || 9;
    const skip = (page - 1) * limit;

    const rawListings = await this.prisma.listing.findMany({
      where: whereCondition,
      skip,
      take: limit,
      include: {
        images: true,
        apartment: {
          include: {
            owner: true,
            apartmentAmenities: {
              include: {
                amenity: true
              }
            }
          }
        },
      }
    });

    // Lọc dữ liệu cho Agent & UI
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

      // Bổ sung đầy đủ cho UI
      images: listing.images,
      apartment: {
        ...listing.apartment,
        area: Number(listing.apartment.area),
        pricePerMonth: Number(listing.pricePerMonth),
      }
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
        apartment: {
          include: {
            owner: true,
            apartmentAmenities: {
              include: {
                amenity: true
              }
            }
          }
        },
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
        images: true,
        apartment: {
          include: {
            owner: true,
            apartmentAmenities: {
              include: {
                amenity: true
              }
            }
          }
        },
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
