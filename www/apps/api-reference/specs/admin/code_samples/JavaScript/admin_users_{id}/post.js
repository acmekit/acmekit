import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.user.update("user_123", {
  first_name: "John",
  last_name: "Doe",
})
.then(({ user }) => {
  console.log(user)
})