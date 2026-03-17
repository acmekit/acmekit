import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.stockLocation.updateFulfillmentProviders("sloc_123", {
  add: ["fp_manual_manual"],
  remove: ["fp_shipstation_shipstation"],
})
.then(({ stock_location }) => {
  console.log(stock_location)
})