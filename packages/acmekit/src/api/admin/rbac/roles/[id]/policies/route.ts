import { createRbacRolePoliciesWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
} from "@acmekit/framework/utils"
import RbacFeatureFlag from "../../../../../../feature-flags/rbac"
import { AdminAddRolePoliciesType } from "../../validators"

export const GET = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const roleId = req.params.id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: policies, metadata } = await query.graph({
    entity: "rbac_role_policy",
    fields: req.queryConfig?.fields,
    filters: { ...req.filterableFields, role_id: roleId },
    pagination: req.queryConfig?.pagination || {},
  })

  res.status(200).json({
    policies,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminAddRolePoliciesType>,
  res: AcmeKitResponse
) => {
  const roleId = req.params.id
  const { policies } = req.validatedBody
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const rolePolicies = policies.map((policyId) => ({
    role_id: roleId,
    policy_id: policyId,
  }))

  const { result } = await createRbacRolePoliciesWorkflow(req.scope).run({
    input: {
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
      policies: rolePolicies,
    },
  })

  // Get the created role-policy association
  const { data } = await query.graph({
    entity: "rbac_role_policy",
    fields: req.queryConfig?.fields,
    filters: { id: result[0].id },
  })

  res.status(200).json({ policies: data })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
