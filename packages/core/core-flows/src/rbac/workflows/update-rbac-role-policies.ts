import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@acmekit/framework/workflows-sdk"
import { UpdateRbacRolePolicyDTO } from "@acmekit/types"
import { updateRbacRolePoliciesStep } from "../steps/update-rbac-role-policies"

export type UpdateRbacRolePoliciesWorkflowInput = {
  selector: Record<string, any>
  update: Omit<UpdateRbacRolePolicyDTO, "id">
}

export const updateRbacRolePoliciesWorkflowId = "update-rbac-role-policies"

export const updateRbacRolePoliciesWorkflow = createWorkflow(
  updateRbacRolePoliciesWorkflowId,
  (input: WorkflowData<UpdateRbacRolePoliciesWorkflowInput>) => {
    return new WorkflowResponse(updateRbacRolePoliciesStep(input))
  }
)
