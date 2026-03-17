import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"
import { AdminGetNotificationParamsType } from "../validators"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetNotificationParamsType>,
  res: MedusaResponse<HttpTypes.AdminNotificationResponse>
) => {
  const notification = await refetchEntity({
    entity: "notification",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ notification })
}
