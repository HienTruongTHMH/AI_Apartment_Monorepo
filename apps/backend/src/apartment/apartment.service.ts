import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApartmentStatus } from '@prisma/client';
import { SearchApartmentDto } from './dto/search-apartment.dto';

@Injectable()
export class ApartmentService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(createApartmentDto: CreateApartmentDto) {

    return this.prisma.apartment.create({
      data: createApartmentDto
    });
  }
  // Đặc biệt trong Nest thì chỉ cần khai báo async trước hàm gọi DB. 
  async findAll() {
    return this.prisma.apartment.findMany();
  }


  findOne(id: string) {
    return this.prisma.apartment.findUnique({
      where: {id}
    });
  }

  update(id: string, updateApartmentDto: UpdateApartmentDto) {
    return `This action updates a #${id} apartment`;
  }

  remove(id: string) {
    return this.prisma.apartment.delete({
      where: {id}
    });
  }
}
