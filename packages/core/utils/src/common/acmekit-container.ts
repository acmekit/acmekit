import { AcmeKitContainer } from "@acmekit/types"
import {
  asFunction,
  asValue,
  AwilixContainer,
  ClassOrFunctionReturning,
  createContainer,
  Resolver,
} from "@acmekit/deps/awilix"

function asArray(
  resolvers: (ClassOrFunctionReturning<unknown> | Resolver<unknown>)[]
): { resolve: (container: AwilixContainer) => unknown[] } {
  return {
    resolve: (container: AwilixContainer) =>
      resolvers.map((resolver) => container.build(resolver)),
  }
}

function registerAdd(
  this: AcmeKitContainer,
  name: string,
  registration: typeof asFunction | typeof asValue
) {
  const storeKey = name + "_STORE"

  if (this.registrations[storeKey] === undefined) {
    this.register(storeKey, asValue([] as Resolver<unknown>[]))
  }
  const store = this.resolve(storeKey) as (
    | ClassOrFunctionReturning<unknown>
    | Resolver<unknown>
  )[]

  if (this.registrations[name] === undefined) {
    this.register(name, asArray(store))
  }
  store.unshift(registration)

  return this
}

export function createAcmeKitContainer(...args): AcmeKitContainer {
  const container = createContainer.apply(null, args) as AcmeKitContainer

  container.registerAdd = registerAdd.bind(container)

  const originalScope = container.createScope
  container.createScope = () => {
    const scoped = originalScope() as AcmeKitContainer
    scoped.registerAdd = registerAdd.bind(scoped)

    return scoped
  }

  return container
}
