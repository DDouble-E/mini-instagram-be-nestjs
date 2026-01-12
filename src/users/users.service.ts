import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        this.logger.log(`Creating user with email: ${createUserDto.email}`);
        const { password, ...userData } = createUserDto;

        const existingUser = await this.findByEmailOrUsername(userData.email, userData.username);

        if (existingUser) {
            this.logger.warn(`User with email ${userData.email} or username ${userData.username} already exists`);
            throw new BadRequestException(
                'User with this email or username already exists',
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
            }
        })

        this.logger.log(`User created with ID: ${newUser.id}`);

        return newUser;
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
