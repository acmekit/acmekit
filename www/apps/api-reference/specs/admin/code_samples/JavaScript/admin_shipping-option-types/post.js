import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.shippingOptionType.create({
  label: "Standard",
  code: "standard",
  description: "Ship in 2-3 days."
})
.then(({ shipping_option_type }) => {
  console.log(shipping_option_type)
})