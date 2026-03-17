import { batchImageVariantsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"

/**
 * @since 2.11.2
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminBatchImageVariantRequest>,
  res: MedusaResponse<HttpTypes.AdminBatchImageVariantResponse>
) => {
  const imageId = req.params.image_id

  const { result } = await batchImageVariantsWorkflow(req.scope).run({
    input: {
      image_id: imageId,
      add: req.validatedBody.add,
      remove: req.validatedBody.remove,
    },
  })

  res.status(200).json({
    added: result.added,
    removed: result.removed,
  })
}
