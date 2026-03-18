export function AcmeKitContext() {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    target.AcmeKitContextIndex_ ??= {}
    target.AcmeKitContextIndex_[propertyKey] = parameterIndex
  }
}

AcmeKitContext.getIndex = function (
  target: any,
  propertyKey: string
): number | undefined {
  return target.AcmeKitContextIndex_?.[propertyKey]
}

export const AcmeKitContextType = "AcmeKitContext"
