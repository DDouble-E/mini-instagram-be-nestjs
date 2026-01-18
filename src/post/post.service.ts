import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PublishPostDto } from "./dto/publish-post.dto";

@Injectable()
export class PostService {

    private readonly logger = new Logger(PostService.name);

    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async publish(containerId: string, userId: string, publishPostDto: PublishPostDto) {
        this.logger.log(`Publishing post with containerId: ${containerId}`);

        const post = await this.prismaService.post.create({
            data: {
                mediaContainerId: containerId,
                ownerId: userId,
                caption: publishPostDto.caption,
                locationText: publishPostDto.location?.text,
                locationLat: publishPostDto.location?.lat,
                locationLng: publishPostDto.location?.lng,
            },
        });

        return post.id;
    }
}