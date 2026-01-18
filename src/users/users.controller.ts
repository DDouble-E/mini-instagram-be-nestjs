import { Controller, Get, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { PostService } from 'src/post/post.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('users')
export class UsersController {

  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly postService: PostService
  ) { }

  @Get('/me/posts')
  async getUserPosts(@GetUser() user: any) {
    this.logger.log(`Getting user's posts for userId: ${user.userId}`);
    return this.postService.getUserPosts(user.userId);
  }
}
