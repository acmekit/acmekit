import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.priceList.update("plist_123", {
  title: "My Price List",
})
.then(({ price_list }) => {
  console.log(price_list)
})