import { Module } from '@nestjs/common';

import { CacheService } from '@/shared/infrastructure/cache/cache.service';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { ElasticsearchService } from '@/shared/infrastructure/elasticsearch/elasticsearch.service';
import { RabbitMQService } from '@/shared/infrastructure/queue/rabbitmq.service';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [
    HealthService,
    PrismaService,
    {
      provide: 'CacheService',
      useClass: CacheService,
    },
    RabbitMQService,
    ElasticsearchService,
  ],
  exports: [HealthService],
})
export class HealthModule {}
