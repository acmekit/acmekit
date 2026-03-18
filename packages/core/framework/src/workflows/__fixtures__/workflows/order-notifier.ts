import {
  createStep,
  createWorkflow,
  WorkflowResponse,
} from "/workflows-sdk"

export const orderWorkflowId = "order-notifier-workflow"

const step = createStep("order-step", () => {
  return {} as any
})

export const orderNotifierWorkflow = createWorkflow(orderWorkflowId, () => {
  step()
  return new WorkflowResponse(void 0)
})
