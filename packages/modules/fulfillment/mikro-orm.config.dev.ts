import * as entities from "./src/models"
import { defineMikroOrmCliConfig, Modules } from "@acmekit/framework/utils"

export default defineMikroOrmCliConfig(Modules.FULFILLMENT, {
  entities: Object.values(entities),
})
