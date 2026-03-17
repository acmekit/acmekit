import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.reservation.update("res_123", {
  quantity: 20,
})
.then(({ reservation }) => {
  console.log(reservation)
})