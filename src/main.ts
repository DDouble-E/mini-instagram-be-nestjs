import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/transform/transform.interceptor';
import { HttpExceptionFilter } from './common/http-exception/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu có trường lạ gửi lên
      transform: true, // <--- ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT
    }),
  );

  // 2. Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('Tài liệu API cho dự án training')
    .setVersion('1.0')
    .addBearerAuth() // Thêm nút "Authorize" để nhập Token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Đường dẫn sẽ là /api

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());


  await app.listen(process.env.API_PORT ?? 8000);
}
bootstrap();
