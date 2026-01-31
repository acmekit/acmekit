import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.product.batchVariantImages("prod_123", "variant_123", {
  add: ["img_123", "img_456"],
  remove: ["img_789"]
})
.then(({ added, removed }) => {
  console.log(added, removed)
})