import { MedusaService } from "@medusajs/utils"
import { Brand } from "./models/brand"

export class BrandModuleService extends MedusaService({
  Brand,
}) {}
