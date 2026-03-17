import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { LocalAnalyticsService } from "./services/local-analytics"

const services = [LocalAnalyticsService]

export default ModuleProvider(Modules.ANALYTICS, {
  services,
})
