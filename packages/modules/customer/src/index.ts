import { CustomerModuleService } from "@services"
import { Module, Modules } from "@acmekit/framework/utils"

export default Module(Modules.CUSTOMER, {
  service: CustomerModuleService,
})
