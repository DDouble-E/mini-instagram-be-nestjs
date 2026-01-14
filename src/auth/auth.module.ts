import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path/win32';
import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // true cho port 465, false cho các port khác
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      // Cấu hình mặc định
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      // Cấu hình Template (Handlebars)
      template: {
        dir: join(__dirname, '..', 'mail'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },

    }),
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET_KEY'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRES_MINS') as StringValue,
        },
      })
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard
    }
  ],
})
export class AuthModule { }
