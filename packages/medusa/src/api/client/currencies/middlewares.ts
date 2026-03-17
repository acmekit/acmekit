import { MiddlewareRoute } from "@medusajs/framework/http"
import { validateAndTransformQuery } from "@medusajs/framework"
import * as QueryConfig from "./query-config"
import { StoreGetCurrenciesParams, StoreGetCurrencyParams } from "./validators"

export const storeCurrencyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/client/currencies",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCurrenciesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/client/currencies/:code",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCurrencyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
