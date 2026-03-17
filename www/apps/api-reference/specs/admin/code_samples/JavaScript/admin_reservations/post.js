import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.reservation.create({
  inventory_item_id: "iitem_123",
  location_id: "sloc_123",
  quantity: 10,
})
.then(({ reservation }) => {
  console.log(reservation)
})