import { Controller, Post, Body, Headers, Logger, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('webhook')
export class WebhookController {

    private readonly logger = new Logger(WebhookController.name);
    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
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

        const { userId, containerId, mediaFileId, images: { original } } = body;
        this.logger.log(`Processing mediaFileId: ${mediaFileId} for userId: ${userId}`);
        await this.prismaService.mediaFile.update({
            where: { id: mediaFileId },
            data: {
                url: original,
                status: 'READY',
            }
        });

        return 'Image Webhook verified and processed';
    }
}
