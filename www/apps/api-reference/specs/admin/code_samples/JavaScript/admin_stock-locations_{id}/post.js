import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.stockLocation.update("sloc_123", {
  name: "European Warehouse",
})
.then(({ stock_location }) => {
  console.log(stock_location)
})