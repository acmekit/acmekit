import { orderEditUpdateItemQuantityWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"
import { AdminPostOrderEditsUpdateItemQuantityReqSchemaType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminPostOrderEditsUpdateItemQuantityReqSchemaType>,
  res: AcmeKitResponse<HttpTypes.AdminOrderEditPreviewResponse>
) => {
  const { id, item_id } = req.params

  const { result } = await orderEditUpdateItemQuantityWorkflow(req.scope).run({
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
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}
