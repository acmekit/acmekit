import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntities,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminNotificationListParams>,
  res: MedusaResponse<HttpTypes.AdminNotificationListResponse>
) => {
  const { data: notifications, metadata } = await refetchEntities({
    entity: "notification",
    idOrFilter: req.filterableFields,
    scope: req.scope,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  res.json({
    notifications,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
