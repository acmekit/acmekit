import LocalFileProvider from "/file-local"

export * from "/file-local"

export default LocalFileProvider
export const discoveryPath = require.resolve("/file-local")
