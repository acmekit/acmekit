import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"

import { createInvitesWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import { refetchInvite } from "./helpers"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminGetInvitesParams>,
  res: AcmeKitResponse<HttpTypes.AdminInviteListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "invite",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: invites, metadata } = await remoteQuery(queryObject)

  res.json({
    invites,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreateInvite,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminInviteResponse>
) => {
  const workflow = createInvitesWorkflow(req.scope)

  const input = {
    input: {
      invites: [req.validatedBody],
    },
  }

  const { result } = await workflow.run(input)

  const invite = await refetchInvite(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ invite })
}
