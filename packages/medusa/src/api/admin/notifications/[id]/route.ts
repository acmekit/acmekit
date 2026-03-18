import {
  AuthenticatedMedusaRequest,
  AcmeKitResponse,
  refetchEntity,
} from "/framework/http"
import { AdminGetNotificationParamsType } from "../validators"
import { HttpTypes } from "/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetNotificationParamsType>,
  res: AcmeKitResponse<HttpTypes.AdminNotificationResponse>
) => {
  const notification = await refetchEntity({
    entity: "notification",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ notification })
}
