import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.payment.listPaymentProviders()
.then(({ payment_providers, count, limit, offset }) => {
  console.log(payment_providers)
})