import { AcmeKitAppLoader } from "@acmekit/framework"
import { LinkLoader } from "@acmekit/framework/links"
import { MigrationScriptsMigrator } from "@acmekit/framework/migrations"
import {
  ContainerRegistrationKeys,
  getResolvedPlugins,
  mergePluginModules,
} from "@acmekit/framework/utils"
import { dirname, join } from "path"

import { AcmeKitModule } from "@acmekit/framework/modules-sdk"
import { Logger, AcmeKitContainer, PluginDetails } from "@acmekit/types"
import { initializeContainer } from "../../loaders"
import { ensureDbExists } from "../utils"

const TERMINAL_SIZE = process.stdout.columns

/**
 * A low-level utility to migrate the migration scripts. This util should
 * never exit the process implicitly.
 */
export async function runMigrationScripts({
  directory,
  container,
  logger,
}: {
  directory: string
  container: AcmeKitContainer
  logger: Logger
}): Promise<boolean> {
  let onApplicationPrepareShutdown: () => Promise<void> = async () =>
    Promise.resolve()
  let onApplicationShutdown: () => Promise<void> = async () => Promise.resolve()

  let plugins: PluginDetails[]

  try {
    await ensureDbExists(container)

    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    plugins = await getResolvedPlugins(directory, configModule, true)

    mergePluginModules(configModule, plugins)

    const resources = await loadResources(plugins, logger)
    onApplicationPrepareShutdown = resources.onApplicationPrepareShutdown
    onApplicationShutdown = resources.onApplicationShutdown

    const scriptsSourcePaths = [
      join(dirname(require.resolve("@acmekit/acmekit")), "migration-scripts"),
      ...plugins.map((plugin) => join(plugin.resolve, "migration-scripts")),
    ]

    const migrator = new MigrationScriptsMigrator({ container: container })
    await migrator.ensureMigrationsTable()
    const pendingScripts = await migrator.getPendingMigrations(
      scriptsSourcePaths
    )

    if (!pendingScripts?.length) {
      logger.info("No pending migration scripts to execute")
      return true
    }

    logger.log(new Array(TERMINAL_SIZE).join("-"))
    logger.info("Pending migration scripts to execute")
    logger.info(`${pendingScripts.join("\n")}`)

    logger.log(new Array(TERMINAL_SIZE).join("-"))
    logger.info("Running migration scripts...")
    await migrator.run(scriptsSourcePaths)

    logger.log(new Array(TERMINAL_SIZE).join("-"))
    logger.info("Migration scripts completed")

    return true
  } finally {
    await onApplicationPrepareShutdown()
    await onApplicationShutdown()
  }
}

async function loadResources(
  plugins: any,
  logger: Logger
): Promise<{
  onApplicationPrepareShutdown: () => Promise<void>
  onApplicationShutdown: () => Promise<void>
}> {
  /**
   * Clear all module instances to prevent cache from kicking in
   */
  AcmeKitModule.clearInstances()

  /**
   * Setup
   */

  const linksSourcePaths = plugins.map((plugin) =>
    join(plugin.resolve, "links")
  )
  await new LinkLoader(linksSourcePaths, logger).load()

  const acmekitAppResources = await new AcmeKitAppLoader().load()
  const onApplicationPrepareShutdown =
    acmekitAppResources.onApplicationPrepareShutdown
  const onApplicationShutdown = acmekitAppResources.onApplicationShutdown
  await acmekitAppResources.onApplicationStart()

  return {
    onApplicationPrepareShutdown,
    onApplicationShutdown,
  }
}

const main = async function ({
  directory,
}: {
  directory: string
  container?: AcmeKitContainer
}) {
  process.env.MEDUSA_WORKER_MODE = "server"
  const container = await initializeContainer(directory)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const migrated = await runMigrationScripts({
      directory,
      container: container,
      logger,
    })
    process.exit(migrated ? 0 : 1)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

export default main
