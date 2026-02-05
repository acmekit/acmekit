import { Link } from "@acmekit/modules-sdk"
import {
  ConfigModule,
  IAnalyticsModuleService,
  IApiKeyModuleService,
  IAuthModuleService,
  ICacheService,
  ICachingModuleService,
  IEventBusModuleService,
  IFileModuleService,
  IIndexService,
  ILockingModule,
  INotificationModuleService,
  IRbacModuleService,
  ISettingsModuleService,
  ITranslationModuleService,
  IUserModuleService,
  IWorkflowEngineService,
  Logger,
  ModuleImplementations,
  RemoteQueryFunction,
} from "@acmekit/types"
import { ContainerRegistrationKeys, Modules } from "@acmekit/utils"
import { AwilixContainer, ResolveOptions } from "../deps/awilix"
import { Knex } from "../deps/mikro-orm-knex"

declare module "@acmekit/types" {
  export interface ModuleImplementations {
    /**
     * @deprecated use {@link ContainerRegistrationKeys.LINK} instead.
     */
    [ContainerRegistrationKeys.REMOTE_LINK]: Link
    /**
     * @since 2.2.0
     */
    [ContainerRegistrationKeys.LINK]: Link
    [ContainerRegistrationKeys.CONFIG_MODULE]: ConfigModule
    [ContainerRegistrationKeys.PG_CONNECTION]: Knex<any>
    [ContainerRegistrationKeys.REMOTE_QUERY]: RemoteQueryFunction
    [ContainerRegistrationKeys.QUERY]: Omit<RemoteQueryFunction, symbol>
    [ContainerRegistrationKeys.LOGGER]: Logger
    [Modules.ANALYTICS]: IAnalyticsModuleService
    [Modules.AUTH]: IAuthModuleService
    [Modules.CACHE]: ICacheService
    [Modules.EVENT_BUS]: IEventBusModuleService
    [Modules.USER]: IUserModuleService
    [Modules.WORKFLOW_ENGINE]: IWorkflowEngineService
    [Modules.API_KEY]: IApiKeyModuleService
    [Modules.FILE]: IFileModuleService
    [Modules.NOTIFICATION]: INotificationModuleService
    [Modules.LOCKING]: ILockingModule
    [Modules.SETTINGS]: ISettingsModuleService
    [Modules.CACHING]: ICachingModuleService
    [Modules.INDEX]: IIndexService
    [Modules.TRANSLATION]: ITranslationModuleService
    [Modules.RBAC]: IRbacModuleService
  }
}

export type AcmeKitContainer<Cradle extends object = ModuleImplementations> =
  Omit<AwilixContainer, "resolve"> & {
    resolve<K extends keyof Cradle>(
      key: K,
      resolveOptions?: ResolveOptions
    ): Cradle[K]
    resolve<T>(key: string, resolveOptions?: ResolveOptions): T

    /**
     * @ignore
     */
    registerAdd: <T>(name: string, registration: T) => AcmeKitContainer
    /**
     * @ignore
     */
    createScope: () => AcmeKitContainer
  }

export type ContainerLike = {
  resolve<T = unknown>(key: string): T
}
