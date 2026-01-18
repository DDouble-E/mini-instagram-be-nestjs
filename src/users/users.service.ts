import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { S3Service } from 'src/media/s3.service';


@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        private prisma: PrismaService,
        private readonly s3Service: S3Service,
    ) { }

    async create(createUserDto: CreateUserDto) {
        this.logger.log(`Creating user with email: ${createUserDto.email}`);
        const { password, ...userData } = createUserDto;

        const existingUser = await this.findByEmailOrUsername(userData.email, userData.username);

        if (existingUser) {
            this.logger.warn(`User with email ${userData.email} or username ${userData.username} already exists`);
            throw new ConflictException(
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

    async changePassword(username: string, newPassword: string) {
        this.logger.log(`Changing password for username: ${username}`);

        const existingUser = await this.prisma.user.findUnique({
            where: { username: username }
        });

        if (!existingUser) {
            this.logger.warn(`User with username ${username} not found`);
            throw new NotFoundException('User not found');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { username: username },
            data: { password: hashedPassword }
        });
        this.logger.log(`Password changed successfully for username: ${username}`);
    }

    async findByEmailOrUsername(email: string, username: string) {
        this.logger.log(`Finding user by email: ${email} or username: ${username}`);
        return this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        })
    }


    async getUserProfile(userId: string) {
        this.logger.log(`Fetching profile for user ID: ${userId}`);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                biography: true,
                dateOfBirth: true,
                fullName: true,
                gender: true,
                phoneNumber: true,
                username: true,
                avatarUrl: true,
            }
        });

        if (!user) {
            this.logger.warn(`User with ID ${userId} not found`);
            throw new NotFoundException('User not found');
        }

        return {
            userId: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
            biography: user.biography,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
        }

    }

    async updateUserProfile(userId: string, updateData: Partial<CreateUserDto>) {
        this.logger.log(`Updating profile for user ID: ${userId}`);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            this.logger.warn(`User with ID ${userId} not found`);
            throw new NotFoundException('User not found');
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return {
            userId: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            biography: updatedUser.biography,
            dateOfBirth: updatedUser.dateOfBirth,
            gender: updatedUser.gender,
            phoneNumber: updatedUser.phoneNumber,
        }

    }

    async updateAvatarUrl(userId: string, avatarUrl: string) {
        this.logger.log(`Updating avatar URL for user ID: ${userId}`);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            this.logger.warn(`User with ID ${userId} not found`);
            throw new NotFoundException('User not found');
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: avatarUrl },
        });

    }

    async createAvatarUploadUrl(userId: string, contentType: string) {
        this.logger.log(`Creating avatar upload URL for user ID: ${userId}`);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            this.logger.warn(`User with ID ${userId} not found`);
            throw new NotFoundException('User not found');
        }

        const uploadUrl = this.s3Service.getPresignedUrl(userId, '', '', contentType, 'AVATAR');
        return { uploadUrl };
    }
}