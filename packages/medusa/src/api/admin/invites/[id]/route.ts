import {
  AuthenticatedMedusaRequest,
  AcmeKitResponse,
} from "/framework/http"
import { AcmeKitError } from "/framework/utils"

import { deleteInvitesWorkflow } from "/core-flows"
import { HttpTypes } from "/framework/types"
import { refetchInvite } from "../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.SelectParams>,
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
  req: AuthenticatedMedusaRequest,
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
