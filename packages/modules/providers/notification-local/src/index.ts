import { ModuleProvider, Modules } from "@acmekit/framework/utils"
import { LocalNotificationService } from "./services/local"

const services = [LocalNotificationService]

export default ModuleProvider(Modules.NOTIFICATION, {
  services,
})
