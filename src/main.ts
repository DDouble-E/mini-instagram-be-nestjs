import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // 2. Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('Tài liệu API cho dự án training')
    .setVersion('1.0')
    .addBearerAuth() // Thêm nút "Authorize" để nhập Token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Đường dẫn sẽ là /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
