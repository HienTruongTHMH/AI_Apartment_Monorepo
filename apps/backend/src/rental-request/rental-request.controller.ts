import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RentalRequestService } from './rental-request.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rental-request')
@UseGuards(JwtAuthGuard)
export class RentalRequestController {
  constructor(private readonly rentalRequestService: RentalRequestService) {}

  @Post()
  create(@Req() req: any, @Body() body: { apartmentId: string, message?: string }) {
    return this.rentalRequestService.create(req.user.accountId, body.apartmentId, body.message);
  }

  @Get('my-requests')
  findMyRequests(@Req() req: any) {
    return this.rentalRequestService.findMyRequests(req.user.accountId);
  }

  @Get('owner-requests')
  findOwnerRequests(@Req() req: any) {
    return this.rentalRequestService.findOwnerRequests(req.user.accountId);
  }

  @Patch(':id/accept')
  accept(@Param('id') id: string, @Req() req: any) {
    return this.rentalRequestService.accept(id, req.user.accountId);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Req() req: any) {
    return this.rentalRequestService.reject(id, req.user.accountId);
  }
}
