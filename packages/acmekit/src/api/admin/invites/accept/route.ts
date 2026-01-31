import { acceptInviteWorkflow } from "@acmekit/core-flows"
import { HttpTypes, InviteWorkflow } from "@acmekit/framework/types"
import { AcmeKitError } from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { AdminInviteAcceptType } from "../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminInviteAcceptType>,
  res: AcmeKitResponse<HttpTypes.AdminAcceptInviteResponse>
) => {
  if (req.auth_context.actor_id) {
    throw new AcmeKitError(
      AcmeKitError.Types.INVALID_DATA,
      "The user is already authenticated and cannot accept an invite."
    )
  }

  const input = {
    invite_token: req.filterableFields.token as string,
    auth_identity_id: req.auth_context.auth_identity_id,
    user: req.validatedBody,
  } as InviteWorkflow.AcceptInviteWorkflowInputDTO

  let users

  try {
    const { result } = await acceptInviteWorkflow(req.scope).run({ input })
    users = result
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  res.status(200).json({ user: users[0] })
}

export const AUTHENTICATE = false
