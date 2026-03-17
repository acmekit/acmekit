import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

const result = await sdk.auth.login(
  "user",
  "emailpass",
  {
    email: "user@gmail.com",
    password: "supersecret"
  }
)

if (typeof result !== "string") {
  alert("Authentication requires additional steps")
  // replace with the redirect logic of your application
  window.location.href = result.location
  return
}

// user is now authenticated
// all subsequent requests will use the token in the header
const { user } = await sdk.admin.user.me()