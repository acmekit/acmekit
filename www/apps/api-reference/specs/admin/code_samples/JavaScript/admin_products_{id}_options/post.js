import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.product.createOption(
  "prod_123",
  {
    title: "Color",
    values: ["Green", "Blue"]
  }
)
.then(({ product }) => {
  console.log(product)
})