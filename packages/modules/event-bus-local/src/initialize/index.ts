import { AcmeKitModule } from "@acmekit/framework/modules-sdk"
import { IEventBusService } from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"

export const initialize = async (): Promise<IEventBusService> => {
  const serviceKey = Modules.EVENT_BUS
  const loaded = await AcmeKitModule.bootstrap<IEventBusService>({
    moduleKey: serviceKey,
    defaultPath: "@acmekit/event-bus-local",
  })

  return loaded[serviceKey]
}
