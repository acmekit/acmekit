import { IModuleService } from "@acmekit/types"
import { MedusaContext } from "@acmekit/utils"

// @ts-expect-error
export class ModuleService implements IModuleService {
  public property = "value"

  constructor() {}
  async methodName(input, @MedusaContext() context) {
    return input + " called"
  }
}
