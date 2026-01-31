import {
  cancelBeginOrderExchangeWorkflow,
  confirmExchangeRequestWorkflow,
} from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { defaultAdminDetailsReturnFields } from "../../../returns/query-config"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<{}, HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.AdminExchangeRequestResponse>
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await confirmExchangeRequestWorkflow(req.scope).run({
    input: {
      exchange_id: id,
      confirmed_by: req.auth_context.actor_id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_exchange",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.queryConfig.fields,
  })

  const [orderExchange] = await remoteQuery(queryObject, {
    throwIfKeyNotFound: true,
  })

  let orderReturn
  if (orderExchange.return_id) {
    const [orderReturnData] = await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: "return",
        variables: {
          id: orderExchange.return_id,
        },
        fields: defaultAdminDetailsReturnFields,
      })
    )
    orderReturn = orderReturnData
  }

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    exchange: orderExchange,
    return: orderReturn,
  })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminExchangeDeleteResponse>
) => {
  const { id } = req.params

  await cancelBeginOrderExchangeWorkflow(req.scope).run({
    input: {
      exchange_id: id,
    },
  })

  res.status(200).json({
    id,
    object: "exchange",
    deleted: true,
  })
}
