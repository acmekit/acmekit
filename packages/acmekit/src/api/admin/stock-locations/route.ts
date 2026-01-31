import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import { createStockLocationsWorkflow } from "@acmekit/core-flows"
import { refetchStockLocation } from "./helpers"
import { HttpTypes } from "@acmekit/framework/types"

// Create stock location
export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreateStockLocation,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminStockLocationResponse>
) => {
  const { result } = await createStockLocationsWorkflow(req.scope).run({
    input: { locations: [req.validatedBody] },
  })

  const stockLocation = await refetchStockLocation(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ stock_location: stockLocation })
}

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminStockLocationListParams>,
  res: AcmeKitResponse<HttpTypes.AdminStockLocationListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { rows: stock_locations, metadata } = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "stock_locations",
      variables: {
        filters: req.filterableFields,
        ...req.queryConfig.pagination,
      },
      fields: req.queryConfig.fields,
    })
  )

  res.status(200).json({
    stock_locations,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
