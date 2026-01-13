import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';

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

    async login(loginDto: LoginDto) {
        this.logger.log(`Login attempt for identifier: ${loginDto.identifier}`);
        const existingUser = await this.usersService.findByEmailOrUsername(
            loginDto.identifier,
            loginDto.identifier
        );


        if (!existingUser) {
            throw new BadRequestException('Email/username or password is incorrect');
        }


        const tokens = await this.generateTokens(existingUser.id);

        this.logger.log('Authentication successful, tokens generated');

        return {
            userId: existingUser.id,
            username: existingUser.username,
            ...tokens
        };


    }

    async sendResetPasswordEmail(email: string, username: string) {
        const token = this.jwtService.sign({ email, username }, {
            secret: this.configService.get('JWT_RESET_PASSWORD_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_RESET_PASSWORD_EXPIRES_MINS'),
        });
        this.logger.log(`Sending reset password email to: ${email} with token: ${token}`);
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
