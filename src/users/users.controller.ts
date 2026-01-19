import { Body, Controller, Get, Logger, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { PostService } from 'src/post/post.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAvatarUploadUrlDto } from './dto/create-avatar-upload-url.dto';

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

  @Get('/me/details')
  async getUserProfile(@GetUser() user: any) {
    this.logger.log(`Getting profile for userId: ${user.userId}`);
    return this.usersService.getUserProfile(user.userId);
  }


  @Put('/me/update')
  async updateUserProfile(@GetUser() user: any, @Body() updateData: Partial<CreateUserDto>) {
    this.logger.log(`Updating profile for userId: ${user.userId}`);
    return this.usersService.updateUserProfile(user.userId, updateData);
  }

  @Post('/me/avatar/upload-url/create')
  async createAvatarUploadUrl(@GetUser() user: any, @Body() dto: CreateAvatarUploadUrlDto) {
    this.logger.log(`Creating avatar upload URL for userId: ${user.userId}`);
    return this.usersService.createAvatarUploadUrl(user.userId, dto.mediaContentType);
  }
}
