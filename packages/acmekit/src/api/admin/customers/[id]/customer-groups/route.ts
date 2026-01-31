import { linkCustomerGroupsToCustomerWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import { HttpTypes } from "@acmekit/framework/types"

import { refetchCustomer } from "../../helpers"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminBatchLink,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminCustomerResponse>
) => {
  const { id } = req.params
  const { add, remove } = req.validatedBody

  const workflow = linkCustomerGroupsToCustomerWorkflow(req.scope)
  await workflow.run({
    input: {
      id,
      add,
      remove,
    },
  })

  const customer = await refetchCustomer(id, req.scope, req.queryConfig.fields)

  res.status(200).json({ customer: customer })
}
