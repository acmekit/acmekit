import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntity,
} from "@acmekit/framework/http"
import { AdminGetNotificationParamsType } from "../validators"
import { HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<AdminGetNotificationParamsType>,
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
