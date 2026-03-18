import { AcmeKitContainer } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"

export const refetchInvite = async (
  inviteId: string,
  scope: AcmeKitContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "invite",
    variables: {
      filters: { id: inviteId },
    },
    fields: fields,
  })

  const invites = await remoteQuery(queryObject)
  return invites[0]
}
