import GithubAuthProvider from "/auth-github"

export * from "/auth-github"

export default GithubAuthProvider
export const discoveryPath = require.resolve("/auth-github")
