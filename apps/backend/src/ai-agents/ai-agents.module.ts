import { Module } from '@nestjs/common';
import { AiAgentsService } from './ai-agents.service';
import { AiAgentsController } from './ai-agents.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [AiAgentsService],
  controllers: [AiAgentsController]
})
export class AiAgentsModule {}
