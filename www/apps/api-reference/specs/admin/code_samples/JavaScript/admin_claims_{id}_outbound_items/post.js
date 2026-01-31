import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.claim.addOutboundItems(
  "claim_123", 
  {
    items: [{
      id: "orli_123",
      quantity: 1
    }]
  },
  )
.then(({ claim }) => {
  console.log(claim)
})