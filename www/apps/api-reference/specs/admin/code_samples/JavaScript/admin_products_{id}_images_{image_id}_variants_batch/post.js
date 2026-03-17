import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.product.batchImageVariants("prod_123", "img_123", {
  add: ["variant_123", "variant_456"],
  remove: ["variant_789"]
})
.then(({ added, removed }) => {
  console.log(added, removed)
})