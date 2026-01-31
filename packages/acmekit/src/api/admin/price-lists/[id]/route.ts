import {
  deletePriceListsWorkflow,
  updatePriceListsWorkflow,
} from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { fetchPriceList } from "../helpers"
import { HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminPriceListParams>,
  res: AcmeKitResponse<HttpTypes.AdminPriceListResponse>
) => {
  const price_list = await fetchPriceList(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ price_list })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdatePriceList,
    HttpTypes.AdminPriceListParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminPriceListResponse>
) => {
  const id = req.params.id
  const workflow = updatePriceListsWorkflow(req.scope)

  await workflow.run({
    input: { price_lists_data: [{ ...req.validatedBody, id }] },
  })

  const price_list = await fetchPriceList(id, req.scope, req.queryConfig.fields)

  res.status(200).json({ price_list })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminPriceListDeleteResponse>
) => {
  const id = req.params.id
  const workflow = deletePriceListsWorkflow(req.scope)

  await workflow.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "price_list",
    deleted: true,
  })
}
