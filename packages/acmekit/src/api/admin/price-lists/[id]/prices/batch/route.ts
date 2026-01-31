import { promiseAll } from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { listPrices } from "../../../queries"
import { adminPriceListPriceQueryFields } from "../../../query-config"
import { BatchMethodRequest, HttpTypes } from "@acmekit/framework/types"
import {
  AdminCreatePriceListPriceType,
  AdminUpdatePriceListPriceType,
} from "../../../validators"
import { batchPriceListPricesWorkflow } from "@acmekit/core-flows"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    BatchMethodRequest<
      AdminCreatePriceListPriceType,
      AdminUpdatePriceListPriceType
    >
  >,
  res: AcmeKitResponse<HttpTypes.AdminPriceListBatchResponse>
) => {
  const id = req.params.id
  const {
    create = [],
    update = [],
    delete: deletePriceIds = [],
  } = req.validatedBody

  const workflow = batchPriceListPricesWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      data: {
        id,
        create,
        update,
        delete: deletePriceIds,
      },
    },
  })

  const [created, updated] = await promiseAll([
    listPrices(
      result.created.map((c) => c.id),
      req.scope,
      adminPriceListPriceQueryFields
    ),
    listPrices(
      result.updated.map((c) => c.id),
      req.scope,
      adminPriceListPriceQueryFields
    ),
  ])

  res.status(200).json({
    created,
    updated,
    deleted: {
      ids: deletePriceIds,
      object: "price",
      deleted: true,
    },
  })
}
