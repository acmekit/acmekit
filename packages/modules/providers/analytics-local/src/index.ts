import { ModuleProvider, Modules } from "/framework/utils"
import { LocalAnalyticsService } from "./services/local-analytics"

const services = [LocalAnalyticsService]

export default ModuleProvider(Modules.ANALYTICS, {
  services,
})
