import { raw } from "express"
import { z } from "../../../deps/zod"
import { AcmeKitNextFunction, AcmeKitRequest, AcmeKitResponse } from "../../types"
import { defineMiddlewares } from "../../utils/define-middlewares"
import {
  customersCreateMiddlewareMock,
  customersCreateMiddlewareValidatorMock,
  customersGlobalMiddlewareMock,
  storeGlobalMiddlewareMock,
} from "../mocks"

const customersGlobalMiddleware = (
  req: AcmeKitRequest,
  res: AcmeKitResponse,
  next: AcmeKitNextFunction
) => {
  customersGlobalMiddlewareMock()
  next()
}

const customersCreateMiddleware = (
  req: AcmeKitRequest,
  res: AcmeKitResponse,
  next: AcmeKitNextFunction
) => {
  if (req.additionalDataValidator) {
    customersCreateMiddlewareValidatorMock()
  }
  customersCreateMiddlewareMock()
  next()
}

const storeGlobal = (
  req: AcmeKitRequest,
  res: AcmeKitResponse,
  next: AcmeKitNextFunction
) => {
  storeGlobalMiddlewareMock()
  next()
}

const middlewares = defineMiddlewares([
  {
    matcher: "/customers",
    middlewares: [customersGlobalMiddleware],
  },
  {
    method: ["ALL"],
    matcher: "/v1*",
    bodyParser: {
      sizeLimit: "500kb",
    },
    middlewares: [],
  },
  {
    method: "POST",
    matcher: "/customers",
    additionalDataValidator: {
      group_id: z.string(),
    },
    middlewares: [customersCreateMiddleware],
  },
  {
    matcher: "/store/*",
    middlewares: [storeGlobal],
  },
  {
    matcher: "/webhooks",
    bodyParser: {
      preserveRawBody: true,
    },
  },
  {
    matcher: "/webhooks/*",
    method: "POST",
    bodyParser: false,
    middlewares: [raw({ type: "application/json" })],
  },
])

export default middlewares
