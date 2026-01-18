import { Injectable, Logger, NotFoundException } from "@nestjs/common";
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

        return {
            postId: post.id
        }
    }

    async getPostDetailById(postId: string) {
        this.logger.log(`Fetching post detail for postId: ${postId}`);


        const post = await this.prismaService.post.findUnique({
            where: { id: postId },
            include: {
                mediaContainer: {
                    include: {
                        mediaFiles: true,
                    }
                },
                owner: {
                    select: {
                        username: true,
                    }
                }
            }
        });

        if (!post) {
            this.logger.warn(`Post with id ${postId} not found`);
            return new NotFoundException(`Post with id ${postId} not found`);
        }

        return {
            postId: post.id,
            username: post.owner.username,
            caption: post.caption,
            locationText: post?.locationText,
            locationLat: post?.locationLat,
            locationLng: post?.locationLng,
            publishedAt: post.updatedAt,
            media: post.mediaContainer.mediaFiles.map(file => ({
                url: file.url,
                contentType: file.contentType,
            })),
        }
    }
}