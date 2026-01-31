import { Module, Modules } from "@acmekit/framework/utils"
import { SalesChannelModuleService } from "@services"

export default Module(Modules.SALES_CHANNEL, {
  service: SalesChannelModuleService,
})
