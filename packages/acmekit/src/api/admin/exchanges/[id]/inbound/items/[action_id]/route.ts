import {
  removeItemReturnActionWorkflow,
  updateRequestItemReturnWorkflow,
} from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntity,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"
import { defaultAdminDetailsReturnFields } from "../../../../../returns/query-config"
import { AdminPostExchangesRequestItemsReturnActionReqSchemaType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminPostExchangesRequestItemsReturnActionReqSchemaType>,
  res: AcmeKitResponse<HttpTypes.AdminExchangeReturnResponse>
) => {
  const { id, action_id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [exchange] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "order_exchange",
      variables: {
        id,
      },
      fields: ["id", "return_id"],
    }),
    {
      throwIfKeyNotFound: true,
    }
  )

  const { result } = await updateRequestItemReturnWorkflow(req.scope).run({
    input: {
      data: { ...req.validatedBody },
      return_id: exchange.return_id,
      exchange_id: exchange.id,
      action_id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return",
    variables: {
      id: exchange.return_id,
    },
    fields: defaultAdminDetailsReturnFields,
  })

  const [orderReturn] = await remoteQuery(queryObject)

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    return: orderReturn,
  })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest<{}, HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.AdminExchangeReturnResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { id, action_id } = req.params

  const exchange = await refetchEntity({
    entity: "order_exchange",
    idOrFilter: id,
    scope: req.scope,
    fields: ["return_id"],
  })

  const { result: orderPreview } = await removeItemReturnActionWorkflow(
    req.scope
  ).run({
    input: {
      return_id: exchange.return_id,
      action_id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return",
    variables: {
      id: exchange.return_id,
    },
    fields: defaultAdminDetailsReturnFields,
  })

  const [orderReturn] = await remoteQuery(queryObject)

  res.json({
    order_preview: orderPreview as unknown as HttpTypes.AdminOrderPreview,
    return: orderReturn,
  })
}
