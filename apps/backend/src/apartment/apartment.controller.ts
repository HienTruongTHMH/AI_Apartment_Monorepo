import {
  Controller, Get, Post, Body, Req,
  Patch, Param, Delete, ValidationPipe, UseGuards
} from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';

// Các Guards
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequireProfile } from 'src/auth/decorators/require-profile.decorator';

@Controller('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  @Post()
  create(@Body() createApartmentDto: CreateApartmentDto, @Req() req) {
    const accountId = req.user.accountId
    // console.log(accountId);
    return this.apartmentService.create(createApartmentDto, accountId);
  }

  @Get()
  findAll() {
    return this.apartmentService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  // Theo logic của mình thì: 
  // Tại đây mình muốn sử dụng Auth, hoặc 1 tool nào đó để lấy được accountId và gửi về cho service để lấy ra toàn bộ apartment và bài đăng mà account này sở hữu. 
  @Get('my-apartments')
  findBelonging(@Req() req) {
    const accountId = req.user.accountId
    return this.apartmentService.findBelonging(accountId);
  }

  // Không cần Roles Guard vì đây là tính năng người dùng click vào 1 card item
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apartmentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateApartmentDto: UpdateApartmentDto) {
    return this.apartmentService.update(id, updateApartmentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.apartmentService.remove(id);
  }
}
