import MemoryWorkflowEngineModule from "/workflow-engine-inmemory"

export * from "/workflow-engine-inmemory"

export default MemoryWorkflowEngineModule
export const discoveryPath = require.resolve(
  "/workflow-engine-inmemory"
)
