import { AuthenticatedMedusaRequest, AcmeKitResponse } from "/framework"
import { HttpTypes } from "/framework/types"
import { Modules } from "/framework/utils"

/**
 * Get the index information for all entities that are indexed and their sync state
 * 
 * @since 2.11.2
 * @featureFlag index
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<void>,
  res: AcmeKitResponse<HttpTypes.AdminIndexDetailsResponse>
) => {
  const indexModuleService = req.scope.resolve(Modules.INDEX)
  const indexInfo = await indexModuleService.getInfo()
  res.json({
    metadata: indexInfo,
  })
}
