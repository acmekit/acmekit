import {
  deleteProductCategoriesWorkflow,
  updateProductCategoriesWorkflow,
} from "@acmekit/core-flows"
import {
  AdminProductCategoryResponse,
  HttpTypes,
} from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntities,
} from "@acmekit/framework/http"
import { AcmeKitError } from "@acmekit/framework/utils"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminProductCategoryListParams
  >,
  res: AcmeKitResponse<AdminProductCategoryResponse>
) => {
  const {
    data: [category],
  } = await refetchEntities({
    entity: "product_category",
    idOrFilter: { id: req.params.id, ...req.filterableFields },
    scope: req.scope,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  if (!category) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Product category with id: ${req.params.id} was not found`
    )
  }

  res.json({ product_category: category })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateProductCategory,
    HttpTypes.AdminProductCategoryParams
  >,
  res: AcmeKitResponse<AdminProductCategoryResponse>
) => {
  const { id } = req.params

  await updateProductCategoriesWorkflow(req.scope).run({
    input: { selector: { id }, update: req.validatedBody },
  })

  const {
    data: [category],
  } = await refetchEntities({
    entity: "product_category",
    idOrFilter: { id, ...req.filterableFields },
    scope: req.scope,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({ product_category: category })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminProductCategoryDeleteResponse>
) => {
  const id = req.params.id

  await deleteProductCategoriesWorkflow(req.scope).run({
    input: [id],
  })

  res.status(200).json({
    id,
    object: "product_category",
    deleted: true,
  })
}
