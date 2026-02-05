import { isPresent } from "@acmekit/framework/utils"
import { NextFunction } from "express"
import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"

const CLIENT_API_KEY_HEADER = "x-client-api-key"

/**
 * If a client API key is passed in the header, attach it to the request for use by routes.
 */
export async function maybeAttachClientApiKey(
  req: AcmeKitRequest & { clientApiKey?: string },
  _res: AcmeKitResponse,
  next: NextFunction
) {
  const clientKey = req.get(CLIENT_API_KEY_HEADER)

  if (isPresent(clientKey)) {
    req.clientApiKey = clientKey
  }

  next()
}
