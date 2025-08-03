import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { HealthService, HealthStatus, SystemHealth } from './health.service';

@Controller('health')
@ApiTags('Health Check')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Get overall system health status' })
  @ApiResponse({
    status: 200,
    description: 'System is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['healthy', 'unhealthy', 'degraded'] },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'number' },
        version: { type: 'string' },
        services: {
          type: 'object',
          properties: {
            database: { $ref: '#/components/schemas/ServiceHealth' },
            cache: { $ref: '#/components/schemas/ServiceHealth' },
            search: { $ref: '#/components/schemas/ServiceHealth' },
          },
        },
        summary: {
          type: 'object',
          properties: {
            healthy: { type: 'number' },
            unhealthy: { type: 'number' },
            degraded: { type: 'number' },
            total: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 503, description: 'System is unhealthy' })
  @ApiResponse({ status: 206, description: 'System is degraded' })
  async getHealth(@Res() res: Response): Promise<void> {
    const health: SystemHealth = await this.healthService.getSystemHealth();

    let statusCode: number;
    switch (health.status) {
      case HealthStatus.HEALTHY:
        statusCode = HttpStatus.OK;
        break;
      case HealthStatus.DEGRADED:
        statusCode = HttpStatus.PARTIAL_CONTENT;
        break;
      case HealthStatus.UNHEALTHY:
        statusCode = HttpStatus.SERVICE_UNAVAILABLE;
        break;
      default:
        statusCode = HttpStatus.SERVICE_UNAVAILABLE;
    }

    res.status(statusCode).json(health);
  }

  @Get('ready')
  @ApiOperation({ summary: 'Check if application is ready to serve requests' })
  @ApiResponse({ status: 200, description: 'Application is ready' })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  async getReadiness(@Res() res: Response): Promise<void> {
    const isHealthy = await this.healthService.isHealthy();

    if (isHealthy) {
      res.status(HttpStatus.OK).json({
        status: 'ready',
        timestamp: new Date(),
        message: 'Application is ready to serve requests',
      });
    } else {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'not_ready',
        timestamp: new Date(),
        message: 'Application is not ready to serve requests',
      });
    }
  }

  @Get('database')
  @ApiOperation({ summary: 'Check database health' })
  @ApiResponse({ status: 200, description: 'Database is healthy' })
  @ApiResponse({ status: 503, description: 'Database is unhealthy' })
  async getDatabaseHealth(@Res() res: Response): Promise<void> {
    const health = await this.healthService.checkDatabaseHealth();

    const statusCode =
      health.status === HealthStatus.HEALTHY
        ? HttpStatus.OK
        : HttpStatus.SERVICE_UNAVAILABLE;

    res.status(statusCode).json(health);
  }

  @Get('cache')
  @ApiOperation({ summary: 'Check cache health' })
  @ApiResponse({ status: 200, description: 'Cache is healthy' })
  @ApiResponse({ status: 503, description: 'Cache is unhealthy' })
  async getCacheHealth(@Res() res: Response): Promise<void> {
    const health = await this.healthService.checkCacheHealth();

    const statusCode =
      health.status === HealthStatus.HEALTHY
        ? HttpStatus.OK
        : HttpStatus.SERVICE_UNAVAILABLE;

    res.status(statusCode).json(health);
  }

  @Get('search')
  @ApiOperation({ summary: 'Check search service health' })
  @ApiResponse({ status: 200, description: 'Search service is healthy' })
  @ApiResponse({ status: 503, description: 'Search service is unhealthy' })
  async getSearchHealth(@Res() res: Response): Promise<void> {
    const health = await this.healthService.checkSearchHealth();

    const statusCode =
      health.status === HealthStatus.HEALTHY
        ? HttpStatus.OK
        : HttpStatus.SERVICE_UNAVAILABLE;

    res.status(statusCode).json(health);
  }
}
