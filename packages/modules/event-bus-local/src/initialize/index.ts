import { AcmeKitModule } from "/framework/modules-sdk"
import { IEventBusService } from "/framework/types"
import { Modules } from "/framework/utils"

export const initialize = async (): Promise<IEventBusService> => {
  const serviceKey = Modules.EVENT_BUS
  const loaded = await AcmeKitModule.bootstrap<IEventBusService>({
    moduleKey: serviceKey,
    defaultPath: "/event-bus-local",
  })

  return loaded[serviceKey]
}
