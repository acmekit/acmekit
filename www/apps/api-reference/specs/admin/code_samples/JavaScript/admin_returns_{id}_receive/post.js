import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.return.initiateReceive("return_123", {
  internal_note: "Return received by the customer",
})
.then(({ return }) => {
  console.log(return)
})