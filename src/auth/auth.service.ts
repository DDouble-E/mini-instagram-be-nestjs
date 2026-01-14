import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private readonly mailerService: MailerService,
    ) { }

    async generateTokens(userId: string) {
        this.logger.log(`Generating tokens for user ID: ${userId}`);
        const payload = { sub: userId };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_MINS'),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_DAYS'),
        });

        return { accessToken, refreshToken };
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

    async login(loginDto: LoginDto) {
        this.logger.log(`Login attempt for identifier: ${loginDto.identifier}`);
        const existingUser = await this.usersService.findByEmailOrUsername(
            loginDto.identifier,
            loginDto.identifier
        );


        if (!existingUser || !await bcrypt.compare(loginDto.password, existingUser.password)) {
            throw new UnauthorizedException('Email/username or password is incorrect');
        }

        const tokens = await this.generateTokens(existingUser.id);

        this.logger.log('Authentication successful, tokens generated');

        return {
            userId: existingUser.id,
            username: existingUser.username,
            ...tokens
        };


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
        const token = this.jwtService.sign({ email: existingUser.email, username: existingUser.username }, {
            secret: this.configService.get('JWT_RESET_PASSWORD_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_RESET_PASSWORD_EXPIRES_MINS'),
        });
        await this.sendResetPasswordEmail(existingUser.email, existingUser.username, token);
        this.logger.log('Reset password email sent successfully');
        return;
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        this.logger.log('Processing password reset');
        const { token, newPassword, confirmNewPassword } = resetPasswordDto;

        const decoded = await this.decodeResetPasswordToken(token);

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
