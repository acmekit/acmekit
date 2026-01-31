import { defineMikroOrmCliConfig, Modules } from "@acmekit/framework/utils"
import * as entities from "./src/models"

export default defineMikroOrmCliConfig(Modules.ORDER, {
  entities: Object.values(entities),
})
