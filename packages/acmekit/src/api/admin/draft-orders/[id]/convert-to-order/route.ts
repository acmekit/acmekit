import { convertDraftOrderWorkflow } from "@acmekit/core-flows"
import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"
import { ContainerRegistrationKeys } from "@acmekit/framework/utils"
import { HttpTypes } from "@acmekit/types"

export const POST = async (
  req: AcmeKitRequest<HttpTypes.AdminDraftOrderParams>, 
  res: AcmeKitResponse<HttpTypes.AdminOrderResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  await convertDraftOrderWorkflow(req.scope).run({
    input: {
      id: req.params.id,
    },
  })

  const result = await query.graph({
    entity: "orders",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ order: result.data[0] as HttpTypes.AdminOrder })
}
