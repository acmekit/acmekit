import {
  beginReceiveReturnWorkflow,
  cancelReturnReceiveWorkflow,
} from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  promiseAll,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminInitiateReceiveReturn,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminOrderReturnResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const orderModuleService = req.scope.resolve(Modules.ORDER)

  const { id } = req.params

  const workflow = beginReceiveReturnWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      ...req.validatedBody,
      return_id: id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return",
    variables: {
      id: result.return_id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.queryConfig.fields,
  })

  const [order, orderReturn] = await promiseAll([
    orderModuleService.retrieveOrder(result.order_id),
    remoteQuery(queryObject),
  ])

  res.json({
    order,
    return: orderReturn[0],
  })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminReturnDeleteResponse>
) => {
  const { id } = req.params

  await cancelReturnReceiveWorkflow(req.scope).run({
    input: {
      return_id: id,
    },
  })

  res.status(200).json({
    id,
    object: "return",
    deleted: true,
  })
}
