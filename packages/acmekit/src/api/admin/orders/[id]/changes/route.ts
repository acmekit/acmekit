import { HttpTypes } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminOrderChangesFilters>,
  res: AcmeKitResponse<HttpTypes.AdminOrderChangesResponse>
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_change",
    variables: {
      filters: {
        ...req.filterableFields,
        order_id: id,
      },
    },
    fields: req.queryConfig.fields,
  })

  const order_changes = await remoteQuery(queryObject)

  res.status(200).json({ order_changes })
}
