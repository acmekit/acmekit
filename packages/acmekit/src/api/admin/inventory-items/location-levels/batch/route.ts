import { batchInventoryItemLevelsWorkflow } from "@acmekit/core-flows"
import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework"
import { HttpTypes } from "@acmekit/types"

export const POST = async (
  req: AcmeKitRequest<HttpTypes.AdminBatchInventoryItemsLocationLevels>,
  res: AcmeKitResponse<HttpTypes.AdminBatchInventoryItemsLocationLevelsResponse>
) => {
  const body = req.validatedBody

  const output = await batchInventoryItemLevelsWorkflow(req.scope).run({
    input: body,
  })

  res.json({
    created: output.result.created,
    updated: output.result.updated,
    deleted: output.result.deleted,
  })
}
