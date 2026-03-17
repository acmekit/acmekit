import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.draftOrder.updateItem("order_123", "item_123", {
  quantity: 2,
})
.then(({ draft_order_preview }) => {
  console.log(draft_order_preview)
})