import {
  deleteApiKeysWorkflow,
  updateApiKeysWorkflow,
} from "@acmekit/core-flows"
import {
  AuthenticatedMedusaRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import { refetchApiKey } from "../helpers"
import { AcmeKitError } from "@acmekit/framework/utils"
import { HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.AdminApiKeyResponse>
) => {
  const apiKey = await refetchApiKey(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  if (!apiKey) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `API Key with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ api_key: apiKey })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateApiKey,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminApiKeyResponse>
) => {
  await updateApiKeysWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const apiKey = await refetchApiKey(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ api_key: apiKey })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: AcmeKitResponse<HttpTypes.AdminApiKeyDeleteResponse>
) => {
  const id = req.params.id

  await deleteApiKeysWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "api_key",
    deleted: true,
  })
}
