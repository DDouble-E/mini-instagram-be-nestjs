import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {

    private readonly logger = new Logger(WebhookController.name);
    constructor(
    ) { }

    @Post('image-processed')
    async handleImageProcessed(
        @Body() body: any,
        @Headers() headers: any,
    ) {
        this.logger.log('✅ WEBHOOK RECEIVED');
        this.logger.log('Headers:', headers);
        this.logger.log('Body:', body);

        // Ví dụ xử lý:
        // - update DB
        // - gắn ảnh vào post
        // - đổi status = DONE

        return {
            ok: true,
        };
    }
}
