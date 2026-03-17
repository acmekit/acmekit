import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.order.update(
  "order_123",
  {
    email: "new_email@example.com",
    shipping_address: {
      first_name: "John",
      last_name: "Doe",
      address_1: "123 Main St",
    }
  }
)
.then(({ order }) => {
  console.log(order)
})