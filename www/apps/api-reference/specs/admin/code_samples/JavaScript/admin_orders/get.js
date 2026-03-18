import Medusa from "@acmekit/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.order.list()
.then(({ orders, count, limit, offset }) => {
  console.log(orders)
})