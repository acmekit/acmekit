import { ModuleJoinerConfig } from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"

export const InventoryLevelStockLocation: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.INVENTORY,
      entity: "InventoryLevel",
      relationship: {
        serviceName: Modules.STOCK_LOCATION,
        entity: "StockLocation",
        primaryKey: "id",
        foreignKey: "location_id",
        alias: "stock_locations",
        args: {
          methodSuffix: "StockLocations",
        },
        isList: true,
      },
    },
  ],
}
