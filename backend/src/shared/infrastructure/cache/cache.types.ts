export interface CacheStats {
  totalKeys: number;
  usedMemory: string;
  hits: number;
  misses: number;
  hitRate: number;
}

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  retryAttempts: number;
  retryDelay: number;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
  keepAlive?: boolean;
  family?: number;
  keyPrefix?: string;
}
