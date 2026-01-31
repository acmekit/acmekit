import { AcmeKitContainer } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"

export const refetchTaxRegion = async (
  taxRegionId: string,
  scope: AcmeKitContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "tax_region",
    variables: {
      filters: { id: taxRegionId },
    },
    fields: fields,
  })

  const taxRegions = await remoteQuery(queryObject)
  return taxRegions[0]
}
