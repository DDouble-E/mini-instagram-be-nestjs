import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
    ) { }

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
