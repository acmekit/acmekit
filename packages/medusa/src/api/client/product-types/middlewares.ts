import { MiddlewareRoute } from "@medusajs/framework/http"
import { validateAndTransformQuery } from "@medusajs/framework"
import * as QueryConfig from "./query-config"

import { StoreProductTypesParams } from "./validators"

export const storeProductTypeRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/client/product-types",
    middlewares: [
      validateAndTransformQuery(
        StoreProductTypesParams,
        QueryConfig.listProductTypeConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/client/product-types/:id",
    middlewares: [
      validateAndTransformQuery(
        StoreProductTypesParams,
        QueryConfig.retrieveProductTypeConfig
      ),
    ],
  },
]
