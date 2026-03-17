import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.productCategory.update("pcat_123", {
  name: "Shirts"
})
.then(({ product_category }) => {
  console.log(product_category)
})