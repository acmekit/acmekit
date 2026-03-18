import EmailPassAuthProvider from "/auth-emailpass"

export * from "/auth-emailpass"

export default EmailPassAuthProvider
export const discoveryPath = require.resolve("/auth-emailpass")
