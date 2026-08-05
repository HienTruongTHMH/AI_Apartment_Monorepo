import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequireProfile } from 'src/auth/decorators/require-profile.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  @Get('/owner-profile')
  getOwner(@Req() req) {
    const id = req.user.sub;
    return this.userService.getOwner(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/tenant-profile')
  getTenantProfile(@Req() req) {
    const accountId = req.user.accountId || req.user.sub;
    return this.userService.getTenantProfile(accountId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    const accountId = req.user.accountId || req.user.sub;
    const account = await this.userService.updateProfile(accountId, updateProfileDto);
    return {
      message: 'Cập nhật thông tin thành công',
      account
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
