import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async generateTokens(userId: string) {
        this.logger.log(`Generating tokens for user ID: ${userId}`);
        const payload = { sub: userId };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_MINS'),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_DAYS'),
        });

        return { accessToken, refreshToken };
    }

    async login(loginDto: LoginDto) {
        const existingUser = await this.usersService.findByEmailOrUsername(
            loginDto.identifier,
            loginDto.identifier
        );

        if (!existingUser) {
            throw new BadRequestException('Email/username or password is incorrect');
        }


    }
}
