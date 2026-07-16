import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ListingModule } from './listing/listing.module';
import { ApartmentModule } from './apartment/apartment.module';
import { ContractModule } from './contract/contract.module';
import { AmenityModule } from './amenity/amenity.module';
import { UserModule } from './user/user.module';
import { AiAgentsModule } from './ai-agents/ai-agents.module';
import { AuthModule } from './auth/auth.module';
import { RedisController } from './redis/redis.controller';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
import { RentalRequestModule } from './rental-request/rental-request.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    PrismaModule, ListingModule, ApartmentModule,
    ContractModule, AmenityModule, UserModule, AiAgentsModule, AuthModule, RedisModule, RentalRequestModule,
    PaymentModule
  ],
  controllers: [AppController, RedisController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
