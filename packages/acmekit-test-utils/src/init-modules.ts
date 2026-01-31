import { logger } from "@acmekit/framework/logger"
import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  createPgConnection,
  promiseAll,
} from "@acmekit/framework/utils"

export interface InitModulesOptions {
  injectedDependencies?: Record<string, unknown>
  databaseConfig: {
    clientUrl: string
    schema?: string
  }
  modulesConfig: {
    [key: string]:
      | string
      | boolean
      | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
  }
  joinerConfig?: ModuleJoinerConfig[]
  preventConnectionDestroyWarning?: boolean
  cwd?: string
}

export async function initModules({
  injectedDependencies,
  databaseConfig,
  modulesConfig,
  joinerConfig,
  preventConnectionDestroyWarning = false,
  cwd,
}: InitModulesOptions) {
  const moduleSdkImports = require("@acmekit/framework/modules-sdk")

  injectedDependencies ??= {}

  let sharedPgConnection =
    injectedDependencies?.[ContainerRegistrationKeys.PG_CONNECTION]

  let shouldDestroyConnectionAutomatically = !sharedPgConnection
  if (!sharedPgConnection) {
    sharedPgConnection = createPgConnection({
      clientUrl: databaseConfig.clientUrl,
      schema: databaseConfig.schema,
    })

    injectedDependencies[ContainerRegistrationKeys.PG_CONNECTION] =
      sharedPgConnection
  }

  const acmekitApp = await moduleSdkImports.AcmeKitApp({
    modulesConfig,
    servicesConfig: joinerConfig,
    injectedDependencies,
    cwd,
  })

  await acmekitApp.onApplicationStart()

  async function shutdown() {
    const promises: Promise<void>[] = []

    if (shouldDestroyConnectionAutomatically) {
      promises.push((sharedPgConnection as any).context?.destroy())
      promises.push((sharedPgConnection as any).destroy())
      promises.push(acmekitApp.onApplicationPrepareShutdown())
      promises.push(acmekitApp.onApplicationShutdown())
    } else {
      if (!preventConnectionDestroyWarning) {
        logger.info(
          `You are using a custom shared connection. The connection won't be destroyed automatically.`
        )
      }
    }

    await promiseAll(promises)
    moduleSdkImports.AcmeKitModule.clearInstances()
  }

  return {
    acmekitApp,
    shutdown,
  }
}
