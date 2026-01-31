import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import {
  StoreGetCustomerParamsType,
} from "../validators"
import { refetchCustomer } from "../helpers"
import { AcmeKitError } from "@acmekit/framework/utils"
import { updateCustomersWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<StoreGetCustomerParamsType>,
  res: AcmeKitResponse<HttpTypes.StoreCustomerResponse>
) => {
  const id = req.auth_context.actor_id
  const customer = await refetchCustomer(id, req.scope, req.queryConfig.fields)

  if (!customer) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Customer with id: ${id} was not found`
    )
  }

  res.json({ customer })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.StoreUpdateCustomer,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.StoreCustomerResponse>
) => {
  const customerId = req.auth_context.actor_id
  await updateCustomersWorkflow(req.scope).run({
    input: {
      selector: { id: customerId },
      update: req.validatedBody,
    },
  })

  const customer = await refetchCustomer(
    customerId,
    req.scope,
    req.queryConfig.fields
  )
  res.status(200).json({ customer })
}
