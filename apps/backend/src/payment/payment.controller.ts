import { Controller, Get, Patch, Param, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequireProfile } from 'src/auth/decorators/require-profile.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req, @Query('contractId') contractId?: string) {
    return this.paymentService.findAll(req.user, contractId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  @Get('pending')
  async getPendingPayments(@Req() req) {
    return this.paymentService.getPendingPayments(req.user.ownerProfileId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireProfile('OWNER')
  @Patch(':id/confirm')
  async confirmPayment(@Param('id') id: string, @Req() req) {
    return this.paymentService.confirmPayment(id, req.user.ownerProfileId);
  }
}
