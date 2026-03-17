import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.claim.create({
  type: "refund",
  order_id: "order_123",
})
.then(({ claim }) => {
  console.log(claim)
})