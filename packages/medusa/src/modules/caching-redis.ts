import RedisCachingProvider from "/caching-redis"

export * from "/caching-redis"

export default RedisCachingProvider
export const discoveryPath = require.resolve("/caching-redis")
