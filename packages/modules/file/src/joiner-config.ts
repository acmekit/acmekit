import { defineJoinerConfig, Modules } from "@acmekit/framework/utils"

export const joinerConfig = defineJoinerConfig(Modules.FILE, {
  models: [{ name: "File" }],
})
