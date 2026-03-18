import { defineJoinerConfig, Modules } from "@acmekit/framework/utils"
import { AuthIdentity, ProviderIdentity } from "@models"

export const joinerConfig = defineJoinerConfig(Modules.AUTH, {
  models: [AuthIdentity, ProviderIdentity],
})
