import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.draftOrder.addPromotions("order_123", {
  promo_codes: ["PROMO_CODE_1", "PROMO_CODE_2"],
})
.then(({ draft_order_preview }) => {
  console.log(draft_order_preview)
})