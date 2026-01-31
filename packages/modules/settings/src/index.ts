import { SettingsModuleService } from "@/services"
import { Module } from "@acmekit/framework/utils"
import { Modules } from "@acmekit/utils"

export default Module(Modules.SETTINGS, {
  service: SettingsModuleService,
})
