import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { CacheService } from '@/shared/interfaces/cache.service.interface';

import {
  RATE_LIMIT_KEY,
  RateLimitOptions,
} from '../decorators/rate-limit.decorator';

interface UserPayload {
  id: string;
  email: string;
  sub: string;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    @Inject('CacheService') private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const key = this.generateKey(request);
    const limit = this.getLimit(context);
    const windowMs = this.getWindowMs(context);

    const current = await this.cacheService.increment(key);

    if (current === 1) {
      await this.cacheService.expire(key, Math.ceil(windowMs / 1000));
    }

    const remaining = Math.max(0, limit - current);
    const resetTime = Date.now() + windowMs;

    // Set rate limit headers
    response.setHeader('X-RateLimit-Limit', limit);
    response.setHeader('X-RateLimit-Remaining', remaining);
    response.setHeader('X-RateLimit-Reset', new Date(resetTime).toISOString());

    if (current > limit) {
      response.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private generateKey(request: any): string {
    const user = request.user as UserPayload;
    const identifier = user ? `user:${user.id}` : `ip:${request.ip}`;
    const endpoint = `${request.method}:${request.route?.path || request.url}`;

    return `rate_limit:${identifier}:${endpoint}`;
  }

  private getLimit(context: ExecutionContext): number {
    const rateLimitMeta = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    return (
      rateLimitMeta?.limit ||
      this.configService.get('rateLimit.default.limit', 100)
    );
  }

  private getWindowMs(context: ExecutionContext): number {
    const rateLimitMeta = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    return (
      rateLimitMeta?.windowMs ||
      this.configService.get('rateLimit.default.windowMs', 900000)
    ); // 15 minutes
  }
}
