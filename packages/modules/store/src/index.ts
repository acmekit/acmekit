import { StoreModuleService } from "@services"
import { Module, Modules } from "@acmekit/framework/utils"

export default Module(Modules.STORE, {
  service: StoreModuleService,
})
