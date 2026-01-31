import {
  AcmeKitApp,
  AcmeKitAppGetLinksExecutionPlanner,
  AcmeKitAppMigrateDown,
  AcmeKitAppMigrateGenerate,
  AcmeKitAppMigrateUp,
  AcmeKitAppOutput,
  AcmeKitModule,
  ModulesDefinition,
  RegisterModuleJoinerConfig,
} from "@acmekit/modules-sdk"
import {
  CommonTypes,
  ConfigModule,
  ILinkMigrationsPlanner,
  IModuleService,
  InternalModuleDeclaration,
  LoadedModule,
  ModuleDefinition,
  ModuleServiceInitializeOptions,
} from "@acmekit/types"
import {
  ContainerRegistrationKeys,
  isBoolean,
  isObject,
  isPresent,
  upperCaseFirst,
} from "@acmekit/utils"

import type { Knex } from "@acmekit/framework/mikro-orm/knex"
import { aliasTo, asValue } from "./deps/awilix"
import { configManager } from "./config"
import {
  container,
  container as mainContainer,
  AcmeKitContainer,
} from "./container"

export class AcmeKitAppLoader {
  /**
   * Container from where to resolve resources
   * @private
   */
  readonly #container: AcmeKitContainer

  /**
   * Extra links modules config which should be added manually to the links to be loaded
   * @private
   */
  readonly #customLinksModules:
    | RegisterModuleJoinerConfig
    | RegisterModuleJoinerConfig[]

  readonly #acmekitConfigPath?: string
  readonly #cwd?: string

  // TODO: Adjust all loaders to accept an optional container such that in test env it is possible if needed to provide a specific container otherwise use the main container
  // Maybe also adjust the different places to resolve the config from the container instead of the configManager for the same reason
  // To be discussed
  constructor({
    container,
    customLinksModules,
    acmekitConfigPath,
    cwd,
  }: {
    container?: AcmeKitContainer
    customLinksModules?:
      | RegisterModuleJoinerConfig
      | RegisterModuleJoinerConfig[]
    acmekitConfigPath?: string
    cwd?: string
  } = {}) {
    this.#container = container ?? mainContainer
    this.#customLinksModules = customLinksModules ?? []
    this.#acmekitConfigPath = acmekitConfigPath
    this.#cwd = cwd
  }

  protected mergeDefaultModules(
    modulesConfig: CommonTypes.ConfigModule["modules"]
  ) {
    const defaultModules = Object.values(ModulesDefinition).filter(
      (definition: ModuleDefinition) => {
        return !!definition.defaultPackage
      }
    )

    const configModules = { ...modulesConfig }

    for (const defaultModule of defaultModules as ModuleDefinition[]) {
      configModules[defaultModule.key] ??=
        defaultModule.defaultModuleDeclaration
    }

    for (const [key, value] of Object.entries(
      configModules as Record<string, InternalModuleDeclaration>
    )) {
      const def = {} as ModuleDefinition
      def.key ??= key
      def.label ??= ModulesDefinition[key]?.label ?? upperCaseFirst(key)
      def.dependencies ??= ModulesDefinition[key]?.dependencies
      def.isQueryable = ModulesDefinition[key]?.isQueryable ?? true

      const orignalDef = value?.definition ?? ModulesDefinition[key]
      if (
        !isBoolean(value) &&
        (isObject(orignalDef) || !isPresent(value.definition))
      ) {
        value.definition = {
          ...def,
          ...orignalDef,
        }
      }
    }

    return configModules
  }

  protected prepareSharedResourcesAndDeps() {
    const injectedDependencies = {
      [ContainerRegistrationKeys.PG_CONNECTION]: this.#container.resolve<
        Knex<any>
      >(ContainerRegistrationKeys.PG_CONNECTION),
      [ContainerRegistrationKeys.LOGGER]: this.#container.resolve(
        ContainerRegistrationKeys.LOGGER
      ),
    }

    const driverOptions = {
      ...(configManager.config.projectConfig.databaseDriverOptions ?? {}),
    }
    const pool = (driverOptions.pool as Record<string, unknown>) ?? {}
    delete driverOptions.pool

    const sharedResourcesConfig: ModuleServiceInitializeOptions = {
      database: {
        clientUrl:
          injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION]?.client
            ?.config?.connection?.connectionString ??
          configManager.config.projectConfig.databaseUrl,
        driverOptions: configManager.config.projectConfig.databaseDriverOptions,
        pool: pool,
        debug: configManager.config.projectConfig.databaseLogging ?? false,
        schema: configManager.config.projectConfig.databaseSchema,
        database: configManager.config.projectConfig.databaseName,
      },
    }

    return { sharedResourcesConfig, injectedDependencies }
  }

  /**
   * Run, Revert or Generate the migrations for the acmekit app.
   *
   * @param moduleNames
   * @param linkModules
   * @param action
   */
  async runModulesMigrations(
    options:
      | {
          action: "run"
          allOrNothing?: boolean
        }
      | {
          action: "revert" | "generate"
          moduleNames: string[]
          allOrNothing?: never
        } = {
      action: "run",
    }
  ): Promise<void> {
    const configModules = this.mergeDefaultModules(configManager.config.modules)

    const { sharedResourcesConfig, injectedDependencies } =
      this.prepareSharedResourcesAndDeps()

    const migrationOptions = {
      modulesConfig: configModules,
      sharedContainer: this.#container,
      linkModules: this.#customLinksModules,
      sharedResourcesConfig,
      injectedDependencies,
      acmekitConfigPath: this.#acmekitConfigPath,
      cwd: this.#cwd,
      allOrNothing: options.allOrNothing,
    }

    if (options.action === "revert") {
      await AcmeKitAppMigrateDown(options.moduleNames!, migrationOptions)
    } else if (options.action === "run") {
      await AcmeKitAppMigrateUp(migrationOptions)
    } else if (options.action === "generate") {
      await AcmeKitAppMigrateGenerate(options.moduleNames!, migrationOptions)
    }
  }

  /**
   * Return an instance of the link module migration planner.
   */
  async getLinksExecutionPlanner(): Promise<ILinkMigrationsPlanner> {
    const configModules = this.mergeDefaultModules(configManager.config.modules)
    const { sharedResourcesConfig, injectedDependencies } =
      this.prepareSharedResourcesAndDeps()

    const migrationOptions = {
      modulesConfig: configModules,
      sharedContainer: this.#container,
      linkModules: this.#customLinksModules,
      sharedResourcesConfig,
      injectedDependencies,
      acmekitConfigPath: this.#acmekitConfigPath,
      cwd: this.#cwd,
    }

    return await AcmeKitAppGetLinksExecutionPlanner(migrationOptions)
  }

  /**
   * Run the modules loader without taking care of anything else. This is useful for running the loader as a separate action or to re run all modules loaders.
   */
  async runModulesLoader(): Promise<void> {
    const { sharedResourcesConfig, injectedDependencies } =
      this.prepareSharedResourcesAndDeps()
    const configModules = this.mergeDefaultModules(configManager.config.modules)

    await AcmeKitApp({
      modulesConfig: configModules,
      sharedContainer: this.#container,
      linkModules: this.#customLinksModules,
      sharedResourcesConfig,
      injectedDependencies,
      loaderOnly: true,
      acmekitConfigPath: this.#acmekitConfigPath,
      cwd: this.#cwd,
    })
  }

  /**
   * Reload a single module by its key
   * @param moduleKey - The key of the module to reload (e.g., 'contactUsModuleService')
   */
  async reloadSingleModule({
    moduleKey,
    serviceName,
  }: {
    /**
     * the key of the module to reload in the acmekit config (either infered or specified)
     */
    moduleKey: string
    /**
     * Registration name of the service to reload in the container
     */
    serviceName: string
  }): Promise<LoadedModule | null> {
    const configModule: ConfigModule = this.#container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )
    AcmeKitModule.unregisterModuleResolution(moduleKey)
    if (serviceName) {
      this.#container.cache.delete(serviceName)
    }

    const moduleConfig = configModule.modules?.[moduleKey]
    if (!moduleConfig) {
      return null
    }

    const { sharedResourcesConfig, injectedDependencies } =
      this.prepareSharedResourcesAndDeps()

    const mergedModules = this.mergeDefaultModules({
      [moduleKey]: moduleConfig,
    })
    const moduleDefinition = mergedModules[moduleKey]

    const result = await AcmeKitApp({
      modulesConfig: { [moduleKey]: moduleDefinition },
      sharedContainer: this.#container,
      linkModules: this.#customLinksModules,
      sharedResourcesConfig,
      injectedDependencies,
      workerMode: configModule.projectConfig?.workerMode,
      acmekitConfigPath: this.#acmekitConfigPath,
      cwd: this.#cwd,
    })

    const loadedModule = result.modules[moduleKey] as LoadedModule &
      IModuleService
    if (loadedModule) {
      this.#container.register({
        [loadedModule.__definition.key]: asValue(loadedModule),
      })
    }

    if (loadedModule?.__hooks?.onApplicationStart) {
      await loadedModule.__hooks.onApplicationStart
        .bind(loadedModule)()
        .catch((error: any) => {
          injectedDependencies[ContainerRegistrationKeys.LOGGER].error(
            `Error starting module "${loadedModule.__definition.key}": ${error.message}`
          )
        })
    }

    return loadedModule
  }

  /**
   * Load all modules and bootstrap all the modules and links to be ready to be consumed
   * @param config
   */
  async load(
    config: {
      registerInContainer?: boolean
      schemaOnly?: boolean
      migrationOnly?: boolean
    } = {
      registerInContainer: true,
      schemaOnly: false,
      migrationOnly: false,
    }
  ): Promise<AcmeKitAppOutput> {
    const configModule: ConfigModule = this.#container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    const { sharedResourcesConfig, injectedDependencies } =
      !config.migrationOnly && !config.schemaOnly
        ? this.prepareSharedResourcesAndDeps()
        : {}

    this.#container.register(
      ContainerRegistrationKeys.REMOTE_QUERY,
      asValue(undefined)
    )
    this.#container.register(
      ContainerRegistrationKeys.QUERY,
      asValue(undefined)
    )
    this.#container.register(ContainerRegistrationKeys.LINK, asValue(undefined))
    this.#container.register(
      ContainerRegistrationKeys.REMOTE_LINK,
      aliasTo(ContainerRegistrationKeys.LINK)
    )

    const configModules = this.mergeDefaultModules(configModule.modules)

    const acmekitApp = await AcmeKitApp({
      workerMode: configModule.projectConfig.workerMode,
      modulesConfig: configModules,
      sharedContainer: this.#container,
      linkModules: this.#customLinksModules,
      sharedResourcesConfig,
      injectedDependencies,
      acmekitConfigPath: this.#acmekitConfigPath,
      cwd: this.#cwd,
      migrationOnly: config.migrationOnly,
      schemaOnly: config.schemaOnly,
    })

    if (!config.registerInContainer) {
      return acmekitApp
    }

    this.#container.register(
      ContainerRegistrationKeys.LINK,
      asValue(acmekitApp.link)
    )
    this.#container.register(
      ContainerRegistrationKeys.REMOTE_LINK,
      aliasTo(ContainerRegistrationKeys.LINK)
    )
    this.#container.register(
      ContainerRegistrationKeys.REMOTE_QUERY,
      asValue(acmekitApp.query)
    )
    this.#container.register(
      ContainerRegistrationKeys.QUERY,
      asValue(acmekitApp.query)
    )

    for (const moduleService of Object.values(acmekitApp.modules)) {
      const loadedModule = moduleService as LoadedModule
      container.register(loadedModule.__definition.key, asValue(moduleService))
    }

    // Register all unresolved modules as undefined to be present in the container with undefined value by default
    // but still resolvable
    for (const moduleDefinition of Object.values(ModulesDefinition)) {
      if (!container.hasRegistration(moduleDefinition.key)) {
        container.register(moduleDefinition.key, asValue(undefined))
      }
    }

    return acmekitApp
  }
}
