import { transferCartCustomerWorkflowId } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"

import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { Modules } from "@acmekit/framework/utils"
import { AdditionalData } from "@acmekit/types"
import { refetchCart } from "../../helpers"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdditionalData, HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.StoreCartResponse>
) => {
  const we = req.scope.resolve(Modules.WORKFLOW_ENGINE)

  await we.run(transferCartCustomerWorkflowId, {
    input: {
      id: req.params.id,
      customer_id: req.auth_context?.actor_id,
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
