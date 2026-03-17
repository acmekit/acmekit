import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.draftOrder.update("order_123", {
  email: "test@test.com",
})
.then(({ draft_order }) => {
  console.log(draft_order)
})