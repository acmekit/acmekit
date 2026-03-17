import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.productTag.update("ptag_123", {
  value: "shirt"
})
.then(({ product_tag }) => {
  console.log(product_tag)
})