import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.taxRegion.create({
  country_code: "us",
  province_code: "ca",
  default_tax_rate: {
    code: "VAT",
    name: "VAT",
    rate: 20, // 20%
    is_combinable: true,
  },
})
.then(({ tax_region }) => {
  console.log(tax_region)
})