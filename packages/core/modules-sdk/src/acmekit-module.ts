import {
  ExternalModuleDeclaration,
  IModuleService,
  InternalModuleDeclaration,
  LinkModuleDefinition,
  LoadedModule,
  AcmeKitContainer,
  ModuleBootstrapDeclaration,
  ModuleDefinition,
  ModuleExports,
  ModuleJoinerConfig,
  ModuleResolution,
} from "@acmekit/types"
import {
  ContainerRegistrationKeys,
  createAcmeKitContainer,
  promiseAll,
  simpleHash,
  stringifyCircular,
} from "@acmekit/utils"
import { asValue } from "@acmekit/deps/awilix"
import { EOL } from "os"
import {
  moduleLoader,
  registerAcmeKitLinkModule,
  registerAcmeKitModule,
} from "./loaders"
import { loadModuleMigrations } from "./loaders/utils"
import { MODULE_SCOPE } from "./types"

const logger: any = {
  log: (a) => console.log(a),
  info: (a) => console.log(a),
  warn: (a) => console.warn(a),
  error: (a) => console.error(a),
}

declare global {
  interface AcmeKitModule {
    getLoadedModules(
      aliases?: Map<string, string>
    ): { [key: string]: LoadedModule }[]
    getModuleInstance(moduleKey: string, alias?: string): LoadedModule
  }
}

type ModuleAlias = {
  key: string
  hash: string
  isLink: boolean
  alias?: string
  main?: boolean
}

export type MigrationOptions = {
  moduleKey: string
  modulePath: string
  container?: AcmeKitContainer
  options?: Record<string, any>
  moduleExports?: ModuleExports
  cwd?: string
}

export type ModuleBootstrapOptions = {
  moduleKey: string
  defaultPath: string
  declaration?: ModuleBootstrapDeclaration
  moduleExports?: ModuleExports
  sharedContainer?: AcmeKitContainer
  moduleDefinition?: ModuleDefinition
  injectedDependencies?: Record<string, any>
  /**
   * In this mode, all instances are partially loaded, meaning that the module will not be fully loaded and the services will not be available.
   * Don't forget to clear the instances (AcmeKitModule.clearInstances()) after the migration are done.
   */
  migrationOnly?: boolean
  /**
   * Forces the modules bootstrapper to only run the modules loaders and return prematurely. This
   * is meant for modules that have data loader. In a test env, in order to clear all data
   * and load them back, we need to run those loader again
   */
  loaderOnly?: boolean
  workerMode?: "shared" | "worker" | "server"
  cwd?: string
}

export type LinkModuleBootstrapOptions = {
  definition: LinkModuleDefinition
  declaration?: InternalModuleDeclaration
  moduleExports?: ModuleExports
  injectedDependencies?: Record<string, any>
  cwd?: string
  migrationOnly?: boolean
  schemaOnly?: boolean
}

export type RegisterModuleJoinerConfig =
  | ModuleJoinerConfig
  | ((modules: ModuleJoinerConfig[]) => ModuleJoinerConfig)

class AcmeKitModule {
  private static instances_: Map<string, { [key: string]: IModuleService }> =
    new Map()
  private static modules_: Map<string, ModuleAlias[]> = new Map()
  private static customLinks_: RegisterModuleJoinerConfig[] = []
  private static loading_: Map<string, Promise<any>> = new Map()
  private static joinerConfig_: Map<string, ModuleJoinerConfig> = new Map()
  private static moduleResolutions_: Map<string, ModuleResolution> = new Map()

  public static getLoadedModules(
    aliases?: Map<string, string>
  ): { [key: string]: LoadedModule }[] {
    return [...AcmeKitModule.modules_.entries()].map(([key]) => {
      if (aliases?.has(key)) {
        return AcmeKitModule.getModuleInstance(key, aliases.get(key))
      }

      return AcmeKitModule.getModuleInstance(key)
    })
  }

  public static onApplicationStart(onApplicationStartCb?: () => void): void {
    for (const instances of AcmeKitModule.instances_.values()) {
      for (const instance of Object.values(instances) as IModuleService[]) {
        if (instance?.__hooks) {
          instance.__hooks?.onApplicationStart
            ?.bind(instance)()
            .then(() => {
              onApplicationStartCb?.()
            })
            .catch(() => {
              // The module should handle this and log it
              return void 0
            })
        }
      }
    }
  }
  public static async onApplicationShutdown(): Promise<void> {
    await promiseAll(
      [...AcmeKitModule.instances_.values()]
        .map((instances) => {
          return Object.values(instances).map((instance: IModuleService) => {
            return instance.__hooks?.onApplicationShutdown
              ?.bind(instance)()
              .catch(() => {
                // The module should handle this and log it
                return void 0
              })
          })
        })
        .flat()
    )
  }

  public static async onApplicationPrepareShutdown(): Promise<void> {
    await promiseAll(
      [...AcmeKitModule.instances_.values()]
        .map((instances) => {
          return Object.values(instances).map((instance: IModuleService) => {
            return instance.__hooks?.onApplicationPrepareShutdown
              ?.bind(instance)()
              .catch(() => {
                // The module should handle this and log it
                return void 0
              })
          })
        })
        .flat()
    )
  }

  public static clearInstances(): void {
    AcmeKitModule.instances_.clear()
    AcmeKitModule.modules_.clear()
    AcmeKitModule.joinerConfig_.clear()
    AcmeKitModule.moduleResolutions_.clear()
    AcmeKitModule.customLinks_.length = 0
  }

  public static isInstalled(moduleKey: string, alias?: string): boolean {
    if (alias) {
      return (
        AcmeKitModule.modules_.has(moduleKey) &&
        AcmeKitModule.modules_.get(moduleKey)!.some((m) => m.alias === alias)
      )
    }

    return AcmeKitModule.modules_.has(moduleKey)
  }

  public static getJoinerConfig(moduleKey: string): ModuleJoinerConfig {
    return AcmeKitModule.joinerConfig_.get(moduleKey)!
  }

  public static getAllJoinerConfigs(): ModuleJoinerConfig[] {
    return [...AcmeKitModule.joinerConfig_.values()]
  }

  public static getModuleResolutions(moduleKey: string): ModuleResolution {
    return AcmeKitModule.moduleResolutions_.get(moduleKey)!
  }

  public static getAllModuleResolutions(): ModuleResolution[] {
    return [...AcmeKitModule.moduleResolutions_.values()]
  }

  public static unregisterModuleResolution(moduleKey: string): void {
    AcmeKitModule.moduleResolutions_.delete(moduleKey)
    AcmeKitModule.joinerConfig_.delete(moduleKey)
    const moduleAliases = AcmeKitModule.modules_
      .get(moduleKey)
      ?.map((m) => m.alias || m.hash)
    if (moduleAliases) {
      for (const alias of moduleAliases) {
        AcmeKitModule.instances_.delete(alias)
      }
    }
    AcmeKitModule.modules_.delete(moduleKey)
  }

  public static setModuleResolution(
    moduleKey: string,
    resolution: ModuleResolution
  ): ModuleResolution {
    AcmeKitModule.moduleResolutions_.set(moduleKey, resolution)

    return resolution
  }

  public static setJoinerConfig(
    moduleKey: string,
    config: ModuleJoinerConfig
  ): ModuleJoinerConfig {
    AcmeKitModule.joinerConfig_.set(moduleKey, config)

    return config
  }

  public static setCustomLink(config: RegisterModuleJoinerConfig): void {
    AcmeKitModule.customLinks_.push(config)
  }

  public static getCustomLinks(): RegisterModuleJoinerConfig[] {
    return AcmeKitModule.customLinks_
  }

  public static getModuleInstance(
    moduleKey: string,
    alias?: string
  ): any | undefined {
    if (!AcmeKitModule.modules_.has(moduleKey)) {
      return
    }

    let mod
    const modules = AcmeKitModule.modules_.get(moduleKey)!
    if (alias) {
      mod = modules.find((m) => m.alias === alias)

      return AcmeKitModule.instances_.get(mod?.hash)
    }

    mod = modules.find((m) => m.main) ?? modules[0]

    return AcmeKitModule.instances_.get(mod?.hash)
  }

  private static registerModule(
    moduleKey: string,
    loadedModule: ModuleAlias
  ): void {
    if (!AcmeKitModule.modules_.has(moduleKey)) {
      AcmeKitModule.modules_.set(moduleKey, [])
    }

    const modules = AcmeKitModule.modules_.get(moduleKey)!

    if (modules.some((m) => m.alias === loadedModule.alias)) {
      throw new Error(
        `Module ${moduleKey} already registed as '${loadedModule.alias}'. Please choose a different alias.`
      )
    }

    if (loadedModule.main) {
      if (modules.some((m) => m.main)) {
        throw new Error(`Module ${moduleKey} already have a 'main' registered.`)
      }
    }

    modules.push(loadedModule)
    AcmeKitModule.modules_.set(moduleKey, modules!)
  }

  /**
   * Load all modules and resolve them once they are loaded
   * @param modulesOptions
   * @param migrationOnly
   * @param loaderOnly
   * @param workerMode
   */
  public static async bootstrapAll(
    modulesOptions: Omit<
      ModuleBootstrapOptions,
      "migrationOnly" | "loaderOnly" | "workerMode" | "schemaOnly"
    >[],
    {
      migrationOnly,
      loaderOnly,
      workerMode,
      schemaOnly,
      cwd,
    }: {
      migrationOnly?: boolean
      loaderOnly?: boolean
      workerMode?: ModuleBootstrapOptions["workerMode"]
      cwd?: string
      schemaOnly?: boolean
    }
  ): Promise<
    {
      [key: string]: any
    }[]
  > {
    return await AcmeKitModule.bootstrap_(modulesOptions, {
      migrationOnly,
      loaderOnly,
      workerMode,
      cwd,
      schemaOnly,
    })
  }

  /**
   * Load a single module and resolve it once it is loaded
   * @param moduleKey
   * @param defaultPath
   * @param declaration
   * @param moduleExports
   * @param sharedContainer
   * @param moduleDefinition
   * @param injectedDependencies
   * @param migrationOnly
   * @param loaderOnly
   * @param workerMode
   */
  public static async bootstrap<T>({
    moduleKey,
    defaultPath,
    declaration,
    moduleExports,
    sharedContainer,
    moduleDefinition,
    injectedDependencies,
    migrationOnly,
    loaderOnly,
    workerMode,
    cwd,
  }: ModuleBootstrapOptions): Promise<{
    [key: string]: T
  }> {
    const [service] = await AcmeKitModule.bootstrap_(
      [
        {
          moduleKey,
          defaultPath,
          declaration,
          moduleExports,
          sharedContainer,
          moduleDefinition,
          injectedDependencies,
        },
      ],
      {
        migrationOnly,
        loaderOnly,
        workerMode,
        cwd,
      }
    )

    return service as {
      [key: string]: T
    }
  }

  /**
   * Load all modules and then resolve them once they are loaded
   *
   * @param modulesOptions
   * @param migrationOnly
   * @param loaderOnly
   * @param workerMode
   * @protected
   */
  protected static async bootstrap_<T>(
    modulesOptions: Omit<
      ModuleBootstrapOptions,
      "migrationOnly" | "loaderOnly" | "workerMode" | "cwd" | "schemaOnly"
    >[],
    {
      migrationOnly,
      loaderOnly,
      workerMode,
      cwd = process.cwd(),
      schemaOnly,
    }: {
      migrationOnly?: boolean
      loaderOnly?: boolean
      workerMode?: "shared" | "worker" | "server"
      cwd?: string
      schemaOnly?: boolean
    }
  ): Promise<
    {
      [key: string]: T
    }[]
  > {
    let loadedModules: {
      hashKey: string
      modDeclaration: InternalModuleDeclaration | ExternalModuleDeclaration
      moduleResolutions: Record<string, ModuleResolution>
      container: AcmeKitContainer
      finishLoading: (arg: { [Key: string]: any }) => void
    }[] = []

    const services: { [Key: string]: any }[] = []

    await promiseAll(
      modulesOptions.map(async (moduleOptions) => {
        const {
          moduleKey,
          defaultPath,
          declaration,
          moduleExports,
          sharedContainer,
          moduleDefinition,
          injectedDependencies,
        } = moduleOptions

        const hashKey = simpleHash(
          stringifyCircular({ moduleKey, defaultPath, declaration })
        )

        let finishLoading: any
        let errorLoading: any

        const loadingPromise = new Promise((resolve, reject) => {
          finishLoading = resolve
          errorLoading = reject
        })

        if (!loaderOnly && AcmeKitModule.instances_.has(hashKey)) {
          services.push(AcmeKitModule.instances_.get(hashKey)!)
          return
        }

        if (!loaderOnly && AcmeKitModule.loading_.has(hashKey)) {
          services.push(await AcmeKitModule.loading_.get(hashKey))
          return
        }

        if (!loaderOnly) {
          AcmeKitModule.loading_.set(hashKey, loadingPromise)
        }

        let modDeclaration =
          declaration ??
          ({} as InternalModuleDeclaration | ExternalModuleDeclaration)

        if (declaration?.scope !== MODULE_SCOPE.EXTERNAL) {
          modDeclaration = {
            scope: declaration?.scope || MODULE_SCOPE.INTERNAL,
            resolve: defaultPath,
            options: declaration?.options ?? declaration,
            dependencies:
              (declaration as InternalModuleDeclaration)?.dependencies ?? [],
            alias: declaration?.alias,
            main: declaration?.main,
            worker_mode: workerMode,
          } as InternalModuleDeclaration
        }

        const container = sharedContainer ?? createAcmeKitContainer()

        if (injectedDependencies) {
          for (const service in injectedDependencies) {
            container.register(service, asValue(injectedDependencies[service]))
            if (!container.hasRegistration(service)) {
              container.register(
                service,
                asValue(injectedDependencies[service])
              )
            }
          }
        }

        const moduleResolutions = registerAcmeKitModule({
          moduleKey,
          moduleDeclaration: modDeclaration!,
          moduleExports,
          definition: moduleDefinition,
          cwd,
        })

        const logger_ =
          container.resolve(ContainerRegistrationKeys.LOGGER, {
            allowUnregistered: true,
          }) ?? logger

        try {
          await moduleLoader({
            container,
            moduleResolutions,
            logger: logger_,
            migrationOnly,
            schemaOnly,
            loaderOnly,
          })
        } catch (err) {
          errorLoading(err)
          throw err
        }

        loadedModules.push({
          hashKey,
          modDeclaration,
          moduleResolutions,
          container,
          finishLoading,
        })
      })
    )

    if (loaderOnly) {
      loadedModules.forEach(({ finishLoading }) => finishLoading({}))
      return [{}]
    }

    const resolvedServices = await promiseAll(
      loadedModules.map(
        async ({
          hashKey,
          modDeclaration,
          moduleResolutions,
          container,
          finishLoading,
        }) => {
          const service = await AcmeKitModule.resolveLoadedModule({
            hashKey,
            modDeclaration,
            moduleResolutions,
            container,
          })

          AcmeKitModule.instances_.set(hashKey, service)
          finishLoading(service)
          AcmeKitModule.loading_.delete(hashKey)
          return service
        }
      )
    )

    services.push(...resolvedServices)

    return services
  }

  /**
   * Resolve all the modules once they all have been loaded through the bootstrap
   * and store their references in the instances_ map and return them
   *
   * @param hashKey
   * @param modDeclaration
   * @param moduleResolutions
   * @param container
   * @private
   */
  private static async resolveLoadedModule({
    hashKey,
    modDeclaration,
    moduleResolutions,
    container,
  }: {
    hashKey: string
    modDeclaration: InternalModuleDeclaration | ExternalModuleDeclaration
    moduleResolutions: Record<string, ModuleResolution>
    container: AcmeKitContainer
  }): Promise<{
    [key: string]: any
  }> {
    const logger_ =
      container.resolve(ContainerRegistrationKeys.LOGGER, {
        allowUnregistered: true,
      }) ?? logger

    const services: { [key: string]: any } = {}

    for (const resolution of Object.values(
      moduleResolutions
    ) as ModuleResolution[]) {
      const keyName = resolution.definition.key

      services[keyName] = container.resolve(keyName)
      services[keyName].__definition = resolution.definition
      services[keyName].__definition.resolvePath =
        "resolve" in modDeclaration &&
        typeof modDeclaration.resolve === "string"
          ? modDeclaration.resolve
          : undefined

      if (resolution.definition.isQueryable) {
        let joinerConfig!: ModuleJoinerConfig

        try {
          // TODO: rework that to store on a separate property
          joinerConfig =
            typeof services[keyName].__joinerConfig === "function"
              ? await services[keyName].__joinerConfig?.()
              : services[keyName].__joinerConfig
        } catch {
          // noop
        }

        if (!joinerConfig) {
          throw new Error(
            `Your module is missing a joiner config: ${keyName}. If this module is not queryable, please set { definition: { isQueryable: false } } in your module configuration.`
          )
        }

        if (!joinerConfig.primaryKeys) {
          logger_.warn(
            `Primary keys are not defined by the module ${keyName}. Setting default primary key to 'id'${EOL}`
          )

          joinerConfig.primaryKeys = ["id"]
        }

        services[keyName].__joinerConfig = joinerConfig
        AcmeKitModule.setJoinerConfig(keyName, joinerConfig)
      }

      AcmeKitModule.setModuleResolution(keyName, resolution)

      AcmeKitModule.registerModule(keyName, {
        key: keyName,
        hash: hashKey,
        alias: modDeclaration.alias ?? hashKey,
        main: !!modDeclaration.main,
        isLink: false,
      })
    }

    return services
  }

  public static async bootstrapLink({
    definition,
    declaration,
    moduleExports,
    injectedDependencies,
    cwd,
    migrationOnly,
    schemaOnly,
  }: LinkModuleBootstrapOptions): Promise<{
    [key: string]: unknown
  }> {
    const moduleKey = definition.key
    const hashKey = simpleHash(stringifyCircular({ moduleKey, declaration }))

    if (AcmeKitModule.instances_.has(hashKey)) {
      return { [moduleKey]: AcmeKitModule.instances_.get(hashKey) }
    }

    if (AcmeKitModule.loading_.has(hashKey)) {
      return await AcmeKitModule.loading_.get(hashKey)
    }

    let finishLoading: any
    let errorLoading: any
    AcmeKitModule.loading_.set(
      hashKey,
      new Promise((resolve, reject) => {
        finishLoading = resolve
        errorLoading = reject
      })
    )

    let modDeclaration =
      declaration ?? ({} as Partial<InternalModuleDeclaration>)

    const moduleDefinition: ModuleDefinition = {
      key: definition.key,
      dependencies: definition.dependencies,
      defaultPackage: "",
      label: definition.label,
      isRequired: false,
      isQueryable: true,
      defaultModuleDeclaration: definition.defaultModuleDeclaration,
    }

    modDeclaration = {
      resolve: "",
      options: declaration,
      alias: declaration?.alias,
      main: declaration?.main,
    }

    const container = createAcmeKitContainer()

    if (injectedDependencies) {
      for (const service in injectedDependencies) {
        container.register(service, asValue(injectedDependencies[service]))
      }
    }

    const moduleResolutions = registerAcmeKitLinkModule(
      moduleDefinition,
      modDeclaration as InternalModuleDeclaration,
      moduleExports,
      cwd
    )

    const logger_ =
      container.resolve(ContainerRegistrationKeys.LOGGER, {
        allowUnregistered: true,
      }) ?? logger

    try {
      await moduleLoader({
        container,
        moduleResolutions,
        migrationOnly,
        schemaOnly,
        logger: logger_,
      })
    } catch (err) {
      errorLoading(err)
      throw err
    }

    const services = {}

    for (const resolution of Object.values(
      moduleResolutions
    ) as ModuleResolution[]) {
      const keyName = resolution.definition.key

      services[keyName] = container.resolve(keyName)
      services[keyName].__definition = resolution.definition

      if (resolution.definition.isQueryable) {
        let joinerConfig!: ModuleJoinerConfig

        try {
          joinerConfig = await services[keyName].__joinerConfig?.()
        } catch {
          // noop
        }

        if (!joinerConfig) {
          throw new Error(
            `Your module is missing a joiner config: ${keyName}. If this module is not queryable, please set { definition: { isQueryable: false } } in your module configuration.`
          )
        }

        services[keyName].__joinerConfig = joinerConfig
        AcmeKitModule.setJoinerConfig(keyName, joinerConfig)

        if (!joinerConfig.isLink) {
          throw new Error(
            "AcmeKitModule.bootstrapLink must be used only for Link Modules"
          )
        }
      }

      AcmeKitModule.setModuleResolution(keyName, resolution)
      AcmeKitModule.registerModule(keyName, {
        key: keyName,
        hash: hashKey,
        alias: modDeclaration.alias ?? hashKey,
        main: !!modDeclaration.main,
        isLink: true,
      })
    }

    AcmeKitModule.instances_.set(hashKey, services)
    finishLoading(services)
    AcmeKitModule.loading_.delete(hashKey)

    return services
  }

  public static async migrateGenerate({
    options,
    container,
    moduleExports,
    moduleKey,
    modulePath,
    cwd,
  }: MigrationOptions): Promise<void> {
    const moduleResolutions = registerAcmeKitModule({
      moduleKey,
      moduleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: modulePath,
        options,
      },
      cwd,
    })

    const logger_ =
      container?.resolve(ContainerRegistrationKeys.LOGGER, {
        allowUnregistered: true,
      }) ?? logger

    container ??= createAcmeKitContainer()

    for (const mod in moduleResolutions) {
      const { generateMigration } = await loadModuleMigrations(
        container,
        moduleResolutions[mod],
        moduleExports
      )

      if (typeof generateMigration === "function") {
        await generateMigration({
          options,
          container: container!,
          logger: logger_,
        })
      }
    }
  }

  public static async migrateUp({
    options,
    container,
    moduleExports,
    moduleKey,
    modulePath,
    cwd,
  }: MigrationOptions): Promise<{ name: string; path: string }[]> {
    const moduleResolutions = registerAcmeKitModule({
      moduleKey,
      moduleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: modulePath,
        options,
      },
      cwd,
    })

    const logger_ =
      container?.resolve(ContainerRegistrationKeys.LOGGER, {
        allowUnregistered: true,
      }) ?? logger

    container ??= createAcmeKitContainer()

    let result: { name: string; path: string }[] = []
    for (const mod in moduleResolutions) {
      const { runMigrations } = await loadModuleMigrations(
        container,
        moduleResolutions[mod],
        moduleExports
      )

      if (typeof runMigrations === "function") {
        const res = await runMigrations({
          options,
          container: container!,
          logger: logger_,
        })
        result.push(...res)
      }
    }

    return result
  }

  public static async migrateDown(
    {
      options,
      container,
      moduleExports,
      moduleKey,
      modulePath,
      cwd,
    }: MigrationOptions,
    migrationNames?: string[]
  ): Promise<void> {
    const moduleResolutions = registerAcmeKitModule({
      moduleKey,
      moduleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: modulePath,
        options,
      },
      cwd,
    })

    const logger_ =
      container?.resolve(ContainerRegistrationKeys.LOGGER, {
        allowUnregistered: true,
      }) ?? logger

    container ??= createAcmeKitContainer()

    for (const mod in moduleResolutions) {
      const { revertMigration } = await loadModuleMigrations(
        container,
        moduleResolutions[mod],
        moduleExports
      )

      if (typeof revertMigration === "function") {
        await revertMigration({
          options,
          container: container!,
          logger: logger_,
          migrationNames,
        })
      }
    }
  }
}

global.AcmeKitModule ??= AcmeKitModule
const GlobalAcmeKitModule = global.AcmeKitModule as typeof AcmeKitModule

export { GlobalAcmeKitModule as AcmeKitModule }
