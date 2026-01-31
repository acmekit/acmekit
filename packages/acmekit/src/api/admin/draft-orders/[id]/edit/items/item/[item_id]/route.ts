import { updateDraftOrderItemWorkflow } from "@acmekit/core-flows"
import { AuthenticatedAcmeKitRequest, AcmeKitResponse } from "@acmekit/framework"
import { HttpTypes } from "@acmekit/types"
import { AdminUpdateDraftOrderItemType } from "../../../../../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminUpdateDraftOrderItemType>,
  res: AcmeKitResponse
) => {
  const { id, item_id } = req.params

  const { result } = await updateDraftOrderItemWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      order_id: id,
      items: [
        {
          ...req.validatedBody,
          id: item_id,
        },
      ],
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}
