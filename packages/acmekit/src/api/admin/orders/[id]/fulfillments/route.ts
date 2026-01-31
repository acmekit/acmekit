import { createOrderFulfillmentWorkflow } from "@acmekit/core-flows"
import { AdditionalData, HttpTypes } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreateOrderFulfillment & AdditionalData,
    HttpTypes.AdminGetOrderParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminOrderResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  await createOrderFulfillmentWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      order_id: req.params.id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)
  res.status(200).json({ order })
}
