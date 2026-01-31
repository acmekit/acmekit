import { AcmeKitNextFunction, AcmeKitRequest } from "../types"

export function setContext(context: Record<string, any>) {
  return async (req: AcmeKitRequest, _, next: AcmeKitNextFunction) => {
    const ctx: Record<string, any> = { ...(req.context || {}) }

    for (const [contextKey, contextValue] of Object.entries(context || {})) {
      let valueToApply = contextValue

      if (typeof contextValue === "function") {
        valueToApply = await contextValue(req, ctx)
      }

      ctx[contextKey] = valueToApply
    }

    req.context = ctx

    return next()
  }
}
