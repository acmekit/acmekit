import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.customerGroup.batchCustomers("cusgroup_123", {
  add: ["cus_123"],
  remove: ["cus_321"]
})
.then(({ customer_group }) => {
  console.log(customer_group)
})