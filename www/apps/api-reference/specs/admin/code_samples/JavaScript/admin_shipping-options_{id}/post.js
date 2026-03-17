import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.shippingOption.update("so_123", {
  name: "Standard Shipping",
})
.then(({ shipping_option }) => {
  console.log(shipping_option)
})