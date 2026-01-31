import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.claim.updateOutboundShipping(
  "claim_123", 
  "ordchact_123",
  {
    custom_amount: 10
  },
)
.then(({ claim }) => {
  console.log(claim)
})