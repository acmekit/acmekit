import RedisCacheModule from "/cache-redis"

export * from "/cache-redis"

export default RedisCacheModule
export const discoveryPath = require.resolve("/cache-redis")
