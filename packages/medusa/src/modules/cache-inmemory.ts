import InMemoryCacheModule from "/cache-inmemory"

export * from "/cache-inmemory"

export default InMemoryCacheModule
export const discoveryPath = require.resolve("/cache-inmemory")
