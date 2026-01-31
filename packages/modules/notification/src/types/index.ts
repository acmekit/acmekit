import {
  Logger,
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@acmekit/framework/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export const NotificationIdentifiersRegistrationName =
  "notification_providers_identifier"

export const NotificationProviderRegistrationPrefix = "np_"

export type NotificationModuleOptions =
  Partial<ModuleServiceInitializeOptions> & {
    /**
     * Providers to be registered
     */
    providers?: {
      /**
       * The module provider to be registered
       */
      resolve: string | ModuleProviderExports
      /**
       * The id of the provider
       */
      id: string
      /**
       * key value pair of the configuration to be passed to the provider constructor, plus the channels supported by the provider
       */
      options?: Record<string, unknown> & { channels: string[] }
    }[]
    /**
     * Options for the default AcmeKit Cloud Email provider
     * @private
     */
    cloud?: AcmeKitCloudEmailOptions
  }

export type AcmeKitCloudEmailOptions = {
  api_key: string
  endpoint: string
  environment_handle?: string
  sandbox_handle?: string
}

declare module "@acmekit/types" {
  interface ModuleOptions {
    "@acmekit/notification": NotificationModuleOptions
    "@acmekit/acmekit/notification": NotificationModuleOptions
  }
}
