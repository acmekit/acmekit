import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.fulfillmentProvider.listFulfillmentOptions("fp_123")
.then(({ fulfillment_options }) => {
  console.log(fulfillment_options)
})