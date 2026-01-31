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

// TODO must be authenticated as the customer to update their address
sdk.store.customer.updateAddress(
  "caddr_123",
  {
    country_code: "us"
  }
)
.then(({ customer }) => {
  console.log(customer)
})