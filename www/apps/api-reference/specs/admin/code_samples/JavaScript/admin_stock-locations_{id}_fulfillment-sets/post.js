import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.stockLocation.createFulfillmentSet("sloc_123", {
  name: "Shipping",
  type: "shipping",
})
.then(({ stock_location }) => {
  console.log(stock_location)
})