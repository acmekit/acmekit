import { IModuleService } from "@acmekit/types"
import { AcmeKitContext } from "@acmekit/utils"

// @ts-expect-error
export class ModuleService implements IModuleService {
  public property = "value"

  constructor() {}
  async methodName(input, @AcmeKitContext() context) {
    return input + " called"
  }
}
