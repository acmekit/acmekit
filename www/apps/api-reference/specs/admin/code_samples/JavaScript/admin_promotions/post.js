import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.promotion.create({
  name: "My Promotion",
  description: "This is a test promotion",
  code: "PROMO123",
  starts_at: "2021-01-01",
  ends_at: "2021-01-01",
})
.then(({ promotion }) => {
  console.log(promotion)
})