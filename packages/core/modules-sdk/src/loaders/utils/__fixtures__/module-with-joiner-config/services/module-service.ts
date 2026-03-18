import { IModuleService, ModuleJoinerConfig } from "@acmekit/types"
import { defineJoinerConfig } from "@acmekit/utils"

export class ModuleService implements IModuleService {
  __joinerConfig(): ModuleJoinerConfig {
    return defineJoinerConfig("module-service", {
      alias: [
        {
          name: ["custom_name"],
          entity: "Custom",
        },
      ],
    })
  }
}
