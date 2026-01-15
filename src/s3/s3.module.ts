import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { WebhookController } from './webhook.controller';

@Module({
  providers: [S3Service],
  controllers: [WebhookController],
  exports: [S3Service],
})
export class S3Module { }
