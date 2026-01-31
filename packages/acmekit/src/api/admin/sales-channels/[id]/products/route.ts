import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import { linkProductsToSalesChannelWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import { refetchSalesChannel } from "../../helpers"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminBatchLink,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminSalesChannelResponse>
) => {
  const { id } = req.params
  const { add, remove } = req.validatedBody

  const workflow = linkProductsToSalesChannelWorkflow(req.scope)
  await workflow.run({
    input: {
      id,
      add,
      remove,
    },
  })

  const salesChannel = await refetchSalesChannel(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )
  res.status(200).json({ sales_channel: salesChannel })
}
