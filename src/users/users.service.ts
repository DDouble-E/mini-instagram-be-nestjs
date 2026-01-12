import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {

        const { password, ...userData } = createUserDto;

        const user = await this.findByEmailOrUsername(userData.email, userData.username);

        if (user) {
            throw new BadRequestException(
                'User with this email or username already exists',
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
            }
        })
    }

    async findByEmailOrUsername(email: string, username: string) {
        return this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        })
    }

}
