import { PrismaModule } from "src/prisma/prisma.module";
import { PostService } from "./post.service";
import { MediaController } from "src/media/media.controller";
import { PostController } from "./post.controller";
import { Module } from '@nestjs/common';

@Module({
    imports: [PrismaModule],
    providers: [PostService],
    controllers: [PostController],
    exports: [PostService],
})
export class PostModule { }