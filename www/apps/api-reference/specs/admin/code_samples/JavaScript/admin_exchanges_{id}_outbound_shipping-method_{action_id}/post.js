import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.exchange.updateOutboundShipping(
  "exchange_123",
  "ordchact_123",
  {
    custom_amount: 10
  }
)
.then(({ exchange }) => {
  console.log(exchange)
})