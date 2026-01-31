import { normalizeLocale } from "@acmekit/utils"
import type {
  AcmeKitNextFunction,
  AcmeKitRequest,
  AcmeKitResponse,
} from "../types"

const CONTENT_LANGUAGE_HEADER = "x-acmekit-locale"

/**
 * Middleware that resolves the locale for the current request.
 *
 * Resolution order:
 * 1. Query parameter `?locale=en-US`
 * 2. x-acmekit-locale header
 *
 * The resolved locale is set on `req.locale`.
 */
export async function applyLocale(
  req: AcmeKitRequest,
  _: AcmeKitResponse,
  next: AcmeKitNextFunction
) {
  // 1. Check query parameter
  const queryLocale = req.query.locale as string | undefined
  if (queryLocale) {
    req.locale = normalizeLocale(queryLocale)
    delete req.query.locale
    return next()
  }

  // 2. Check x-acmekit-locale header
  const headerLocale = req.get(CONTENT_LANGUAGE_HEADER)
  if (headerLocale) {
    req.locale = normalizeLocale(headerLocale)
    return next()
  }

  return next()
}
