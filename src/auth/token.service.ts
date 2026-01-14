import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { TokensRepository } from "./tokens.repository";
import { JwtService } from "@nestjs/jwt";
import { Injectable, Logger, BadRequestException } from "@nestjs/common";


@Injectable()
export class TokenService {
    private readonly logger = new Logger(TokenService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly tokensRepository: TokensRepository,
        private readonly jwtService: JwtService,
    ) { }


    async generateTokens(userId: string) {
        this.logger.log(`Generating tokens for user ID: ${userId}`);
        const payload = { sub: userId };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_MINS') * 60, // convert mins to seconds
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_DAYS') * 24 * 60 * 60, // convert days to seconds
        });


        this.tokensRepository.createRefreshToken(userId, userId, refreshToken);
        this.logger.log('Refresh token saved successfully');


        return { accessToken, refreshToken };
    }

    async generateResetPasswordToken(userId: string, email: string, username: string) {
        this.logger.log(`Generating reset password token for user ID: ${userId}`);
        const payload = { email: email, username: username };
        const resetPasswordToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_RESET_PASSWORD_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_RESET_PASSWORD_EXPIRES_MINS') * 60, // convert mins to seconds
        });

        await this.tokensRepository.createResetPasswordToken(userId, userId, email, resetPasswordToken);
        this.logger.log('Reset password token saved successfully');
        return resetPasswordToken;
    }

    async decodeResetPasswordToken(token: string) {
        this.logger.log('Decoding reset password token');
        try {
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_RESET_PASSWORD_SECRET_KEY'),
            });
            return decoded;
        } catch (error) {
            throw new BadRequestException('Invalid reset password token');
        }
    }
}

