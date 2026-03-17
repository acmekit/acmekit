import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.campaign.batchPromotions("procamp_123", {
  add: ["prom_123", "prom_456"],
  remove: ["prom_789"]
})
.then(({ campaign }) => {
  console.log(campaign)
})