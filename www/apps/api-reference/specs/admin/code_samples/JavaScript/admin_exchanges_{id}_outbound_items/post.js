import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.exchange.addOutboundItems("exchange_123", {
  items: [{
    id: "variant_123",
    quantity: 1
  }]
})
.then(({ exchange }) => {
  console.log(exchange)
})