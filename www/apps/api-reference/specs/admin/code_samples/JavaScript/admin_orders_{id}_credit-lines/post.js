import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.order.createCreditLine(
  "order_123",
  {
    amount: 100,
    reference: "order",
    reference_id: "order_123",
  }
)
.then(({ order }) => {
  console.log(order)
})