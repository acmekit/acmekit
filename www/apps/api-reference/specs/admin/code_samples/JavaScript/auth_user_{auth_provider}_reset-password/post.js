import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.auth.resetPassword(
  "user",
  "emailpass",
  {
    identifier: "user@gmail.com"
  }
)
.then(() => {
  // user receives token
})