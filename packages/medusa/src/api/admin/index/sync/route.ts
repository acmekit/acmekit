import { AuthenticatedMedusaRequest, AcmeKitResponse } from "/framework"
import { HttpTypes } from "/framework/types"
import { Modules } from "/framework/utils"

/**
 * @since 2.11.2
 * @featureFlag index
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminIndexSyncPayload>,
  res: AcmeKitResponse
) => {
  const indexService = req.scope.resolve(Modules.INDEX)
  const strategy = req.validatedBody.strategy

  await indexService.sync({ strategy })

  res.send(200)
}
