import {
  IEventBusModuleService,
  Logger,
  StoreTypes,
} from "@acmekit/framework/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  EventBus?: IEventBusModuleService
}

export type UpdateStoreInput = StoreTypes.UpdateStoreDTO & { id: string }
