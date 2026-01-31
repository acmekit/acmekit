import RedisLockingProvider from "@acmekit/locking-redis"

export * from "@acmekit/locking-redis"

export default RedisLockingProvider
export const discoveryPath = require.resolve("@acmekit/locking-redis")
