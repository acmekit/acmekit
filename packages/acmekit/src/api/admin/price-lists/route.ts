import { createPriceListsWorkflow } from "@acmekit/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { fetchPriceList, transformPriceList } from "./helpers"
import { HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminPriceListListParams>,
  res: AcmeKitResponse<HttpTypes.AdminPriceListListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "price_list",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: priceLists, metadata } = await remoteQuery(queryObject)

  res.json({
    price_lists: priceLists.map((priceList) => transformPriceList(priceList)),
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreatePriceList,
    HttpTypes.AdminPriceListListParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminPriceListResponse>
) => {
  const workflow = createPriceListsWorkflow(req.scope)
  const { result } = await workflow.run({
    input: { price_lists_data: [req.validatedBody] },
  })

  const price_list = await fetchPriceList(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ price_list })
}
