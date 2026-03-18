import {
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "/framework/types"

export const FileProviderIdentifierRegistrationName =
  "file_providers_identifier"

export const FileProviderRegistrationPrefix = "fs_"

export type FileModuleOptions = Partial<ModuleServiceInitializeOptions> & {
  /**
   * Providers to be registered
   */
  provider?: {
    /**
     * The module provider to be registered
     */
    resolve: string | ModuleProviderExports
    /**
     * The id of the provider
     */
    id: string
    /**
     * key value pair of the configuration to be passed to the provider constructor
     */
    options?: Record<string, unknown>
  }
}

declare module "/types" {
  interface ModuleOptions {
    "/file": FileModuleOptions
    "/medusa/file": FileModuleOptions
  }
}
