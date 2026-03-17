import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.return.updateReturnShipping("return_123", "orchach_123", {
  custom_amount: 100,
})
.then(({ return }) => {
  console.log(return)
})