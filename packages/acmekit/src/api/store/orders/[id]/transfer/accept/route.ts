import { AuthenticatedAcmeKitRequest, AcmeKitResponse } from "@acmekit/framework"
import { HttpTypes } from "@acmekit/framework/types"
import {
  acceptOrderTransferWorkflow,
  getOrderDetailWorkflow,
} from "@acmekit/core-flows"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.StoreAcceptOrderTransfer,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.StoreOrderResponse>
) => {
  await acceptOrderTransferWorkflow(req.scope).run({
    input: {
      order_id: req.params.id,
      token: req.validatedBody.token,
    },
  })

  const { result } = await getOrderDetailWorkflow(req.scope).run({
    input: {
      fields: req.queryConfig.fields,
      order_id: req.params.id,
    },
  })

  res.status(200).json({ order: result as HttpTypes.StoreOrder })
}
