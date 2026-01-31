import type {
  AcmeKitNextFunction,
  AcmeKitRequest,
  AcmeKitResponse,
  MiddlewareFunction,
  RouteHandler,
} from "../types"

export const wrapHandler = <T extends RouteHandler | MiddlewareFunction>(
  fn: T
) => {
  async function wrappedHandler(
    req: AcmeKitRequest,
    res: AcmeKitResponse,
    next: AcmeKitNextFunction
  ) {
    const req_ = req as AcmeKitRequest & { errors?: Error[] }
    if (req_?.errors?.length) {
      return res.status(400).json({
        errors: req_.errors,
        message:
          "Provided request body contains errors. Please check the data and retry the request",
      })
    }

    try {
      return await fn(req, res, next)
    } catch (err) {
      next(err)
    }
  }

  if (fn.name) {
    Object.defineProperty(wrappedHandler, "name", { value: fn.name })
  }
  return wrappedHandler as T
}
