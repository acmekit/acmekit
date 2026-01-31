import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.paymentCollection.markAsPaid("paycol_123", {
  order_id: "order_123"
})
.then(({ payment_collection }) => {
  console.log(payment_collection)
})