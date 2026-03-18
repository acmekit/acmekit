import { MiddlewareRoute } from "@acmekit/framework/http"

export const storeLocalesRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/client/locales",
    middlewares: [],
  },
]
