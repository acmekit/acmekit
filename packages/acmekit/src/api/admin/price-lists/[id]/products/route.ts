import { batchPriceListPricesWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import { AcmeKitError } from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { fetchPriceList, fetchPriceListPriceIdsForProduct } from "../../helpers"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminLinkPriceListProducts,
    HttpTypes.AdminPriceListParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminPriceListResponse>
) => {
  const id = req.params.id
  const { remove = [] } = req.validatedBody

  if (!remove.length) {
    throw new AcmeKitError(
      AcmeKitError.Types.INVALID_DATA,
      "No product ids passed to remove from price list"
    )
  }

  const productPriceIds = await fetchPriceListPriceIdsForProduct(
    id,
    remove,
    req.scope
  )

  const workflow = batchPriceListPricesWorkflow(req.scope)
  await workflow.run({
    input: {
      data: {
        id,
        create: [],
        update: [],
        delete: productPriceIds,
      },
    },
  })

  const priceList = await fetchPriceList(id, req.scope, req.queryConfig.fields)

  res.status(200).json({ price_list: priceList })
}
