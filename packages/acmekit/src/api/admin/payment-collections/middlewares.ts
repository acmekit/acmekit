import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@acmekit/framework"
import { MiddlewareRoute } from "@acmekit/framework/http"
import { PolicyOperation } from "@acmekit/framework/utils"
import * as queryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreatePaymentCollection,
  AdminGetPaymentCollectionParams,
  AdminMarkPaymentCollectionPaid,
} from "./validators"

export const adminPaymentCollectionsMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/payment-collections/*",
    policies: [
      {
        resource: Entities.payment_collection,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/payment-collections",
    middlewares: [
      validateAndTransformBody(AdminCreatePaymentCollection),
      validateAndTransformQuery(
        AdminGetPaymentCollectionParams,
        queryConfig.retrievePaymentCollectionTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.payment_collection,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/payment-collections/:id/mark-as-paid",
    middlewares: [
      validateAndTransformBody(AdminMarkPaymentCollectionPaid),
      validateAndTransformQuery(
        AdminGetPaymentCollectionParams,
        queryConfig.retrievePaymentCollectionTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.payment_collection,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/payment-collections/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.payment_collection,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
