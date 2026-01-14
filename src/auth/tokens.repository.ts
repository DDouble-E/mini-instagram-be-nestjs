import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TokensRepository {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService
    ) { }

    async createRefreshToken(token: string, userId: string, refreshToken: string) {
        await this.prismaService.refreshToken.create({
            data: {
                token: refreshToken,
                userId: userId,
                expiresAt: new Date(Date.now() + this.configService.get('JWT_REFRESH_EXPIRES_DAYS') * 24 * 60 * 60 * 1000),
            }
        });
    }

    async createResetPasswordToken(token: string, userId: string, email: string, resetPasswordToken: string) {
        await this.prismaService.passwordReset.create({
            data: {
                token: resetPasswordToken,
                email: email,
                userId: userId,
                expiresAt: new Date(Date.now() + this.configService.get('JWT_RESET_PASSWORD_EXPIRES_MINS') * 60 * 1000),
            }
        });
    }
}