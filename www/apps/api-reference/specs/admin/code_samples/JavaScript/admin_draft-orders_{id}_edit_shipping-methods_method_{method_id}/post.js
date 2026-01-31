import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.draftOrder.updateShippingMethod("order_123", "sm_123", {
 shipping_option_id: "so_123",
})
.then(({ draft_order_preview }) => {
  console.log(draft_order_preview)
})