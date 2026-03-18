import { MiddlewareRoute } from "/framework/http"

export const storeLocalesRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/client/locales",
    middlewares: [],
  },
]
