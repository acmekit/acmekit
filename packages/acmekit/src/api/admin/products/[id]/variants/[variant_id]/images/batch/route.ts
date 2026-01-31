import { batchVariantImagesWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"

/**
 * @since 2.11.2
 */
export const POST = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminBatchVariantImagesRequest>,
  res: AcmeKitResponse<HttpTypes.AdminBatchVariantImagesResponse>
) => {
  const variantId = req.params.variant_id

  const { result } = await batchVariantImagesWorkflow(req.scope).run({
    input: {
      variant_id: variantId,
      add: req.validatedBody.add,
      remove: req.validatedBody.remove,
    },
  })

  res.status(200).json({
    added: result.added,
    removed: result.removed,
  })
}
