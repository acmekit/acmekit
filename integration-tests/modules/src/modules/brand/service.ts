import { AcmeKitService } from "@acmekit/utils"
import { Brand } from "./models/brand"

export class BrandModuleService extends AcmeKitService({
  Brand,
}) {}
