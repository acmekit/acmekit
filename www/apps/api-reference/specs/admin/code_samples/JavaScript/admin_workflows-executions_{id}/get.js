import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
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