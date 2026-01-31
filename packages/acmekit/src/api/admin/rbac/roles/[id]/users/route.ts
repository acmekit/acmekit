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

export const GET = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const roleId = req.params.id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: links, metadata } = await query.graph({
    entity: "user_rbac_role",
    fields: req.queryConfig?.fields,
    filters: { ...req.filterableFields, rbac_role_id: roleId },
    pagination: req.queryConfig?.pagination || {},
  })

  const users = links.map((link: any) => link.user)

  res.status(200).json({
    users,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key),
})
