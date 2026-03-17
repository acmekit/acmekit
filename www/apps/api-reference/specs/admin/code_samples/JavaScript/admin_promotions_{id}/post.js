import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.promotion.update("promo_123", {
  code: "PROMO123",
})
.then(({ promotion }) => {
  console.log(promotion)
})