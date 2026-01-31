import { HttpTypes } from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

export const GET = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminOrderPreviewResponse>
) => {
  const { id } = req.params

  // NOTE: Consider replacing with remoteQuery when possible
  const orderModuleService = req.scope.resolve(Modules.ORDER)

  const order = (await orderModuleService.previewOrderChange(
    id
  )) as unknown as HttpTypes.AdminOrderPreview

  res.status(200).json({ order })
}
