import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Tăng giới hạn body lên 20MB để nhận ảnh base64 (5 ảnh ~500KB mỗi ảnh)
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));

  app.enableCors({
    origin: true, // Cho phép tất cả các domain (kể cả Railway Frontend) gọi API
    methods: [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  // Kiểm tra cục bộ
  // Tụ động xoá file rác
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();