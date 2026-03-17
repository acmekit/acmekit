import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.claim.addItems("claim_123", {
  items: [
    {
      id: "orli_123",
      quantity: 1
    }
  ]
})
.then(({ claim }) => {
  console.log(claim)
})