import { AcmeKitContainer } from "@acmekit/framework/types"
import { refetchEntity } from "@acmekit/framework/http"

export const refetchOrder = async (
  idOrFilter: string | object,
  scope: AcmeKitContainer,
  fields: string[]
) => {
  return await refetchEntity({ entity: "order", idOrFilter, scope, fields })
}
