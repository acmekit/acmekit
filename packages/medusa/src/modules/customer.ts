import CustomerModule from "/customer"

export * from "/customer"

export default CustomerModule
export const discoveryPath = require.resolve("/customer")
