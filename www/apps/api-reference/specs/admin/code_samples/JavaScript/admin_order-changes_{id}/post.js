import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.order.updateOrderChange(
  "ordch_123",
  {
    carry_over_promotions: true
  }
)
.then(({ order_change }) => {
  console.log(order_change)
})