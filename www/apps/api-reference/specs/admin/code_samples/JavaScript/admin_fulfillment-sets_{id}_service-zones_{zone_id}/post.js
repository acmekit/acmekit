import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.fulfillmentSet.updateServiceZone(
  "fset_123", 
  "serzo_123",
  {
    name: "Europe Service Zone",
  }
)
.then(({ fulfillment_set }) => {
  console.log(fulfillment_set)
})