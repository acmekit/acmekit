import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.order.cancelFulfillment(
  "order_123",
  "ful_123",
  {
    no_notification: false
  }
)
.then(({ order }) => {
  console.log(order)
})