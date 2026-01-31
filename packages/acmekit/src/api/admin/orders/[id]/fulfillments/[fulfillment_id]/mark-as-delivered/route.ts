import { markOrderFulfillmentAsDeliveredWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntity,
} from "@acmekit/framework/http"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<{}, HttpTypes.AdminGetOrderParams>,
  res: AcmeKitResponse<HttpTypes.AdminOrderResponse>
) => {
  const { id: orderId, fulfillment_id: fulfillmentId } = req.params

  await markOrderFulfillmentAsDeliveredWorkflow(req.scope).run({
    input: { orderId, fulfillmentId },
  })

  const order = await refetchEntity({
    entity: "order",
    idOrFilter: orderId,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ order })
}
