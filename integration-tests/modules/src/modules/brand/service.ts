import { MedusaService } from "@acmekit/utils"
import { Brand } from "./models/brand"

export class BrandModuleService extends MedusaService({
  Brand,
}) {}
