import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.auth.updateProvider(
  "user",
  "emailpass",
  {
    password: "supersecret"
  },
  token
)
.then(() => {
  // password updated
})