import {
  addDraftOrderPromotionWorkflow,
  removeDraftOrderPromotionsWorkflow,
} from "@acmekit/core-flows"
import { AuthenticatedAcmeKitRequest, AcmeKitResponse } from "@acmekit/framework"
import { HttpTypes } from "@acmekit/types"
import {
  AdminAddDraftOrderPromotionsType,
  AdminRemoveDraftOrderPromotionsType,
} from "../../../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminAddDraftOrderPromotionsType>,
  res: AcmeKitResponse<HttpTypes.AdminDraftOrderPreviewResponse>
) => {
  const { id } = req.params

  const { result } = await addDraftOrderPromotionWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      order_id: id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest<AdminRemoveDraftOrderPromotionsType>,
  res: AcmeKitResponse<HttpTypes.AdminDraftOrderPreviewResponse>
) => {
  const { id } = req.params

  const { result } = await removeDraftOrderPromotionsWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      order_id: id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}
