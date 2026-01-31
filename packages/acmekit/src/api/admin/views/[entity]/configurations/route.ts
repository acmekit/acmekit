import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { AdminCreateViewConfigurationType } from "./validators"
import { HttpTypes } from "@acmekit/framework/types"
import { AcmeKitError, Modules } from "@acmekit/framework/utils"
import { createViewConfigurationWorkflow } from "@acmekit/core-flows"

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminGetViewConfigurationsParams>,
  res: AcmeKitResponse<HttpTypes.AdminViewConfigurationListResponse>
) => {
  const settingsService = req.scope.resolve(Modules.SETTINGS)

  const filters = {
    ...req.filterableFields,
    entity: req.params.entity,
    $or: [{ user_id: req.auth_context.actor_id }, { is_system_default: true }],
  }

  const [viewConfigurations, count] =
    await settingsService.listAndCountViewConfigurations(
      filters,
      req.queryConfig
    )

  res.json({
    view_configurations: viewConfigurations,
    count,
    offset: req.queryConfig.pagination?.skip || 0,
    limit: req.queryConfig.pagination?.take || 20,
  })
}

/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminCreateViewConfigurationType>,
  res: AcmeKitResponse<HttpTypes.AdminViewConfigurationResponse>
) => {
  // Validate: name is required unless creating a system default
  if (!req.body.is_system_default && !req.body.name) {
    throw new AcmeKitError(
      AcmeKitError.Types.INVALID_DATA,
      "Name is required unless creating a system default view"
    )
  }

  const input = {
    ...req.body,
    entity: req.params.entity,
    user_id: req.body.is_system_default ? null : req.auth_context.actor_id,
  }

  const { result } = await createViewConfigurationWorkflow(req.scope).run({
    input,
  })

  return res.json({ view_configuration: result })
}
