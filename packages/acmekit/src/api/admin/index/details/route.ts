import { AuthenticatedAcmeKitRequest, AcmeKitResponse } from "@acmekit/framework"
import { HttpTypes } from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"

/**
 * Get the index information for all entities that are indexed and their sync state
 * 
 * @since 2.11.2
 * @featureFlag index
 */
export const GET = async (
  req: AuthenticatedAcmeKitRequest<void>,
  res: AcmeKitResponse<HttpTypes.AdminIndexDetailsResponse>
) => {
  const indexModuleService = req.scope.resolve(Modules.INDEX)
  const indexInfo = await indexModuleService.getInfo()
  res.json({
    metadata: indexInfo,
  })
}
