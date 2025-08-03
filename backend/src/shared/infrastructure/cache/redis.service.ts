import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

import { CacheService, CacheStats } from '@/interfaces/cache.service.interface';
import { CacheConfig } from '@/shared/infrastructure/cache/cache.types';

@Injectable()
export class RedisService
  implements CacheService, OnModuleInit, OnModuleDestroy
{
  private client: Redis;
  private cacheHits = 0;
  private cacheMisses = 0;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisConfig = this.configService.get<CacheConfig>('redis');
    if (!redisConfig) {
      throw new Error('Redis configuration not found');
    }

    const options: RedisOptions = {
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      db: redisConfig.db,
      retryStrategy: (times) => {
        if (times > redisConfig.retryAttempts) {
          return null; // Stop retrying
        }
        return Math.min(times * redisConfig.retryDelay, 2000);
      },
      maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
      lazyConnect: redisConfig.lazyConnect,
      keepAlive: redisConfig.keepAlive ? 30000 : 0,
      family: redisConfig.family,
      keyPrefix: redisConfig.keyPrefix,
    };

    this.client = new Redis(options);

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    try {
      const data = await this.client.get(key);
      if (data) {
        this.cacheHits++;
        return data;
      }
      this.cacheMisses++;
      return null;
    } catch (error) {
      this.cacheMisses++;
      console.error(`Error getting key ${key} from cache:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error(`Error setting key ${key} in cache:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Error deleting key ${key} from cache:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Error checking existence of key ${key}:`, error);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error(`Error getting TTL for key ${key}:`, error);
      return -1;
    }
  }

  async invalidateByPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error(`Error invalidating keys with pattern ${pattern}:`, error);
    }
  }

  async getStats(): Promise<CacheStats> {
    try {
      const info = await this.client.info('memory');
      const keyspace = await this.client.info('keyspace');

      // Parse memory info
      const memoryMatch = RegExp(/used_memory_human:([^\r\n]+)/).exec(info);
      const usedMemory = memoryMatch ? memoryMatch[1].trim() : '0B';

      // Parse keyspace info to get total keys
      const keyspaceMatch = RegExp(/keys=(\d+)/).exec(keyspace);
      const totalKeys = keyspaceMatch ? parseInt(keyspaceMatch[1], 10) : 0;

      return {
        totalKeys,
        usedMemory,
        hits: this.cacheHits,
        misses: this.cacheMisses,
        hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses || 1),
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        totalKeys: 0,
        usedMemory: '0B',
        hits: this.cacheHits,
        misses: this.cacheMisses,
        hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses || 1),
      };
    }
  }

  async clear(): Promise<void> {
    await this.client.flushall();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }

  async increment(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error(`Error incrementing key ${key}:`, error);
      return 0;
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    try {
      await this.client.expire(key, seconds);
    } catch (error) {
      console.error(`Error setting expiration for key ${key}:`, error);
    }
  }
}
