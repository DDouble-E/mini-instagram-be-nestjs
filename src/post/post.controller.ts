import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { PublishPostDto } from "./dto/publish-post.dto";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { PostService } from "./post.service";

@Controller('posts')
export class PostController {

    private readonly logger = new Logger(PostController.name);

    constructor(
        private readonly postService: PostService
    ) { }

    @Post('/publish/:containerId')
    async publishPost(
        @Param('containerId') containerId: string,
        @Body() publishPostDto: PublishPostDto,
        @GetUser() user: any
    ) {
        this.logger.log(`Publishing post with containerId: ${containerId}`);
        const { userId } = user;
        return this.postService.publish(containerId, userId, publishPostDto);
    }

    @Get('/:postId/detail')
    async getPostDetailById(@Param('postId') postId: string) {
        this.logger.log(`Getting post detail for postId: ${postId}`);
        return this.postService.getPostDetailById(postId);
    }

    @Get('/list')
    async getPostList(@GetUser() user: any) {
        this.logger.log(`Getting post list for userId: ${user.userId}`);
        return this.postService.getPostList(user.userId);
    }
}