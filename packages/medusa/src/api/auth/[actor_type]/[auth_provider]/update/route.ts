import {
  AuthenticatedMedusaRequest,
  AcmeKitResponse,
} from "/framework/http"
import { IAuthModuleService } from "/framework/types"
import { AcmeKitError, Modules } from "/framework/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest,
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
