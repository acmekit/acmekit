import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"
import { ContainerRegistrationKeys, isString } from "@acmekit/framework/utils"

export const GET = async (
  req: AcmeKitRequest<unknown>,
  res: AcmeKitResponse<HttpTypes.AdminPluginsListResponse>
) => {
  const configModule = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const configPlugins = configModule.plugins ?? []

  const plugins = configPlugins.map((plugin) => ({
    name: isString(plugin) ? plugin : plugin.resolve,
  }))

  res.json({
    plugins,
  })
}
