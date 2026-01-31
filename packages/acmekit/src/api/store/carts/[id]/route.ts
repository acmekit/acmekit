import { updateCartWorkflowId } from "@acmekit/core-flows"
import { AdditionalData, HttpTypes } from "@acmekit/framework/types"

import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"
import { Modules } from "@acmekit/framework/utils"
import { refetchCart } from "../helpers"

export const GET = async (
  req: AcmeKitRequest<HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.StoreCartResponse>
) => {
  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.json({ cart })
}

export const POST = async (
  req: AcmeKitRequest<
    HttpTypes.StoreUpdateCart & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<{
    cart: HttpTypes.StoreCart
  }>
) => {
  const we = req.scope.resolve(Modules.WORKFLOW_ENGINE)

  await we.run(updateCartWorkflowId, {
    input: {
      ...req.validatedBody,
      id: req.params.id,
      additional_data: req.validatedBody.additional_data,
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ cart })
}
