import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"

import { refreshInviteTokensWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import { refetchInvite } from "../../helpers"

export const POST = async (
  req: AcmeKitRequest<{}, HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.AdminInviteResponse>
) => {
  const workflow = refreshInviteTokensWorkflow(req.scope)

  const input = {
    invite_ids: [req.params.id],
  }

  const { result } = await workflow.run({ input })
  const invite = await refetchInvite(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ invite })
}
