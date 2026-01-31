/**
 * Shape of a record saved in `in-memory`  cache
 */
export type CacheRecord<T> = {
  data: T
  /**
   * Timestamp in milliseconds
   */
  expire: number
}

export type InMemoryCacheModuleOptions = {
  /**
   * Time to keep data in cache (in seconds)
   */
  ttl?: number
}

declare module "@acmekit/types" {
  interface ModuleOptions {
    "@acmekit/cache-inmemory": InMemoryCacheModuleOptions
    "@acmekit/acmekit/cache-inmemory": InMemoryCacheModuleOptions
  }
}
