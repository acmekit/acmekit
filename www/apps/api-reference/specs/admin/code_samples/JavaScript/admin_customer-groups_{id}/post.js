import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.customerGroup.update("cusgroup_123", {
  name: "VIP"
})
.then(({ customer_group }) => {
  console.log(customer_group)
})