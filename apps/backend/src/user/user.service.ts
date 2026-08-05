import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async getOwner(id: string) {
    const owner = await this.prismaService.ownerProfile.findFirst({
      where: { accountId: id },
      include: { account: true }
    })
    return owner;
  }

  async getTenantProfile(accountId: string) {
    return this.prismaService.tenantProfile.findUnique({
      where: { accountId }
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `Trả về thông tin cá nhân`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `Cập nhập thôn tin cá nhân`;
  }

  async updateProfile(accountId: string, dto: UpdateProfileDto) {
    return this.prismaService.$transaction(async (tx) => {
      // 1. Cập nhật bảng gốc Account
      const account = await tx.account.update({
        where: { id: accountId },
        data: {
          ...(dto.fullName && { fullName: dto.fullName }),
        }
      });

      // 2. Đồng bộ sang TenantProfile nếu tồn tại
      const tenant = await tx.tenantProfile.findUnique({ where: { accountId } });
      if (tenant && dto.fullName) {
        await tx.tenantProfile.update({
          where: { accountId },
          data: { fullName: dto.fullName }
        });
      }

      // 3. Đồng bộ sang OwnerProfile nếu tồn tại
      const owner = await tx.ownerProfile.findUnique({ where: { accountId } });
      if (owner && dto.fullName) {
        await tx.ownerProfile.update({
          where: { accountId },
          data: { fullName: dto.fullName }
        });
      }

      return account;
    });
  }

  remove(id: number) {
    return `Xoá đi tài khoản`;
  }
}
