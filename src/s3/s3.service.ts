import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
    private s3: S3Client;
    private readonly DEFAULT_EXPIRATION = 300; // 5 phút
    private readonly DEFAULT_FOLDER = 'original';
    private readonly bucket: string;
    private readonly region: string;

    constructor(private configService: ConfigService) {
        this.s3 = new S3Client({
            region: this.configService.get<string>('AWS_REGION')!,
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
            },
        });

        this.bucket = this.configService.getOrThrow('AWS_S3_BUCKET');
        this.region = this.configService.getOrThrow('AWS_REGION');
    }

    getPublicUrl(key: string): string {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }

    async getPresignedUrl(userId: string, contentType: string, fileName: string) {
        const key = `original/${userId}/${uuid()}-${fileName}`;
        const uploadUrl = await this.createPresignedUrl(key, contentType);
        return {
            uploadUrl,
            fileKey: key,
            fileUrl: this.getPublicUrl(key),
        };
    }

    async createPresignedUrl(
        key: string,
        contentType: string,
    ): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET'),
            Key: key,
            ContentType: contentType,
        });

        return getSignedUrl(this.s3, command, {
            expiresIn: 300, // 5 phút
        });
    }

}
