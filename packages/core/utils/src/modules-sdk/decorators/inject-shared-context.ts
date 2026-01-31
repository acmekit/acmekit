import { Context } from "@acmekit/types"
import { AcmeKitContextType } from "./context-parameter"

export function InjectSharedContext(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): void {
    if (!target.AcmeKitContextIndex_) {
      throw new Error(
        `To apply @InjectSharedContext you have to flag a parameter using @AcmeKitContext`
      )
    }

    const originalMethod = descriptor.value
    const argIndex = target.AcmeKitContextIndex_[propertyKey]

    descriptor.value = function (...args: any[]) {
      const context: Context = {
        ...(args[argIndex] ?? { __type: AcmeKitContextType }),
      }
      args[argIndex] = context

      return originalMethod.apply(this, args)
    }
  }
}
