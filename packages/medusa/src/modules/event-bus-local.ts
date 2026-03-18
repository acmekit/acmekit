import LocalEventBusModule from "/event-bus-local"

export * from "/event-bus-local"
export default LocalEventBusModule
export const discoveryPath = require.resolve("/event-bus-local")
