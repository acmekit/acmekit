import { RedisOptions } from "ioredis"
export interface RedisCacheModuleOptions extends RedisOptions {
  /**
   * Redis connection string
   */
  redisUrl?: string
  /**
   * TTL in milliseconds
   */
  ttl?: number
  /**
   * Key prefix for all cache keys
   */
  prefix?: string
  /**
   * Minimum size in bytes to compress data (default: 1024)
   */
  compressionThreshold?: number
}
