import type {
  AcmeKitNextFunction,
  AcmeKitRequest,
  AcmeKitResponse,
} from "../types"

export function applyParamsAsFilters(mappings: { [param: string]: string }) {
  return async function paramsAsFiltersMiddleware(
    req: AcmeKitRequest,
    _: AcmeKitResponse,
    next: AcmeKitNextFunction
  ) {
    for (const [param, paramValue] of Object.entries(req.params)) {
      if (mappings[param]) {
        req.filterableFields[mappings[param]] = paramValue
      }
    }

    return next()
  }
}
