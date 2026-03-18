import type {
  AcmeKitNextFunction,
  AcmeKitRequest,
  AcmeKitResponse,
} from "../types"

export function clearFiltersByKey(keys: string[]) {
  return async function clearFiltersByKeyMiddleware(
    req: AcmeKitRequest,
    _: AcmeKitResponse,
    next: AcmeKitNextFunction
  ) {
    keys.forEach((key) => {
      delete req.filterableFields[key]
    })

    return next()
  }
}
