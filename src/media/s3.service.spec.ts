import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';

// Sử dụng describe để gom nhóm test
describe('S3Service Integration (Real AWS)', () => {
  let service: S3Service;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env', // hoặc '.env.test'
        }),
      ],
      providers: [S3Service],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  it('should generate a REAL presigned URL', async () => {
    // Input giả định
    const containerId = 'user-integration-test';
    const contentType = 'image/png';
    const userId = 'integration-test-user34324';
    const mediaFileId = 'integration-test-media-file';

    console.log('--- Đang gọi AWS S3 thật... ---');

    try {
      const result = await service.getPresignedUrl(userId, containerId, mediaFileId, contentType);

      // Log ra để bạn có thể copy link và test thử trên trình duyệt/Postman
      console.log('✅ Kết quả trả về từ AWS:');
      console.log('---------------------------------------------------');
      console.log('Upload URL (PUT):', result);

      // Kiểm tra đơn giản
      expect(result).toBeDefined();
      expect(result).toContain('amazonaws.com');
      expect(result).toContain('X-Amz-Signature'); // Chữ ký chứng tỏ AWS SDK đã ký thành công

    } catch (error) {
      console.error('❌ Lỗi kết nối AWS:', error);
      throw error;
    }
  });
});