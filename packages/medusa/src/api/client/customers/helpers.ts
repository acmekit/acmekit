import { AcmeKitContainer } from "/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "/framework/utils"

export const refetchCustomer = async (
  customerId: string,
  scope: AcmeKitContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "customer",
    variables: {
      filters: { id: customerId },
    },
    fields: fields,
  })

  const customers = await remoteQuery(queryObject)
  return customers[0]
}
