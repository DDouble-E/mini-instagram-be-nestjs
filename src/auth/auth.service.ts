import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokensRepository } from './tokens.repository';
import { TokenService } from './token.service';


@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly mailerService: MailerService,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,
    ) { }



    async login(loginDto: LoginDto) {
        this.logger.log(`Login attempt for identifier: ${loginDto.identifier}`);
        const existingUser = await this.usersService.findByEmailOrUsername(
            loginDto.identifier,
            loginDto.identifier
        );


        if (!existingUser || !await bcrypt.compare(loginDto.password, existingUser.password)) {
            throw new UnauthorizedException('Email/username or password is incorrect');
        }

        const tokens = await this.tokenService.generateTokens(existingUser.id);

        this.logger.log('Authentication successful, tokens generated');

        return {
            userId: existingUser.id,
            username: existingUser.username,
            ...tokens
        };


    }


    async refreshToken(refreshToken: string, userId: string) {
        this.logger.log('Refreshing tokens');

        await this.tokenService.revokeRefreshToken(refreshToken, userId);

        const tokens = await this.tokenService.generateTokens(userId);

        return tokens;
    }

    async logout(accessToken: string, refreshToken: string, userId: string, expUnix: number) {
        this.logger.log('Logging out user');

        await this.tokenService.revokeRefreshToken(refreshToken, userId);

        const expiryDate = new Date(expUnix * 1000);
        await this.tokenService.blacklistToken(accessToken, expiryDate);
        return;
    }

    async forgetPassword(identifier: string) {
        this.logger.log(`Processing forget password for identifier: ${identifier}`);
        const existingUser = await this.usersService.findByEmailOrUsername(
            identifier,
            identifier
        );

        if (!existingUser) {
            throw new NotFoundException('Email/username not found');
        }

        const token = await this.tokenService.generateResetPasswordToken(existingUser.id, existingUser.email, existingUser.username);

        await this.sendResetPasswordEmail(existingUser.email, existingUser.username, token);
        this.logger.log('Reset password email sent successfully');
        return;
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        this.logger.log('Processing password reset');
        const { token, newPassword, confirmNewPassword } = resetPasswordDto;

        const decoded = await this.tokenService.decodeResetPasswordToken(token);

        const username = decoded.username;
        if (newPassword !== confirmNewPassword) {
            throw new BadRequestException('New password and confirm new password do not match');
        }

        await this.usersService.changePassword(username, newPassword);
        this.logger.log(`Password reset successfully for username: ${username}`);
        return;
    }

    async sendResetPasswordEmail(email: string, username: string, token: string) {

        this.logger.log(`Sending reset password email to: ${email}`);
        await this.mailerService.sendMail({
            to: email,
            // from: 'Override Email <override@example.com>', // Có thể override default
            subject: '[Mini-Instagram] Đặt lại mật khẩu của bạn',
            template: './reset_pass', // Tên file template (không cần đuôi .hbs)
            context: { // Dữ liệu truyền vào template
                username,
                resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
                frontendUrl: process.env.FRONTEND_URL
            },
        });
    }
}
