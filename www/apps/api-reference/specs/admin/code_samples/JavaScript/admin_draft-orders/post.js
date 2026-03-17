import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.draftOrder.create({
  email: "test@test.com",
  items: [
    {
      variant_id: "variant_123",
      quantity: 1,
    },
  ],
  region_id: "region_123",
  sales_channel_id: "sc_123",
})
.then(({ draft_order }) => {
  console.log(draft_order)
})