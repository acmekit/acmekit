import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
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