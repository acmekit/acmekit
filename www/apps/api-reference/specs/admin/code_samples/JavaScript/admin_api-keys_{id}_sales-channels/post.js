import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.apiKey.batchSalesChannels("apk_123", {
  add: ["sc_123"],
  remove: ["sc_321"]
})
.then(({ api_key }) => {
  console.log(api_key)
})