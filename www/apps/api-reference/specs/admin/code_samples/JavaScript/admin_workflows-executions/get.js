import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.workflowExecution.list()
.then(({ workflow_executions, count, limit, offset }) => {
  console.log(workflow_executions)
})