import Medusa from "@medusajs/js-sdk"

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const result = await sdk.auth.login(
  "customer",
  "emailpass",
  {
    email: "customer@gmail.com",
    password: "supersecret"
  }
)

if (typeof result !== "string") {
  alert("Authentication requires additional steps")
  // replace with the redirect logic of your application
  window.location.href = result.location
  return
}

// customer is now authenticated
// all subsequent requests will use the token in the header
const { customer } = await sdk.store.customer.retrieve()