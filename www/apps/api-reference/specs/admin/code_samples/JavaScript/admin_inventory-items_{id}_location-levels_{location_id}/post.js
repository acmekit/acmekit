import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.inventoryItem.updateLevel(
  "iitem_123",
  "sloc_123",
  {
    stocked_quantity: 10
  }
)
.then(({ inventory_item }) => {
  console.log(inventory_item)
})