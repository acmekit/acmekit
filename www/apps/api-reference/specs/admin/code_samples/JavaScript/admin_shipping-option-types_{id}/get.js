import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.shippingOptionType.retrieve("sotype_123")
.then(({ shipping_option_type }) => {
  console.log(shipping_option_type)
})