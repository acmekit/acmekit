import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.fulfillment.createShipment("ful_123", {
  labels: [
    {
      tracking_number: "123",
      tracking_url: "example.com",
      label_url: "example.com"
    }
  ]
})
.then(({ fulfillment }) => {
  console.log(fulfillment)
})