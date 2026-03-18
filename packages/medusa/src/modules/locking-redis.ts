import RedisLockingProvider from "/locking-redis"

export * from "/locking-redis"

export default RedisLockingProvider
export const discoveryPath = require.resolve("/locking-redis")
