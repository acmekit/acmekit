import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.fulfillment.create({
  location_id: "sloc_123",
  provider_id: "my_fulfillment",
  delivery_address: {
    country_code: "us"
  },
  items: [
    {
      title: "Shirt",
      sku: "SHIRT",
      quantity: 1,
      barcode: "123"
    }
  ],
  labels: [],
  order: {},
  order_id: "order_123"
})
.then(({ fulfillment }) => {
  console.log(fulfillment)
})