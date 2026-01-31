import { batchImageVariantsWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"

/**
 * @since 2.11.2
 */
export const POST = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminBatchImageVariantRequest>,
  res: AcmeKitResponse<HttpTypes.AdminBatchImageVariantResponse>
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
