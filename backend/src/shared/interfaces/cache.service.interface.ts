export interface CacheStats {
  totalKeys: number;
  usedMemory: string;
  hits: number;
  misses: number;
  hitRate: number;
}

export interface CacheService {
  set(key: string, value: string, ttl?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  ttl(key: string): Promise<number>;
  clear(): Promise<void>;
  getStats(): Promise<CacheStats>;
  isHealthy(): Promise<boolean>;
  increment(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;
}
