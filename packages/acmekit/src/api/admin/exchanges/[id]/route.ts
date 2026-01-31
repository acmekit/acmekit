import { HttpTypes } from "@acmekit/framework/types"
import { AcmeKitError } from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntity,
} from "@acmekit/framework/http"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.AdminExchangeResponse>
) => {
  const exchange = await refetchEntity({
    entity: "order_exchange",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  if (!exchange) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Exchange with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ exchange })
}
