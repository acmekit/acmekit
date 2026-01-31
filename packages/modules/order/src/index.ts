import { Module, Modules } from "@acmekit/framework/utils"
import { OrderModuleService } from "@services"

export default Module(Modules.ORDER, {
  service: OrderModuleService,
})
