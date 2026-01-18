import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { WebhookController } from './webhook.controller';
import { MediaController } from './media.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediaService } from './media.service';

@Module({
  imports: [PrismaModule],
  providers: [S3Service, MediaService],
  controllers: [WebhookController, MediaController],
  exports: [S3Service],
})
export class S3Module { }
