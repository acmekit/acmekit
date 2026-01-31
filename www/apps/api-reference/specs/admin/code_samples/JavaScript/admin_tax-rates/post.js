import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
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