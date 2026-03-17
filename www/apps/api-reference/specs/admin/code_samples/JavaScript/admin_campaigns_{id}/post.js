import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.campaign.update("procamp_123", {
  name: "Summer Campaign"
})
.then(({ campaign }) => {
  console.log(campaign)
})