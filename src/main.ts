import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { join } from 'path';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // nếu có dùng cookie / refresh token
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu có trường lạ gửi lên
      transform: true, // <--- ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT
    }),
  );
  console.log('TEMPLATE DIR:', join(process.cwd(), 'dist', 'mail'));


  // 2. Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('Tài liệu API cho dự án training')
    .setVersion('1.0')
    .addSecurityRequirements('bearer') // <--- Dòng này giúp mọi API đều hiện nút khóa mặc định
    .addBearerAuth() // Thêm nút "Authorize" để nhập Token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Đường dẫn sẽ là /api

  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),        // 🔥 log request duration
    new TransformResponseInterceptor(),  // format response
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),            // format error response
  );

  await app.listen(process.env.API_PORT ?? 8000);
}
bootstrap();
