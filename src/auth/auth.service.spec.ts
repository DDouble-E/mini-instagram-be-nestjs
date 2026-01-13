import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load biến môi trường từ file .env
dotenv.config();

describe('AuthService (Integration Test - Real Email)', () => {
  let service: AuthService;

  // Mock các service khác nhưng GIỮ NGUYÊN MailerService thật
  const mockUsersService = { findOne: jest.fn() };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token_string_123456'),
    verify: jest.fn(),
  }; const mockConfigService = { get: jest.fn((key) => process.env[key]) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // Sử dụng MailerModule THẬT thay vì mock
        MailerModule.forRoot({
          transport: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
          },
          template: {
            // Lưu ý: dir phải trỏ đúng vào thư mục src/mail để test đọc được hbs
            dir: join(__dirname, '..', 'mail'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        }),
      ],
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should SEND a real email to Gmail', async () => {
    const email = 'nchihuy099@gmail.com'; // Email nhận thật
    const username = 'nchihuy099';

    // Nếu hàm này chạy không lỗi, mail sẽ được gửi thật
    await expect(service.sendResetPasswordEmail(email, username))
      .resolves.not.toThrow();

    console.log('Kiểm tra hòm thư của bạn ngay!');
  }, 30000); // Tăng timeout lên 30s vì gửi mail thật tốn thời gian mạng
});