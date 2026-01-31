import { IEventBusModuleService, Logger } from "@acmekit/framework/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  EventBus?: IEventBusModuleService
}
