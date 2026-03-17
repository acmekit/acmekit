import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.returnReason.create({
  value: "refund",
  label: "Refund",
})
.then(({ return_reason }) => {
  console.log(return_reason)
})