import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { AcmeKitError } from "@acmekit/framework/utils"

import { deleteInvitesWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import { refetchInvite } from "../helpers"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.AdminInviteResponse>
) => {
  const { id } = req.params
  const invite = await refetchInvite(id, req.scope, req.queryConfig.fields)

  if (!invite) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Invite with id: ${id} was not found`
    )
  }

  res.status(200).json({ invite })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminInviteDeleteResponse>
) => {
  const { id } = req.params
  const workflow = deleteInvitesWorkflow(req.scope)

  await workflow.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "invite",
    deleted: true,
  })
}
