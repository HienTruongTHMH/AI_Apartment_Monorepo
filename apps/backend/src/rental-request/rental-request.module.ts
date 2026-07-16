import { Module } from '@nestjs/common';
import { RentalRequestService } from './rental-request.service';
import { RentalRequestController } from './rental-request.controller';
import { PrismaService } from '../prisma/prisma.service';

import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [RentalRequestController],
  providers: [RentalRequestService, PrismaService],
})
export class RentalRequestModule {}
