import { createShipmentWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { refetchFulfillment } from "../../helpers"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreateFulfillmentShipment,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminFulfillmentResponse>
) => {
  const { id } = req.params

  await createShipmentWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      id,
      marked_shipped_by: req.auth_context.actor_id,
    },
  })

  const fulfillment = await refetchFulfillment(
    id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ fulfillment })
}
