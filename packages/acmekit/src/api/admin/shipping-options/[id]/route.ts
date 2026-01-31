import {
  deleteShippingOptionsWorkflow,
  updateShippingOptionsWorkflow,
} from "@acmekit/core-flows"
import { FulfillmentWorkflow, HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { refetchShippingOption } from "../helpers"
import { AcmeKitError } from "@acmekit/framework/utils"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.AdminShippingOptionResponse>
) => {
  const shippingOption = await refetchShippingOption(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  if (!shippingOption) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Shipping Option with id: ${req.params.id} not found`
    )
  }

  res.json({ shipping_option: shippingOption })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateShippingOption,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminShippingOptionResponse>
) => {
  const shippingOptionPayload = req.validatedBody

  const workflow = updateShippingOptionsWorkflow(req.scope)

  const workflowInput: FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput =
    {
      id: req.params.id,
      ...shippingOptionPayload,
    }

  const { result } = await workflow.run({
    input: [workflowInput],
  })

  const shippingOption = await refetchShippingOption(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ shipping_option: shippingOption })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminShippingOptionDeleteResponse>
) => {
  const shippingOptionId = req.params.id

  const workflow = deleteShippingOptionsWorkflow(req.scope)

  await workflow.run({
    input: { ids: [shippingOptionId] },
  })

  res
    .status(200)
    .json({ id: shippingOptionId, object: "shipping_option", deleted: true })
}
