import RedisWorkflowEngineModule from "/workflow-engine-redis"

export * from "/workflow-engine-redis"

export default RedisWorkflowEngineModule
export const discoveryPath = require.resolve("/workflow-engine-redis")
