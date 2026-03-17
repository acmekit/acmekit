import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.shippingOption.updateRules("so_123", {
  create: [{ attribute: "enabled_in_store", operator: "eq", value: "true" }],
})
.then(({ shipping_option }) => {
  console.log(shipping_option)
})