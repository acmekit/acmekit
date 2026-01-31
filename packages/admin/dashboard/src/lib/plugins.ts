import { HttpTypes } from "@acmekit/types"

export const LOYALTY_PLUGIN_NAME = "@acmekit/loyalty-plugin"

export const getLoyaltyPlugin = (plugins: HttpTypes.AdminPlugin[]) => {
  return plugins?.find((plugin) => plugin.name === LOYALTY_PLUGIN_NAME)
}
