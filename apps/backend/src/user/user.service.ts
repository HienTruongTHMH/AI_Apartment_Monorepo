import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `Trả về thông tin cá nhân`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `Cập nhập thôn tin cá nhân`;
  }

  remove(id: number) {
    return `Xoá đi tài khoản`;
  }
}
