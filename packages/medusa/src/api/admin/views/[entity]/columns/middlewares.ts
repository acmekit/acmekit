import { validateAndTransformQuery } from "@acmekit/framework"
import { MiddlewareRoute } from "@acmekit/framework/http"
import { AdminGetColumnsParams } from "./validators"
import { ensureViewConfigurationsEnabled } from "../configurations/middleware"

export const columnRoutesMiddlewares: MiddlewareRoute[] = [
  // Apply feature flag check to all column routes
  {
    method: ["GET", "POST"],
    matcher: "/admin/views/*/columns",
    middlewares: [ensureViewConfigurationsEnabled],
  },
  {
    method: ["GET"],
    matcher: "/admin/views/:entity/columns",
    middlewares: [validateAndTransformQuery(AdminGetColumnsParams, {})],
  },
]
