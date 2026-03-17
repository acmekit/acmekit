import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.pricePreference.create({
  attribute: "region_id",
  value: "region_123",
  is_tax_inclusive: true
})
.then(({ price_preference }) => {
  console.log(price_preference)
})