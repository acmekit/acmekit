import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntities,
  refetchEntity,
} from "@acmekit/framework/http"

import { createProductOptionsWorkflow } from "@acmekit/core-flows"
import { remapKeysForProduct, remapProductResponse } from "../../helpers"
import { AdditionalData, HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminProductOptionParams>,
  res: AcmeKitResponse<HttpTypes.AdminProductOptionListResponse>
) => {
  const productId = req.params.id
  const { data: product_options, metadata } = await refetchEntities({
    entity: "product_option",
    idOrFilter: { ...req.filterableFields, product_id: productId },
    scope: req.scope,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  res.json({
    product_options,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreateProductOption & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminProductResponse>
) => {
  const productId = req.params.id
  const { additional_data, ...rest } = req.validatedBody

  await createProductOptionsWorkflow(req.scope).run({
    input: {
      product_options: [
        {
          ...rest,
          product_id: productId,
        },
      ],
      additional_data,
    },
  })

  const product = await refetchEntity({
    entity: "product",
    idOrFilter: productId,
    scope: req.scope,
    fields: remapKeysForProduct(req.queryConfig.fields ?? []),
  })
  res.status(200).json({ product: remapProductResponse(product) })
}
