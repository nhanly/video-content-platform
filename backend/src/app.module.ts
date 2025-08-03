import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import * as redisStore from 'cache-manager-redis-store';

import { PrismaService } from '@/database/prisma/prisma.service';
import { SearchModule } from '@/search/search.module';
import { HealthModule } from '@/shared/infrastructure/monitoring/health.module';
import { VideoModule } from '@/video/video.module';

import { AppController } from './app.controller';
import appConfig from './shared/config/app.config';
import queueConfig from './shared/config/queue.config';
import { validationSchema } from './shared/utils/validation.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.prod', '.env.dev', '.env'], // layered .env support
      validationSchema,
      load: [appConfig, queueConfig],
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      isGlobal: true,
    }),
    CqrsModule,
    VideoModule,
    SearchModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
