import RedisEventBusModule from "/event-bus-redis"

export * from "/event-bus-redis"

export default RedisEventBusModule
export const discoveryPath = require.resolve("/event-bus-redis")
