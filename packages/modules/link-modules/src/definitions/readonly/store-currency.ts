import { ModuleJoinerConfig } from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"

export const StoreCurrencies: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.STORE,
      entity: "StoreCurrency",
      relationship: {
        serviceName: Modules.CURRENCY,
        entity: "Currency",
        primaryKey: "code",
        foreignKey: "currency_code",
        alias: "currency",
        args: {
          methodSuffix: "Currencies",
        },
      },
    },
  ],
}
