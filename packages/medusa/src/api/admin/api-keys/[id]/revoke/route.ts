import { revokeApiKeysWorkflow } from "/core-flows"
import {
  AuthenticatedMedusaRequest,
  AcmeKitResponse,
} from "/framework/http"
import { refetchApiKey } from "../../helpers"
import { HttpTypes } from "/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminRevokeApiKey,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminApiKeyResponse>
) => {
  await revokeApiKeysWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      revoke: {
        ...req.validatedBody,
        revoked_by: req.auth_context.actor_id,
      },
    },
  })

  const apiKey = await refetchApiKey(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ api_key: apiKey })
}
