import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminUserListParams>,
  res: AcmeKitResponse<HttpTypes.AdminUserListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "user",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: users, metadata } = await remoteQuery(query)
  res.status(200).json({
    users,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
