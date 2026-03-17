import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.productCollection.update("pcol_123", {
  title: "Summer Collection"
})
.then(({ collection }) => {
  console.log(collection)
})