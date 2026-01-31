import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
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