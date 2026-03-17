import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.exchange.addOutboundShipping("exchange_123", {
  shipping_option_id: "so_123"
})
.then(({ exchange }) => {
  console.log(exchange)
})