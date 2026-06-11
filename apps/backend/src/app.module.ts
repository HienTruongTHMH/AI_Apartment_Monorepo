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

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, ListingModule, ApartmentModule, ContractModule, AmenityModule, UserModule, AiAgentsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
