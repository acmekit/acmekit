import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.priceList.batchPrices("plist_123", {
  create: [{
    variant_id: "variant_123",
    currency_code: "usd",
    amount: 10,
    rules: {
      region_id: "reg_123"
    }
  }],
  update: [{
    id: "price_123",
    variant_id: "variant_123",
    amount: 20,
  }],
  delete: ["price_123"]
})
.then(({ created, updated, deleted }) => {
  console.log(created, updated, deleted)
})