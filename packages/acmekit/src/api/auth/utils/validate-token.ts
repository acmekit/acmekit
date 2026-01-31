import {
  AuthenticatedAcmeKitRequest,
  getAuthContextFromJwtToken,
  AcmeKitNextFunction,
  AcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { ConfigModule, IAuthModuleService } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  AcmeKitError,
  Modules,
} from "@acmekit/framework/utils"
import { HttpTypes } from "@acmekit/types"

export interface UpdateProviderJwtPayload {
  entity_id: string
  actor_type: string
  provider: string
}

// Middleware to validate that a token is valid
export const validateToken = () => {
  return async (
    req: AcmeKitRequest<HttpTypes.AdminUpdateProvider>,
    res: AcmeKitResponse,
    next: AcmeKitNextFunction
  ) => {
    const { actor_type, auth_provider } = req.params

    const req_ = req as AuthenticatedAcmeKitRequest

    const { http } = req_.scope.resolve<ConfigModule>(
      ContainerRegistrationKeys.CONFIG_MODULE
    ).projectConfig

    const token = getAuthContextFromJwtToken(
      req.headers.authorization,
      http.jwtSecret!,
      ["bearer"],
      [actor_type],
      http.jwtPublicKey,
      http.jwtVerifyOptions ?? http.jwtOptions
    ) as UpdateProviderJwtPayload | null

    const errorObject = new AcmeKitError(
      AcmeKitError.Types.UNAUTHORIZED,
      `Invalid token`
    )

    if (!token) {
      return next(errorObject)
    }

    const authModule = req.scope.resolve<IAuthModuleService>(Modules.AUTH)

    if (!token?.entity_id) {
      return next(errorObject)
    }

    const [providerIdentity] = await authModule.listProviderIdentities(
      {
        entity_id: token.entity_id,
        provider: auth_provider,
      },
      {
        select: [
          "provider_metadata",
          "auth_identity_id",
          "entity_id",
          "user_metadata",
        ],
      }
    )

    if (!providerIdentity) {
      return next(errorObject)
    }

    req_.auth_context = {
      actor_type,
      auth_identity_id: providerIdentity.auth_identity_id!,
      actor_id: providerIdentity.entity_id,
      app_metadata: {},
      user_metadata: providerIdentity.user_metadata ?? {},
    }

    return next()
  }
}
