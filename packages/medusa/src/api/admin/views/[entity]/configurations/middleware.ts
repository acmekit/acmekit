import {
  AcmeKitNextFunction,
  AcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { ContainerRegistrationKeys } from "@acmekit/framework/utils"
import ViewConfigurationsFeatureFlag from "../../../../../feature-flags/view-configurations"

export const ensureViewConfigurationsEnabled = async (
  req: AcmeKitRequest,
  res: AcmeKitResponse,
  next: AcmeKitNextFunction
) => {
  const flagRouter = req.scope.resolve(
    ContainerRegistrationKeys.FEATURE_FLAG_ROUTER
  ) as any

  if (!flagRouter.isFeatureEnabled(ViewConfigurationsFeatureFlag.key)) {
    res.status(404).json({
      type: "not_found",
      message: "Route not found",
    })
    return
  }

  next()
}
