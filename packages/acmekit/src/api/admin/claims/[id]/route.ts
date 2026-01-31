import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntity,
} from "@acmekit/framework/http"
import { AcmeKitError } from "@acmekit/framework/utils"
import { AdminClaimResponse, HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<{}, HttpTypes.SelectParams>,
  res: AcmeKitResponse<AdminClaimResponse>
) => {
  const claim = await refetchEntity({
    entity: "order_claim",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  if (!claim) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Claim with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ claim })
}
