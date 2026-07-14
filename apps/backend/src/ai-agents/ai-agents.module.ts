import { Module } from '@nestjs/common';
import { AiAgentsService } from './ai-agents.service';
import { AiAgentsController } from './ai-agents.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PrismaModule,
    HttpModule.register({
      // Cho phép chuyển tiếp payload ảnh base64 lớn sang FastAPI
      maxBodyLength: 20 * 1024 * 1024, // 20MB
      maxContentLength: 20 * 1024 * 1024,
    }),
  ],
  providers: [AiAgentsService],
  controllers: [AiAgentsController]
})
export class AiAgentsModule {}
