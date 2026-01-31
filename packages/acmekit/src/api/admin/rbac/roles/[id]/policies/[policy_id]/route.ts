import { deleteRbacRolePoliciesWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { defineFileConfig, FeatureFlag } from "@acmekit/framework/utils"
import RbacFeatureFlag from "../../../../../../../feature-flags/rbac"

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const { policy_id, id: role_id } = req.params

  // First, we need to find the role_policy_id that connects this role and policy
  const query = req.scope.resolve("query")
  const { data: rolePolicies } = await query.graph({
    entity: "rbac_role_policy",
    fields: ["id"],
    filters: { role_id, policy_id },
  })

  const rolePolicyId = rolePolicies[0]?.id

  await deleteRbacRolePoliciesWorkflow(req.scope).run({
    input: {
      role_policy_ids: rolePolicyId ? [rolePolicyId] : [],
    },
  })

  res.status(200).json({
    id: rolePolicyId,
    object: "rbac_role_policy",
    deleted: true,
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
