import { createRbacPoliciesWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
} from "@acmekit/framework/utils"
import RbacFeatureFlag from "../../../../feature-flags/rbac"
import { AdminCreateRbacPolicyType } from "./validators"

export const GET = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: policies, metadata } = await query.graph({
    entity: "rbac_policy",
    fields: req.queryConfig.fields,
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({
    policies,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminCreateRbacPolicyType>,
  res: AcmeKitResponse
) => {
  const input = [req.validatedBody]

  const { result } = await createRbacPoliciesWorkflow(req.scope).run({
    input: { policies: input },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: policies } = await query.graph({
    entity: "rbac_policy",
    fields: req.queryConfig.fields,
    filters: { id: result[0].id },
  })

  const policy = policies[0]

  res.status(200).json({ policy })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
