import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { AdminUpdateViewConfigurationType } from "../validators"
import { HttpTypes } from "@acmekit/framework/types"
import { AcmeKitError, Modules } from "@acmekit/framework/utils"
import { updateViewConfigurationWorkflow } from "@acmekit/core-flows"

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminGetViewConfigurationParams>,
  res: AcmeKitResponse<HttpTypes.AdminViewConfigurationResponse>
) => {
  const settingsService = req.scope.resolve(Modules.SETTINGS)

  const viewConfiguration = await settingsService.retrieveViewConfiguration(
    req.params.id,
    req.queryConfig
  )

  if (
    viewConfiguration.user_id &&
    viewConfiguration.user_id !== req.auth_context.actor_id &&
    !req.auth_context.app_metadata?.admin
  ) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_ALLOWED,
      "You don't have access to this view configuration"
    )
  }

  res.json({ view_configuration: viewConfiguration })
}

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminUpdateViewConfigurationType>,
  res: AcmeKitResponse<HttpTypes.AdminViewConfigurationResponse>
) => {
  const settingsService = req.scope.resolve(Modules.SETTINGS)

  // Single retrieval for permission check
  const existing = await settingsService.retrieveViewConfiguration(
    req.params.id,
    { select: ["id", "user_id", "is_system_default"] }
  )

  if (existing.user_id && existing.user_id !== req.auth_context.actor_id) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_ALLOWED,
      "You can only update your own view configurations"
    )
  }

  const input = {
    id: req.params.id,
    ...req.validatedBody,
  }

  const { result } = await updateViewConfigurationWorkflow(req.scope).run({
    input,
  })

  res.json({ view_configuration: result })
}

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminViewConfigurationDeleteResponse>
) => {
  const settingsService = req.scope.resolve(Modules.SETTINGS)

  // Retrieve existing to check permissions
  const existing = await settingsService.retrieveViewConfiguration(
    req.params.id,
    { select: ["id", "user_id", "is_system_default", "entity", "name"] }
  )

  if (existing.user_id && existing.user_id !== req.auth_context.actor_id) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_ALLOWED,
      "You can only delete your own view configurations"
    )
  }

  await settingsService.deleteViewConfigurations(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "view_configuration",
    deleted: true,
  })
}
