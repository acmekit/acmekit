import { createRbacRolesWorkflow } from "@acmekit/core-flows"
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
import { AdminCreateRbacRoleType } from "./validators"

export const GET = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: roles, metadata } = await query.graph({
    entity: "rbac_role",
    fields: req.queryConfig.fields,
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({
    roles,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminCreateRbacRoleType>,
  res: AcmeKitResponse
) => {
  const input = [req.validatedBody]

  const { result } = await createRbacRolesWorkflow(req.scope).run({
    input: {
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
      roles: input,
    },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: roles } = await query.graph({
    entity: "rbac_role",
    fields: req.queryConfig.fields,
    filters: { id: result[0].id },
  })

  const role = roles[0]

  res.status(200).json({ role })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
