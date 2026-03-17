import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.inventoryItem.deleteLevel(
  "iitem_123",
  "sloc_123",
)
.then(({ deleted, parent: inventoryItem }) => {
  console.log(deleted, inventoryItem)
})