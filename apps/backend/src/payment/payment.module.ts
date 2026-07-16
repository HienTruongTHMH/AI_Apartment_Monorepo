import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { BillingCronService } from './cron/billing-cron.service';
import { OverdueCronService } from './cron/overdue-cron.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, BillingCronService, OverdueCronService],
  exports: [PaymentService, BillingCronService, OverdueCronService],
})
export class PaymentModule {}
