import { Controller, Post, Body, Headers, Logger, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Controller('webhook')
export class WebhookController {

    private readonly logger = new Logger(WebhookController.name);
    constructor(
        private readonly configService: ConfigService
    ) { }

    @Post('image-processed')
    async handleImageProcessed(
        @Req() req: any,
        @Body() body: any,
        @Headers() headers: any,
    ) {
        this.logger.log('✅ WEBHOOK RECEIVED, Verifying...');
        const signature = headers['x-signature'];

        if (!signature) {
            this.logger.warn('Missing signature')
            throw new UnauthorizedException('Missing signature');
        }

        // 🔐 Verify HMAC
        const expectedSignature = crypto
            .createHmac('sha256', this.configService.getOrThrow('WEBHOOK_SECRET'))
            .update(JSON.stringify(body)) // String
            .digest('hex');

        if (signature !== expectedSignature) {
            this.logger.warn('Invalid signature')
            throw new UnauthorizedException('Invalid signature');
        }

        this.logger.log('Verified! Valid signature')

        // Ví dụ xử lý:
        // - update DB
        // - gắn ảnh vào post
        // - đổi status = DONE

        return 'Image Webhook verified and processed';
    }
}
