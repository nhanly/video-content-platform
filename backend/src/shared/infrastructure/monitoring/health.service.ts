import { Inject, Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { ElasticsearchService } from '@/shared/infrastructure/elasticsearch/elasticsearch.service';
import { RabbitMQService } from '@/shared/infrastructure/queue/rabbitmq.service';
import { CacheService } from '@/shared/interfaces/cache.service.interface';

export enum HealthStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
  DEGRADED = 'degraded',
}

export interface ServiceHealth {
  status: HealthStatus;
  message?: string;
  responseTime?: number;
  details?: Record<string, any>;
}

export interface SystemHealth {
  status: HealthStatus;
  timestamp: Date;
  uptime: number;
  version: string;
  services: {
    database: ServiceHealth;
    cache: ServiceHealth;
    search: ServiceHealth;
  };
  summary: {
    healthy: number;
    unhealthy: number;
    degraded: number;
    total: number;
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(
    private readonly prismaService: PrismaService,
    @Inject('CacheService') private readonly cacheService: CacheService,
    private readonly queueService: RabbitMQService,
    private readonly searchService: ElasticsearchService,
  ) {}

  async getSystemHealth(): Promise<SystemHealth> {
    const services = await this.checkAllServices();
    const summary = this.calculateSummary(services);
    const overallStatus = this.determineOverallStatus(summary);

    return {
      status: overallStatus,
      timestamp: new Date(),
      uptime: Date.now() - this.startTime,
      version: process.env.npm_package_version || '1.0.0',
      services,
      summary,
    };
  }

  async checkDatabaseHealth(): Promise<ServiceHealth> {
    const startTime = Date.now();

    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      if (responseTime > 5000) {
        return {
          status: HealthStatus.DEGRADED,
          message: 'Database responding slowly',
          responseTime,
        };
      }

      return {
        status: HealthStatus.HEALTHY,
        message: 'Database connection is healthy',
        responseTime,
      };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return {
        status: HealthStatus.UNHEALTHY,
        message: `Database connection failed: ${(error as Error).message}`,
        responseTime: Date.now() - startTime,
      };
    }
  }

  async checkCacheHealth(): Promise<ServiceHealth> {
    const startTime = Date.now();
    const testKey = 'health_check_' + Date.now();
    const testValue = 'ping';

    try {
      await this.cacheService.set(testKey, testValue, 60);
      const retrieved = await this.cacheService.get(testKey);
      await this.cacheService.del(testKey);

      const responseTime = Date.now() - startTime;

      if (retrieved !== testValue) {
        return {
          status: HealthStatus.UNHEALTHY,
          message: 'Cache set/get verification failed',
          responseTime,
        };
      }

      if (responseTime > 1000) {
        return {
          status: HealthStatus.DEGRADED,
          message: 'Cache responding slowly',
          responseTime,
        };
      }

      const stats = await this.cacheService.getStats();

      return {
        status: HealthStatus.HEALTHY,
        message: 'Cache is healthy',
        responseTime,
        details: {
          totalKeys: stats.totalKeys,
          hitRate: stats.hitRate,
          usedMemory: stats.usedMemory,
        },
      };
    } catch (error) {
      this.logger.error('Cache health check failed:', error);
      return {
        status: HealthStatus.UNHEALTHY,
        message: `Cache connection failed: ${(error as Error).message}`,
        responseTime: Date.now() - startTime,
      };
    }
  }

  async checkSearchHealth(): Promise<ServiceHealth> {
    const startTime = Date.now();

    try {
      // Check if client can ping Elasticsearch
      await this.searchService['client'].ping();
      const responseTime = Date.now() - startTime;

      if (responseTime > 3000) {
        return {
          status: HealthStatus.DEGRADED,
          message: 'Search service responding slowly',
          responseTime,
        };
      }

      return {
        status: HealthStatus.HEALTHY,
        message: 'Search service is healthy',
        responseTime,
      };
    } catch (error) {
      this.logger.error('Search health check failed:', error);
      return {
        status: HealthStatus.UNHEALTHY,
        message: `Search service failed: ${(error as Error).message}`,
        responseTime: Date.now() - startTime,
      };
    }
  }

  private async checkAllServices() {
    const [database, cache, search] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkCacheHealth(),
      this.checkSearchHealth(),
    ]);

    return { database, cache, search };
  }

  private calculateSummary(services: Record<string, ServiceHealth>) {
    const statuses = Object.values(services).map((service) => service.status);

    return {
      healthy: statuses.filter((status) => status === HealthStatus.HEALTHY)
        .length,
      unhealthy: statuses.filter((status) => status === HealthStatus.UNHEALTHY)
        .length,
      degraded: statuses.filter((status) => status === HealthStatus.DEGRADED)
        .length,
      total: statuses.length,
    };
  }

  private determineOverallStatus(summary: {
    healthy: number;
    unhealthy: number;
    degraded: number;
    total: number;
  }): HealthStatus {
    if (summary.unhealthy > 0) {
      return HealthStatus.UNHEALTHY;
    }

    if (summary.degraded > 0) {
      return HealthStatus.DEGRADED;
    }

    return HealthStatus.HEALTHY;
  }

  async isHealthy(): Promise<boolean> {
    const health = await this.getSystemHealth();
    return health.status === HealthStatus.HEALTHY;
  }
}
