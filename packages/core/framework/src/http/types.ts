import type {
  ZodNullable,
  ZodObject,
  ZodOptional,
  ZodRawShape,
} from "@acmekit/deps/zod"
import type { NextFunction, Request, Response } from "express"

import { FindConfig, RequestQueryFields } from "@acmekit/types"

/** @internal Kernel-only; pricing context type removed with commerce. */
export type AcmeKitPricingContext = Record<string, unknown>
import { AcmeKitContainer } from "../container"
import { PolicyAction } from "./middlewares/check-permissions"
import { RestrictedFields } from "./utils/restricted-fields"

/**
 * List of all the supported HTTP methods
 */
export const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
] as const

export type RouteVerb = (typeof HTTP_METHODS)[number]
export type MiddlewareVerb = "USE" | "ALL" | RouteVerb

type SyncRouteHandler = (req: AcmeKitRequest, res: AcmeKitResponse) => void

export type AsyncRouteHandler = (
  req: AcmeKitRequest,
  res: AcmeKitResponse
) => Promise<void>

export type RouteHandler = SyncRouteHandler | AsyncRouteHandler

export type MiddlewareFunction =
  | AcmeKitRequestHandler
  | ((...args: any[]) => any)

export type AcmeKitErrorHandlerFunction = (
  error: any,
  req: AcmeKitRequest,
  res: AcmeKitResponse,
  next: AcmeKitNextFunction
) => Promise<void> | void

export type ParserConfigArgs = {
  sizeLimit?: string | number | undefined
  preserveRawBody?: boolean
}

export type ParserConfig = false | ParserConfigArgs

export type MiddlewareRoute = {
  /**
   * @deprecated. Instead use {@link MiddlewareRoute.methods}
   */
  method?: MiddlewareVerb | MiddlewareVerb[]
  methods?: MiddlewareVerb[]
  matcher: string | RegExp
  bodyParser?: ParserConfig
  additionalDataValidator?: ZodRawShape
  middlewares?: MiddlewareFunction[]
  /** @ignore */
  policies?:
    | { resource: string; operation: string }
    | Array<{ resource: string; operation: string | string[] }>
}

export type MiddlewaresConfig = {
  errorHandler?: false | AcmeKitErrorHandlerFunction
  routes?: MiddlewareRoute[]
}

/**
 * Route descriptor refers represents a route either scanned
 * from the filesystem or registered manually. It does not
 * represent a middleware
 */
export type RouteDescriptor = {
  matcher: string
  method: RouteVerb
  handler: RouteHandler
  optedOutOfAuth: boolean
  isRoute: true
  routeType?: "admin" | "store" | "auth"
  absolutePath?: string
  relativePath?: string
  shouldAppendAdminCors: boolean
  shouldAppendStoreCors: boolean
  shouldAppendAuthCors: boolean
}

/**
 * Represents a middleware
 */
export type MiddlewareDescriptor = {
  matcher: string
  methods?: MiddlewareVerb | MiddlewareVerb[]
  handler: MiddlewareFunction
  policies?:
    | { resource: string; operation: string }
    | Array<{ resource: string; operation: string | string[] }>
}

export type BodyParserConfigRoute = {
  matcher: string
  methods: MiddlewareVerb | MiddlewareVerb[]
  config: ParserConfig
}

export type AdditionalDataValidatorRoute = {
  matcher: string
  methods: MiddlewareVerb | MiddlewareVerb[]
  schema: ZodRawShape
  validator: ZodOptional<ZodNullable<ZodObject<any, any>>>
}

export type GlobalMiddlewareDescriptor = {
  config?: MiddlewaresConfig
}

export interface AcmeKitRequest<
  Body = unknown,
  QueryFields = Record<string, unknown>
> extends Request<{ [key: string]: string }, any, Body> {
  validatedBody: Body
  validatedQuery: RequestQueryFields & QueryFields
  /**
   * TODO: shouldn't this correspond to returnable fields instead of allowed fields? also it is used by the cleanResponseData util
   */
  allowedProperties: string[]
  /**
   * An object containing the select, relation, skip, take and order to be used with acmekit internal services
   */
  listConfig: FindConfig<unknown>
  /**
   * An object containing the select, relation to be used with acmekit internal services
   */
  retrieveConfig: FindConfig<unknown>

  /**
   * An object containing fields and variables to be used with the remoteQuery
   *
   * @since 2.2.0
   */
  queryConfig: {
    fields: string[]
    pagination: { order?: Record<string, string>; skip: number; take?: number }
    withDeleted?: boolean
  }

  /**
   * @deprecated Use {@link queryConfig} instead.
   */
  remoteQueryConfig: AcmeKitRequest["queryConfig"]

  /**
   * An object containing the fields that are filterable e.g `{ id: Any<String> }`
   */
  filterableFields: QueryFields
  includes?: Record<string, boolean>

  /**
   * An array of fields and relations that are allowed to be queried, this can be set by the
   * consumer as part of a middleware and it will take precedence over the req.allowed set
   * by the api
   */
  allowed?: string[]
  errors: string[]
  scope: AcmeKitContainer
  session?: any
  rawBody?: any
  requestId?: string

  restrictedFields?: RestrictedFields

  /**
   * An object that carries the context that is used to calculate prices for variants
   */
  pricingContext?: AcmeKitPricingContext
  /**
   * A generic context object that can be used across the request lifecycle
   */
  context?: Record<string, any>

  /**
   * Custom validator to validate the `additional_data` property in
   * requests that allows for additional_data
   */
  additionalDataValidator?: ZodOptional<ZodNullable<ZodObject<any, any>>>

  /**
   * The locale for the current request, resolved from:
   * 1. Query parameter `?locale=`
   * 2. x-acmekit-locale header
   */
  locale?: string
}

export interface AuthContext {
  actor_id: string
  actor_type: string
  auth_identity_id: string
  app_metadata: Record<string, unknown>
  user_metadata: Record<string, unknown>
}

/** Context attached when request is authenticated via client API key. */
export interface ClientApiKeyContext {
  key: string
}

export interface AuthenticatedAcmeKitRequest<
  Body = unknown,
  QueryFields = Record<string, unknown>
> extends AcmeKitRequest<Body, QueryFields> {
  auth_context: AuthContext
  client_api_key_context?: ClientApiKeyContext
  policies?: PolicyAction[]
}

/** Request that requires a valid client API key (e.g. public API routes). */
export interface AcmeKitClientKeyRequest<
  Body = unknown,
  QueryFields = Record<string, unknown>
> extends AcmeKitRequest<Body, QueryFields> {
  auth_context?: AuthContext
  client_api_key_context: ClientApiKeyContext
  policies?: PolicyAction | PolicyAction[]
}

export type AcmeKitResponse<Body = unknown> = Response<Body>

export type AcmeKitNextFunction = NextFunction

export type AcmeKitRequestHandler<Body = unknown, Res = unknown> = (
  req: AcmeKitRequest<Body>,
  res: AcmeKitResponse<Res>,
  next: AcmeKitNextFunction
) => Promise<void> | void
