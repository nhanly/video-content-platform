import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { S3Service } from '@/shared/infrastructure/aws/s3.service';
import { CacheService } from '@/shared/infrastructure/cache/cache.service';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { QueueService } from '@/shared/infrastructure/queue/queue.service';

import { VideoUploadedHandler } from './application/handlers/video-upload.handler';
import { StreamingService } from './application/services/streaming.service';
import { VideoService } from './application/services/video.service';
import { VideoUploadingService } from './application/services/video-uploading.service';
import { GetVideoUseCase } from './application/use-cases/get-video.use-case';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case';
import { ListVideosUseCase } from './application/use-cases/list-videos.use-case';
import { UploadVideoUseCase } from './application/use-cases/upload-video.use-case';
import { CategoryPrismaRepository } from './infrastructure/repositories/category-prisma.repository';
import { PrismaVideoRepository } from './infrastructure/repositories/video-prisma-repository';
import { VideoProcessingWorker } from './infrastructure/workers/video-processing.worker';
import { CategoryController } from './presentation/controllers/category.controller';
import { StreamingController } from './presentation/controllers/streaming.controller';
import { VideoController } from './presentation/controllers/video.controller';

@Module({
  imports: [CqrsModule],
  controllers: [VideoController, StreamingController, CategoryController],
  providers: [
    UploadVideoUseCase,
    GetVideoUseCase,
    ListVideosUseCase,
    ListCategoriesUseCase,
    VideoService,
    StreamingService,
    VideoUploadingService,
    QueueService,
    S3Service,
    PrismaService,
    {
      provide: 'CacheService',
      useClass: CacheService,
    },
    {
      provide: 'IVideoRepository',
      useClass: PrismaVideoRepository,
    },
    {
      provide: 'ICategoryRepository',
      useClass: CategoryPrismaRepository,
    },
    VideoUploadedHandler,
    VideoProcessingWorker,
  ],
  exports: [
    UploadVideoUseCase,
    VideoService,
    'IVideoRepository',
    'ICategoryRepository',
  ],
})
export class VideoModule {}
