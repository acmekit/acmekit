import * as QueryConfig from "./query-config"

import {
  StoreCreateCustomer,
  StoreCreateCustomerAddress,
  StoreGetCustomerAddressesParams,
  StoreGetCustomerAddressParams,
  StoreGetCustomerParams,
  StoreUpdateCustomer,
  StoreUpdateCustomerAddress,
} from "./validators"

import { MiddlewareRoute } from "/framework/http"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "/framework"

export const storeCustomerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/client/customers",
    middlewares: [
      authenticate("customer", ["session", "bearer"], {
        allowUnregistered: true,
      }),
      validateAndTransformBody(StoreCreateCustomer),
      validateAndTransformQuery(
        StoreGetCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "ALL",
    matcher: "/client/customers/me*",
    middlewares: [authenticate("customer", ["session", "bearer"])],
  },
  {
    method: ["GET"],
    matcher: "/client/customers/me",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/client/customers/me",
    middlewares: [
      validateAndTransformBody(StoreUpdateCustomer),
      validateAndTransformQuery(
        StoreGetCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/client/customers/me/addresses",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCustomerAddressesParams,
        QueryConfig.listAddressesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/client/customers/me/addresses",
    middlewares: [
      validateAndTransformBody(StoreCreateCustomerAddress),
      validateAndTransformQuery(
        StoreGetCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/client/customers/me/addresses/:address_id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCustomerAddressParams,
        QueryConfig.retrieveAddressTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/client/customers/me/addresses/:address_id",
    middlewares: [
      validateAndTransformBody(StoreUpdateCustomerAddress),
      validateAndTransformQuery(
        StoreGetCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/client/customers/me/addresses/:address_id",
    middlewares: [
      validateAndTransformQuery(
        StoreGetCustomerAddressParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
