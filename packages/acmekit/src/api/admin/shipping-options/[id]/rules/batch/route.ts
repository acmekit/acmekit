import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { BatchMethodRequest, HttpTypes } from "@acmekit/framework/types"
import { refetchBatchRules } from "../../../helpers"
import { batchShippingOptionRulesWorkflow } from "@acmekit/core-flows"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    BatchMethodRequest<
      HttpTypes.AdminCreateShippingOptionRule,
      HttpTypes.AdminUpdateShippingOptionRule
    >,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminUpdateShippingOptionRulesResponse>
) => {
  const id = req.params.id
  const { result } = await batchShippingOptionRulesWorkflow(req.scope).run({
    input: {
      create: req.validatedBody.create?.map((c) => ({
        ...c,
        shipping_option_id: id,
      })),
      update: req.validatedBody.update,
      delete: req.validatedBody.delete,
    },
  })

  const batchResults = await refetchBatchRules(
    result,
    req.scope,
    req.queryConfig.fields
  )

  res
    .status(200)
    .json(
      batchResults as unknown as HttpTypes.AdminUpdateShippingOptionRulesResponse
    )
}
