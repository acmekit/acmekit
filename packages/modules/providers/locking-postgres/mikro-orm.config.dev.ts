import * as entities from "./src/models"

import { defineMikroOrmCliConfig } from "@acmekit/framework/utils"

export default defineMikroOrmCliConfig("lockingPostgres", {
  entities: Object.values(entities),
})
