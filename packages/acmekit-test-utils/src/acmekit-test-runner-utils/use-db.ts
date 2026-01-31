import type { AcmeKitAppLoader } from "@acmekit/framework"
import { logger } from "@acmekit/framework/logger"
import { Logger, AcmeKitContainer } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  getResolvedPlugins,
} from "@acmekit/framework/utils"
import { join } from "path"

/**
 * Initiates the database connection
 */
export async function initDb() {
  const { pgConnectionLoader } = await import("@acmekit/framework")

  const pgConnection = await pgConnectionLoader()

  return pgConnection
}

/**
 * Migrates the database
 */
export async function migrateDatabase(appLoader: AcmeKitAppLoader) {
  try {
    await appLoader.runModulesMigrations()
  } catch (err) {
    logger.error("Something went wrong while running the migrations")
    throw err
  }
}

/**
 * Syncs links with the databse
 */
export async function syncLinks(
  appLoader: AcmeKitAppLoader,
  directory: string,
  container: AcmeKitContainer,
  logger: Logger
) {
  try {
    await loadCustomLinks(directory, container)

    const planner = await appLoader.getLinksExecutionPlanner()
    const actionPlan = await planner.createPlan()
    actionPlan.forEach((action) => {
      logger.info(`Sync links: "${action.action}" ${action.tableName}`)
    })
    await planner.executePlan(actionPlan)
  } catch (err) {
    logger.error("Something went wrong while syncing links")
    throw err
  }
}

async function loadCustomLinks(directory: string, container: AcmeKitContainer) {
  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const plugins = await getResolvedPlugins(directory, configModule, true)
  const linksSourcePaths = plugins.map((plugin) =>
    join(plugin.resolve, "links")
  )
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const { LinkLoader } = await import("@acmekit/framework")
  await new LinkLoader(linksSourcePaths, logger).load()
}
