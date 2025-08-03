/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';

import {
  CacheService as ICacheService,
  CacheStats,
} from '@/interfaces/cache.service.interface';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

@Injectable()
export class CacheService implements ICacheService {
  private readonly cache: Map<string, { value: string; expiresAt: number }> =
    new Map();
  private hits = 0;
  private misses = 0;

  /**
   * Set a value in the cache
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    const ttlValue = ttl || 3600; // Default 1 hour
    const expiresAt = Date.now() + ttlValue * 1000;

    this.cache.set(key, {
      value,
      expiresAt,
    });

    console.log(`Cache SET: ${key} (TTL: ${ttlValue}s)`);
  }

  /**
   * Get a value from the cache
   */
  async get(key: string): Promise<string | null> {
    const cached = this.cache.get(key);

    if (!cached) {
      console.log(`Cache MISS: ${key}`);
      this.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      console.log(`Cache EXPIRED: ${key}`);
      this.misses++;
      return null;
    }

    console.log(`Cache HIT: ${key}`);
    this.hits++;
    return cached.value;
  }

  /**
   * Delete a value from the cache
   */
  async del(key: string): Promise<void> {
    this.cache.delete(key);
    console.log(`Cache DEL: ${key}`);
  }

  /**
   * Check if a key exists in the cache
   */
  async exists(key: string): Promise<boolean> {
    const cached = this.cache.get(key);

    if (!cached) {
      return false;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get time to live for a key
   */
  async ttl(key: string): Promise<number> {
    const cached = this.cache.get(key);

    if (!cached) {
      return -2; // Key doesn't exist
    }

    const remaining = cached.expiresAt - Date.now();
    if (remaining <= 0) {
      this.cache.delete(key);
      return -2; // Key doesn't exist
    }

    return Math.floor(remaining / 1000); // Return seconds
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    console.log('Cache cleared');
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    // Clean up expired entries
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        this.cache.delete(key);
      }
    }

    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;

    return {
      totalKeys: this.cache.size,
      usedMemory: `${this.cache.size * 100}B`, // Mock value
      hits: this.hits,
      misses: this.misses,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }

  /**
   * Check if cache service is healthy
   */
  async isHealthy(): Promise<boolean> {
    return true; // Simple in-memory cache is always healthy
  }

  /**
   * Increment a numeric value in the cache
   */
  async increment(key: string): Promise<number> {
    const current = await this.get(key);
    const value = current ? parseInt(current, 10) + 1 : 1;
    await this.set(key, value.toString());
    return value;
  }

  /**
   * Set expiration time for a key
   */
  async expire(key: string, seconds: number): Promise<void> {
    const cached = this.cache.get(key);
    if (cached) {
      cached.expiresAt = Date.now() + seconds * 1000;
    }
  }
}
