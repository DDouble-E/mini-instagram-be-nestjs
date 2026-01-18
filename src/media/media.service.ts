import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { S3Service } from "./s3.service";
import { v4 as uuidV4 } from 'uuid';
import { UPLOAD_TYPE } from "src/common/constants/upload-type";


@Injectable()
export class MediaService {

    private readonly logger = new Logger(MediaService.name);
    private readonly mediaContainerExpirationMins: number; // 60 minutes

    constructor(
        private readonly s3Service: S3Service,
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService
    ) {
        this.mediaContainerExpirationMins = this.configService.getOrThrow<number>('MEDIA_CONTAINER_EXPIRATION_MINS');
    }

    async createMediaContainer(userId: string, mediaContentType: string) {
        // Logic to create a media container
        this.logger.log('Creating media container...');

        const container = await this.prismaService.mediaContainer.create({
            data: {
                ownerId: userId,
                expiresAt: new Date(Date.now() + this.mediaContainerExpirationMins * 60000) // current time + expiration mins
            }
        })

        const mediaFile = await this.prismaService.mediaFile.create({
            data: {
                containerId: container.id,
                contentType: mediaContentType,
                mediaType: 'IMAGE',
            }
        })
        const mediaFileId = mediaFile.id;


        const uploadUrl = await this.s3Service.getPresignedUrl(userId, container.id, mediaFileId, mediaContentType, UPLOAD_TYPE.POST);

        return {
            containerId: container.id,
            uploadUrl
        };
    }
}