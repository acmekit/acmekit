import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.return.updateDismissItem("return_123", "orchach_123", {
  quantity: 2,
})
.then(({ return }) => {
  console.log(return)
})