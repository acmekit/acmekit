import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.claim.removeOutboundItem(
  "claim_123", 
  "ordchact_123",
)
.then(({ claim }) => {
  console.log(claim)
})