import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { IAuthModuleService } from "@acmekit/framework/types"
import { AcmeKitError, Modules } from "@acmekit/framework/utils"

export const POST = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const { auth_provider } = req.params

  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)

  const updateData = {
    ...(req.body as Record<string, unknown>),
    entity_id: req.auth_context.actor_id, // comes from the validated token
  }

  const { authIdentity, success, error } = await authService.updateProvider(
    auth_provider,
    updateData
  )

  if (success && authIdentity) {
    return res.status(200).json({ success: true })
  }

  throw new AcmeKitError(AcmeKitError.Types.UNAUTHORIZED, error || "Unauthorized")
}
