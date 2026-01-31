import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"
import { ContainerRegistrationKeys } from "@acmekit/framework/utils"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.StoreProductTypeListParams>,
  res: AcmeKitResponse<HttpTypes.StoreProductTypeListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: product_types, metadata } = await query.graph(
    {
      entity: "product_type",
      filters: req.filterableFields,
      pagination: req.queryConfig.pagination,
      fields: req.queryConfig.fields,
    },
    {
      locale: req.locale,
    }
  )

  res.json({
    product_types,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}
