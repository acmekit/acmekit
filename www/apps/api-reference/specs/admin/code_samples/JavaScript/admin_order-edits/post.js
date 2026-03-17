import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.orderEdit.initiateRequest({
  order_id: "order_123"
})
.then(({ order_change }) => {
  console.log(order_change)
})