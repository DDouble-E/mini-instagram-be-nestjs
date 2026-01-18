import { Body, Controller, Logger, Post } from "@nestjs/common";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { CreateContainerDto } from "./dto/create-container.dto";
import { MediaService } from "./media.service";

@Controller('media')
export class MediaController {

    constructor(
        private readonly mediaService: MediaService
    ) { }

    private readonly logger = new Logger(MediaController.name);

    @Post('/media/containers/create')
    async createContainer(@GetUser() user: any, @Body() createContainerDto: CreateContainerDto) {
        this.logger.log('Create media container...');
        const { userId } = user;
        const { mediaContentType } = createContainerDto;

        return this.mediaService.createMediaContainer(userId, mediaContentType);

    }
}
