import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.refundReason.list()
.then(({ refund_reasons, count, limit, offset }) => {
  console.log(refund_reasons)
})