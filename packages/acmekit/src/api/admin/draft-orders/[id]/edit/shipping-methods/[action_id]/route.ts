import {
  removeDraftOrderActionShippingMethodWorkflow,
  updateDraftOrderActionShippingMethodWorkflow,
} from "@acmekit/core-flows"
import { AuthenticatedAcmeKitRequest, AcmeKitResponse } from "@acmekit/framework"
import { HttpTypes } from "@acmekit/types"
import { AdminUpdateDraftOrderActionShippingMethodType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminUpdateDraftOrderActionShippingMethodType>,
  res: AcmeKitResponse
) => {
  const { id, action_id } = req.params

  const { result } = await updateDraftOrderActionShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      data: { ...req.validatedBody },
      order_id: id,
      action_id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminDraftOrderPreview,
  })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const { id, action_id } = req.params

  const { result } = await removeDraftOrderActionShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      order_id: id,
      action_id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminDraftOrderPreview,
  })
}
