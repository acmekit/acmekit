import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.claim.addInboundShipping(
  "claim_123", 
  {
    shipping_option_id: "so_123",
    custom_amount: 10
  },
  )
.then(({ return: returnData }) => {
  console.log(returnData)
})