import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.customer.batchCustomerGroups("cus_123", {
  add: ["cusgroup_123"],
  remove: ["cusgroup_321"]
})
.then(({ customer }) => {
  console.log(customer)
})