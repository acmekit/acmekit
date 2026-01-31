import { AuthenticatedAcmeKitRequest, AcmeKitResponse } from "@acmekit/framework"
import { HttpTypes } from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"

/**
 * @since 2.11.2
 * @featureFlag index
 */
export const POST = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminIndexSyncPayload>,
  res: AcmeKitResponse
) => {
  const indexService = req.scope.resolve(Modules.INDEX)
  const strategy = req.validatedBody.strategy

  await indexService.sync({ strategy })

  res.send(200)
}
