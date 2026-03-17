import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

const token = await sdk.auth.register("user", "emailpass", {
  email: "user@gmail.com",
  password: "supersecret"
})

// all subsequent requests will use the token in the header
const { user } = await sdk.admin.invite.accept(
  {
    email: "user@gmail.com",
    first_name: "John",
    last_name: "Smith",
    invite_token: "12345..."
  },
)