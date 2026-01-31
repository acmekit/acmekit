import {
  deleteProductTypesWorkflow,
  updateProductTypesWorkflow,
} from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import { refetchProductType } from "../helpers"
import { HttpTypes } from "@acmekit/framework/types"
import { AcmeKitError } from "@acmekit/framework/utils"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminProductTypeParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminProductTypeResponse>
) => {
  const productType = await refetchProductType(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ product_type: productType })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateProductType,
    HttpTypes.AdminProductTypeParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminProductTypeResponse>
) => {
  const existingProductType = await refetchProductType(
    req.params.id,
    req.scope,
    ["id"]
  )

  if (!existingProductType) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Product type with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateProductTypesWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const productType = await refetchProductType(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ product_type: productType })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminProductTypeDeleteResponse>
) => {
  const id = req.params.id

  await deleteProductTypesWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "product_type",
    deleted: true,
  })
}
