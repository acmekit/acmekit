import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.salesChannel.batchProducts("sc_123", {
  add: ["prod_123", "prod_456"],
  remove: ["prod_789"]
})
.then(({ sales_channel }) => {
  console.log(sales_channel)
})