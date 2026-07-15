import { Module } from '@nestjs/common';
import { RentalRequestService } from './rental-request.service';
import { RentalRequestController } from './rental-request.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RentalRequestController],
  providers: [RentalRequestService, PrismaService],
})
export class RentalRequestModule {}
