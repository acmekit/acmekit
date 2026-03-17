import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.product.updateVariant(
  "prod_123",
  "variant_123",
    {
    title: "Blue Shirt",
  }
)
.then(({ product }) => {
  console.log(product)
})