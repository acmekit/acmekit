import { SettingsModuleService } from "@/services"
import { Module } from "/framework/utils"
import { Modules } from "/utils"

export default Module(Modules.SETTINGS, {
  service: SettingsModuleService,
})
