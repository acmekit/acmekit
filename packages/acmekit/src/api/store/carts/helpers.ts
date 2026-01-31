import { AcmeKitContainer } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  AcmeKitError,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"

export const refetchCart = async (
  id: string,
  scope: AcmeKitContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "cart",
    variables: { filters: { id } },
    fields,
  })

  const [cart] = await remoteQuery(queryObject)

  if (!cart) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Cart with id '${id}' not found`
    )
  }

  return cart
}
