import { batchLinkProductsToCategoryWorkflow } from "@acmekit/core-flows"
import {
  AdminProductCategoryResponse,
  HttpTypes,
} from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntity,
} from "@acmekit/framework/http"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminBatchLink,
    HttpTypes.AdminProductCategoryParams
  >,
  res: AcmeKitResponse<AdminProductCategoryResponse>
) => {
  const { id } = req.params

  await batchLinkProductsToCategoryWorkflow(req.scope).run({
    input: { id, ...req.validatedBody },
  })

  const category = await refetchEntity({
    entity: "product_category",
    idOrFilter: id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ product_category: category })
}
