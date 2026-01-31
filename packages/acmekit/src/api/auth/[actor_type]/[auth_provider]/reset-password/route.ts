import { generateResetPasswordTokenWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { ContainerRegistrationKeys } from "@acmekit/framework/utils"
import { ResetPasswordRequestType } from "../../../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<ResetPasswordRequestType>,
  res: AcmeKitResponse
) => {
  const { auth_provider, actor_type } = req.params
  const { identifier, metadata } = req.validatedBody

  const { http } = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  ).projectConfig

  await generateResetPasswordTokenWorkflow(req.scope).run({
    input: {
      entityId: identifier,
      actorType: actor_type,
      provider: auth_provider,
      secret: http.jwtSecret!,
      jwtOptions: http.jwtOptions,
      metadata,
    },
    throwOnError: false, // we don't want to throw on error to avoid leaking information about non-existing identities
  })

  res.sendStatus(201)
}
