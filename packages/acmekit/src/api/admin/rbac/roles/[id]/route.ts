import {
  deleteRbacRolesWorkflow,
  updateRbacRolesWorkflow,
} from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import {
  ContainerRegistrationKeys,
  AcmeKitError,
} from "@acmekit/framework/utils"

import { AdminUpdateRbacRoleType } from "../validators"

export const GET = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: roles } = await query.graph({
    entity: "rbac_role",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  const role = roles[0]

  if (!role) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Role with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ role })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminUpdateRbacRoleType>,
  res: AcmeKitResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: existing } = await query.graph({
    entity: "rbac_role",
    filters: { id: req.params.id },
    fields: ["id"],
  })

  const existingRole = existing[0]
  if (!existingRole) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Role with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateRbacRolesWorkflow(req.scope).run({
    input: {
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const { data: roles } = await query.graph({
    entity: "rbac_role",
    filters: { id: result[0].id },
    fields: req.queryConfig.fields,
  })

  const role = roles[0]

  res.status(200).json({ role })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const id = req.params.id

  await deleteRbacRolesWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "rbac_role",
    deleted: true,
  })
}
