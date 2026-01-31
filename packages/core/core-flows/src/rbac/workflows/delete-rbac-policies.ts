import { WorkflowData, createWorkflow } from "@acmekit/framework/workflows-sdk"
import { deleteRbacPoliciesStep } from "../steps"

export type DeleteRbacPoliciesWorkflowInput = {
  ids: string[]
}

export const deleteRbacPoliciesWorkflowId = "delete-rbac-policies"

export const deleteRbacPoliciesWorkflow = createWorkflow(
  deleteRbacPoliciesWorkflowId,
  (
    input: WorkflowData<DeleteRbacPoliciesWorkflowInput>
  ): WorkflowData<void> => {
    deleteRbacPoliciesStep(input.ids)
  }
)
