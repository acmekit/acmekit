import { addDraftOrderItemsWorkflow } from "@acmekit/core-flows"
import { AuthenticatedAcmeKitRequest, AcmeKitResponse } from "@acmekit/framework"
import { HttpTypes } from "@acmekit/types"
import { AdminAddDraftOrderItemsType } from "../../../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminAddDraftOrderItemsType>,
  res: AcmeKitResponse
) => {
  const { id } = req.params

  const { result } = await addDraftOrderItemsWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      order_id: id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}
