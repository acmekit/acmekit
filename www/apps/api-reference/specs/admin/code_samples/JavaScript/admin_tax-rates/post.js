import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.taxRate.create({
  name: "VAT",
  tax_region_id: "txreg_123",
  code: "VAT",
  rate: 2, // 2%
})
.then(({ tax_rate }) => {
  console.log(tax_rate)
})