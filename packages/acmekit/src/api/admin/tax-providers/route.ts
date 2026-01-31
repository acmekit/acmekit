import { ContainerRegistrationKeys } from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import { HttpTypes } from "@acmekit/framework/types"

/**
 * @since 2.8.0
 */
export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminGetTaxProvidersParams>,
  res: AcmeKitResponse<HttpTypes.AdminTaxProviderListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const result = await query.graph({
    entity: "tax_providers",
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({
    tax_providers: result.data,
    count: result.metadata?.count ?? 0,
    offset: result.metadata?.skip ?? 0,
    limit: result.metadata?.take ?? 0,
  })
}
