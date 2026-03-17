import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.claim.addOutboundShipping(
  "claim_123", 
  {
    shipping_option_id: "so_123",
    custom_amount: 10
  },
)
.then(({ claim }) => {
  console.log(claim)
})