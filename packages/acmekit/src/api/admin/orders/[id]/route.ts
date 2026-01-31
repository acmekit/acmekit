import {
  getOrderDetailWorkflow,
  updateOrderWorkflow,
} from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { AdminOrder, HttpTypes } from "@acmekit/framework/types"
import { ContainerRegistrationKeys } from "@acmekit/framework/utils"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminGetOrderDetailsParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminOrderResponse>
) => {
  const workflow = getOrderDetailWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      fields: req.queryConfig.fields,
      order_id: req.params.id,
      version: req.validatedQuery.version as number,
    },
  })

  res.status(200).json({ order: result as HttpTypes.AdminOrder })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateOrder,
    HttpTypes.AdminGetOrderDetailsParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminOrderResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  await updateOrderWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      user_id: req.auth_context.actor_id,
      id: req.params.id,
    },
  })

  const result = await query.graph({
    entity: "order",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ order: result.data[0] as AdminOrder })
}
