import { cancelOrderExchangeWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { AdminPostCancelExchangeReqSchemaType } from "../../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminPostCancelExchangeReqSchemaType>,
  res: AcmeKitResponse<HttpTypes.AdminExchangeResponse>
) => {
  const { id } = req.params

  const workflow = cancelOrderExchangeWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      ...req.validatedBody,
      exchange_id: id,
      canceled_by: req.auth_context.actor_id,
    },
  })

  res.status(200).json({ exchange: result as HttpTypes.AdminExchange })
}
