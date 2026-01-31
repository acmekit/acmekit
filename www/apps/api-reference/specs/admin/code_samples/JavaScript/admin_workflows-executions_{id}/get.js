import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.workflowExecution.retrieve("wrk_123")
.then(({ workflow_execution }) => {
  console.log(workflow_execution)
})