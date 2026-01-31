import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
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