import {
  ApiKeyType,
  ContainerRegistrationKeys,
  isPresent,
  AcmeKitError,
  CLIENT_API_KEY_HEADER,
} from "@acmekit/utils"
import type {
  AcmeKitNextFunction,
  AcmeKitResponse,
  AcmeKitClientKeyRequest,
} from "../../http"

export async function ensureClientApiKeyMiddleware(
  req: AcmeKitClientKeyRequest,
  _: AcmeKitResponse,
  next: AcmeKitNextFunction
) {
  const clientApiKey = req.get(CLIENT_API_KEY_HEADER)

  if (!isPresent(clientApiKey)) {
    const error = new AcmeKitError(
      AcmeKitError.Types.NOT_ALLOWED,
      `Client API key required in the request header: ${CLIENT_API_KEY_HEADER}. You can manage your keys in settings in the dashboard.`
    )
    return next(error)
  }

  let apiKey
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const { data } = await query.graph(
      {
        entity: "api_key",
        fields: ["id", "token", "revoked_at"],
        filters: {
          token: clientApiKey,
          type: ApiKeyType.CLIENT,
        },
      },
      {
        cache: {
          enable: true,
        },
      }
    )

    if (data.length) {
      const now = new Date()
      const cachedApiKey = data[0]
      const isRevoked =
        !!cachedApiKey.revoked_at && new Date(cachedApiKey.revoked_at) <= now

      if (!isRevoked) {
        apiKey = cachedApiKey
      }
    }
  } catch (e) {
    return next(e)
  }

  if (!apiKey) {
    try {
      throw new AcmeKitError(
        AcmeKitError.Types.NOT_ALLOWED,
        `A valid client API key is required to proceed with the request`
      )
    } catch (e) {
      return next(e)
    }
  }

  req.client_api_key_context = {
    key: apiKey.token,
  }

  return next()
}
