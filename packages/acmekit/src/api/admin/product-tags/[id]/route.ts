import {
  deleteProductTagsWorkflow,
  updateProductTagsWorkflow,
} from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntity,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"
import { AcmeKitError } from "@acmekit/framework/utils"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminProductTagParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminProductTagResponse>
) => {
  const productTag = await refetchEntity({
    entity: "product_tag",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ product_tag: productTag })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateProductTag,
    HttpTypes.AdminProductTagParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminProductTagResponse>
) => {
  const existingProductTag = await refetchEntity({
    entity: "product_tag",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: ["id"],
  })

  if (!existingProductTag) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Product tag with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateProductTagsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const productTag = await refetchEntity({
    entity: "product_tag",
    idOrFilter: result[0].id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ product_tag: productTag })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminProductTagDeleteResponse>
) => {
  const id = req.params.id

  await deleteProductTagsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "product_tag",
    deleted: true,
  })
}
