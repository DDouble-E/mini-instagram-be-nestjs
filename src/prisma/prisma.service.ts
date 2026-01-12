import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    async onModuleInit() {
        console.log('🔌 Prisma connecting...');
        await this.$connect();
        console.log('✅ Prisma connected!');
    }

    async onModuleDestroy() {
        console.log('🧹 Prisma disconnecting...');
        await this.$disconnect();
    }
}