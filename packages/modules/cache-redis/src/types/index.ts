import { RedisOptions } from "ioredis"

/**
 * Module config type
 */
export type RedisCacheModuleOptions = {
  /**
   * Time to keep data in cache (in seconds)
   */
  ttl?: number

  /**
   * Redis connection string
   */
  redisUrl?: string

  /**
   * Redis client options
   */
  redisOptions?: RedisOptions

  /**
   * Prefix for event keys
   * @default `acmekit:`
   */
  namespace?: string
}

declare module "@acmekit/types" {
  interface ModuleOptions {
    "@acmekit/cache-redis": RedisCacheModuleOptions
    "@acmekit/acmekit/cache-redis": RedisCacheModuleOptions
  }
}
