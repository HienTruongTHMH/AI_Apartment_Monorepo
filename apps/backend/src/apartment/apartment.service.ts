import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApartmentService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(createApartmentDto: CreateApartmentDto, accountId: string) {
    if (!accountId) {
      throw new UnauthorizedException("Thông tin không xác thực");
    }

    const owner = await this.prisma.ownerProfile.findUnique({
      where: { accountId }
    })

    if (!owner) {
      throw new UnauthorizedException("Bạn không có quyền tạo căn hộ");
    }

    return this.prisma.apartment.create({
      data: {
        ...createApartmentDto,
        ownerId: owner.id
      }
    });
  }

  // Đặc biệt trong Nest thì chỉ cần khai báo async trước hàm gọi DB. 
  async findAll() {
    return this.prisma.apartment.findMany();
  }



  async findBelonging(accountId: string) {
    return this.prisma.apartment.findMany({
      where: {
        ownerId: accountId,
      }
    })
  }


  async findOne(id: string) {
    return this.prisma.apartment.findUnique({
      where: { id }
    });
  }

  async update(id: string, updateApartmentDto: UpdateApartmentDto) {
    return this.prisma.apartment.update({
      where: { id },
      data: updateApartmentDto
    });
  }

  async remove(id: string) {
    return this.prisma.apartment.delete({
      where: { id }
    });
  }
}
