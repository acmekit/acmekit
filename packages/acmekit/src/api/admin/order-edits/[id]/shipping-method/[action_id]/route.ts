import {
  removeOrderEditShippingMethodWorkflow,
  updateOrderEditShippingMethodWorkflow,
} from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { AdminPostOrderEditsShippingActionReqSchemaType } from "../../../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminPostOrderEditsShippingActionReqSchemaType>,
  res: AcmeKitResponse<HttpTypes.AdminOrderEditPreviewResponse>
) => {
  const { id, action_id } = req.params

  const { result } = await updateOrderEditShippingMethodWorkflow(req.scope).run(
    {
      input: {
        data: { ...req.validatedBody },
        order_id: id,
        action_id,
      },
    }
  )

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminOrderEditPreviewResponse>
) => {
  const { id, action_id } = req.params

  const { result: orderPreview } = await removeOrderEditShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      order_id: id,
      action_id,
    },
  })

  res.json({
    order_preview: orderPreview as unknown as HttpTypes.AdminOrderPreview,
  })
}
