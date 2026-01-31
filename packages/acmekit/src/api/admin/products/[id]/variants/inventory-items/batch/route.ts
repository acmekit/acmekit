import { batchLinksWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { buildBatchVariantInventoryData } from "../../../../helpers"
import { AdminBatchVariantInventoryItemsType } from "../../../../validators"
import { HttpTypes } from "@acmekit/framework/types"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminBatchVariantInventoryItemsType>,
  res: AcmeKitResponse<HttpTypes.AdminProductVariantInventoryBatchResponse>
) => {
  const { create = [], update = [], delete: toDelete = [] } = req.validatedBody

  const { result } = await batchLinksWorkflow(req.scope).run({
    input: {
      create: buildBatchVariantInventoryData(create),
      update: buildBatchVariantInventoryData(update),
      delete: buildBatchVariantInventoryData(toDelete),
    },
  })

  res.status(200).json({
    created: result.created,
    updated: result.updated,
    deleted: result.deleted,
  } as unknown as HttpTypes.AdminProductVariantInventoryBatchResponse)
}
