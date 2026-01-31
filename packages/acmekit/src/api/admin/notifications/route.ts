import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntities,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminNotificationListParams>,
  res: AcmeKitResponse<HttpTypes.AdminNotificationListResponse>
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
