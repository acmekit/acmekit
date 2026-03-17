import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.product.batchVariantInventoryItems(
  "prod_123",
  {
    create: [
      {
        inventory_item_id: "iitem_123",
        variant_id: "variant_123",
        required_quantity: 10
      }
    ],
    update: [
      {
        inventory_item_id: "iitem_1234",
        variant_id: "variant_1234",
        required_quantity: 20
      }
    ],
    delete: [
      {
        inventory_item_id: "iitem_321",
        variant_id: "variant_321"
      }
    ]
  }
)
.then(({ created, updated, deleted }) => {
  console.log(created, updated, deleted)
})