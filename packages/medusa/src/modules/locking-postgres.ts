import PostgresLockingProvider from "/locking-postgres"

export * from "/locking-postgres"

export default PostgresLockingProvider
export const discoveryPath = require.resolve("/locking-postgres")
