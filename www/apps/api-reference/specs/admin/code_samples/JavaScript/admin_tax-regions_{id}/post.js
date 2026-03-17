import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.taxRegion.update("txreg_123", {
  province_code: "ca",
})
.then(({ tax_region }) => {
  console.log(tax_region)
})