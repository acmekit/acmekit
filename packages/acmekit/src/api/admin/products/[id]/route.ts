import {
  deleteProductsWorkflow,
  updateProductsWorkflow,
} from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { remapKeysForProduct, remapProductResponse } from "../helpers"
import { AcmeKitError } from "@acmekit/framework/utils"
import { AdditionalData, HttpTypes } from "@acmekit/framework/types"
import { refetchEntity } from "@acmekit/framework/http"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.AdminProductResponse>
) => {
  const selectFields = remapKeysForProduct(req.queryConfig.fields ?? [])
  const product = await refetchEntity({
    entity: "product",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: selectFields,
  })

  if (!product) {
    throw new AcmeKitError(AcmeKitError.Types.NOT_FOUND, "Product not found")
  }

  res.status(200).json({ product: remapProductResponse(product) })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateProduct & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminProductResponse>
) => {
  const { additional_data, ...update } = req.validatedBody

  const existingProduct = await refetchEntity({
    entity: "product",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: ["id"],
  })
  /**
   * Check if the product exists with the id or not before calling the workflow.
   */
  if (!existingProduct) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Product with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateProductsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update,
      additional_data,
    },
  })

  const product = await refetchEntity({
    entity: "product",
    idOrFilter: result[0].id,
    scope: req.scope,
    fields: remapKeysForProduct(req.queryConfig.fields ?? []),
  })

  res.status(200).json({ product: remapProductResponse(product) })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminProductDeleteResponse>
) => {
  const id = req.params.id

  await deleteProductsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "product",
    deleted: true,
  })
}
