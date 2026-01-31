import AcmeKit from "@acmekit/js-sdk"

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new AcmeKit({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

sdk.store.cart.addShippingMethod("cart_123", {
  option_id: "so_123",
  data: {
    // custom data for fulfillment provider.
  }
})
.then(({ cart }) => {
  console.log(cart)
})