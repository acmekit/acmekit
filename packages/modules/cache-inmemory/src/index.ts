import { ModuleExports } from "/framework/types"
import InMemoryCacheService from "./services/inmemory-cache"

const service = InMemoryCacheService

const moduleDefinition: ModuleExports = {
  service,
}

export default moduleDefinition
export * from "./initialize"
export * from "./types"
