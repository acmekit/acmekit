import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.fulfillmentSet.retrieveServiceZone(
  "fset_123",
  "serzo_123"
)
.then(({ service_zone }) => {
  console.log(service_zone)
})