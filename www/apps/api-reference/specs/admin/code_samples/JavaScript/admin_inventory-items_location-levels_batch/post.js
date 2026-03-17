import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.inventoryItem.batchInventoryItemsLocationLevels({
  create: [{
    inventory_item_id: "iitem_123",
    location_id: "sloc_123",
    stocked_quantity: 10
  }],
  delete: ["ilvl_123"]
})
.then(({ created, updated, deleted }) => {
  console.log(created, updated, deleted)
})