import { Modules } from "@acmekit/framework/utils"
import { StepResponse, createStep } from "@acmekit/framework/workflows-sdk"
import { CreateRbacPolicyDTO, IRbacModuleService } from "@acmekit/types"

export type CreateRbacPoliciesStepInput = {
  policies: CreateRbacPolicyDTO[]
}

export const createRbacPoliciesStepId = "create-rbac-policies"

export const createRbacPoliciesStep = createStep(
  createRbacPoliciesStepId,
  async (data: CreateRbacPoliciesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    // Normalize resource and operation to lowercase
    const normalizedPolicies = data.policies.map((policy) => ({
      ...policy,
      resource: policy.resource.toLowerCase(),
      operation: policy.operation.toLowerCase(),
    }))

    const created = await service.createRbacPolicies(normalizedPolicies)

    return new StepResponse(
      created,
      (created ?? []).map((p) => p.id)
    )
  },
  async (createdIds: string[] | undefined, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)
    await service.deleteRbacPolicies(createdIds)
  }
)
