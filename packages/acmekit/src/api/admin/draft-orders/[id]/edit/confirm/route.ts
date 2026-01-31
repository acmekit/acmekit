import { confirmDraftOrderEditWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/types"

export const POST = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const { id } = req.params

  const { result } = await confirmDraftOrderEditWorkflow(req.scope).run({
    input: {
      order_id: id,
      confirmed_by: req.auth_context.actor_id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}
