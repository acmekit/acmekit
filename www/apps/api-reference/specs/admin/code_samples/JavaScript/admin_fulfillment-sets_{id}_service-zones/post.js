import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.fulfillmentSet.createServiceZone("fset_123", {
  name: "Europe Service Zone",
  geo_zones: [{
    type: "country",
    country_code: "us"
  }]
})
.then(({ fulfillment_set }) => {
  console.log(fulfillment_set)
})