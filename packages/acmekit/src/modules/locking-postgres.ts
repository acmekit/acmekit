import PostgresLockingProvider from "@acmekit/locking-postgres"

export * from "@acmekit/locking-postgres"

export default PostgresLockingProvider
export const discoveryPath = require.resolve("@acmekit/locking-postgres")
