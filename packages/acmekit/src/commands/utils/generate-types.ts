import { LinkLoader, AcmeKitAppLoader } from "@acmekit/framework"
import { AcmeKitModule } from "@acmekit/framework/modules-sdk"
import {
  ContainerRegistrationKeys,
  FileSystem,
  generateContainerTypes,
  getResolvedPlugins,
  gqlSchemaToTypes,
  mergePluginModules,
  validateModuleName,
} from "@acmekit/framework/utils"
import { Logger, AcmeKitContainer } from "@acmekit/types"
import path, { join } from "path"

export async function generateTypes({
  directory,
  container,
  logger,
}: {
  directory: string
  container: AcmeKitContainer
  logger: Logger
}) {
  logger.info("Generating types...")

  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const plugins = await getResolvedPlugins(directory, configModule, true)
  mergePluginModules(configModule, plugins)

  Object.keys(configModule.modules ?? {}).forEach((key) => {
    validateModuleName(key)
  })

  const linksSourcePaths = plugins.map((plugin) =>
    join(plugin.resolve, "links")
  )
  await new LinkLoader(linksSourcePaths, logger).load()

  const { gqlSchema, modules } = await new AcmeKitAppLoader().load({
    registerInContainer: false,
    schemaOnly: true,
  })

  const typesDirectory = path.join(directory, ".acmekit/types")

  /**
   * Cleanup existing types directory before creating new artifacts
   */
  await new FileSystem(typesDirectory).cleanup({ recursive: true })

  await generateContainerTypes(modules, {
    outputDir: typesDirectory,
    interfaceName: "ModuleImplementations",
  })
  logger.debug("Generated container types")

  if (gqlSchema) {
    await gqlSchemaToTypes({
      outputDir: typesDirectory,
      filename: "query-entry-points",
      interfaceName: "RemoteQueryEntryPoints",
      schema: gqlSchema,
      joinerConfigs: AcmeKitModule.getAllJoinerConfigs(),
    })
    logger.debug("Generated modules types")
  }

  logger.info("Types generated successfully")
}
