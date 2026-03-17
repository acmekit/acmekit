import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.taxRate.update("txrat_123", {
  name: "VAT",
  code: "VAT",
})
.then(({ tax_rate }) => {
  console.log(tax_rate)
})