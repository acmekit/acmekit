import { UserModuleService } from "@services"
import { Module, Modules } from "@acmekit/framework/utils"

export default Module(Modules.USER, {
  service: UserModuleService,
})
