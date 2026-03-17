import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.fulfillmentSet.deleteServiceZone(
  "fset_123", 
  "serzo_123",
)
.then(({ deleted, parent: fulfillmentSet }) => {
  console.log(deleted, fulfillmentSet)
})