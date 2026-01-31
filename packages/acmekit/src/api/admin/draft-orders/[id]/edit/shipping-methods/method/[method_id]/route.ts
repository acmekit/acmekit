import {
  removeDraftOrderShippingMethodWorkflow,
  updateDraftOrderShippingMethodWorkflow,
} from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/types"
import { AdminUpdateDraftOrderShippingMethodType } from "../../../../../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminUpdateDraftOrderShippingMethodType>,
  res: AcmeKitResponse
) => {
  const { id, method_id } = req.params

  const { result } = await updateDraftOrderShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      data: { shipping_method_id: method_id, ...req.validatedBody },
      order_id: id,
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
  const { id, method_id } = req.params

  const { result } = await removeDraftOrderShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      order_id: id,
      shipping_method_id: method_id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminDraftOrderPreview,
  })
}
