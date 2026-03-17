import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.productType.update("ptyp_123", {
  value: "Clothes"
})
.then(({ product_type }) => {
  console.log(product_type)
})