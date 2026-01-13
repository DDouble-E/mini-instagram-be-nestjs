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

@Module({
  imports: [
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
