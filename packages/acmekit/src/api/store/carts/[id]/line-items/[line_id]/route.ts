import {
  deleteLineItemsWorkflowId,
  updateLineItemInCartWorkflowId,
} from "@acmekit/core-flows"
import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"
import { AdditionalData, HttpTypes } from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"
import { refetchCart } from "../../../helpers"

export const POST = async (
  req: AcmeKitRequest<
    HttpTypes.StoreUpdateCartLineItem & AdditionalData,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.StoreCartResponse>
) => {
  const we = req.scope.resolve(Modules.WORKFLOW_ENGINE)
  await we.run(updateLineItemInCartWorkflowId, {
    input: {
      cart_id: req.params.id,
      item_id: req.params.line_id,
      update: req.validatedBody,
      additional_data: req.validatedBody.additional_data,
    },
  })

  const updatedCart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ cart: updatedCart })
}

export const DELETE = async (
  req: AcmeKitRequest<{}, HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.StoreLineItemDeleteResponse>
) => {
  const id = req.params.line_id

  const we = req.scope.resolve(Modules.WORKFLOW_ENGINE)
  await we.run(deleteLineItemsWorkflowId, {
    input: {
      cart_id: req.params.id,
      ids: [id],
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({
    id: id,
    object: "line-item",
    deleted: true,
    parent: cart,
  })
}
