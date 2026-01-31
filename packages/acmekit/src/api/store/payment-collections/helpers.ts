import {
  AcmeKitContainer,
  PaymentCollectionDTO,
} from "@acmekit/framework/types"
import { refetchEntity } from "@acmekit/framework/http"

export const refetchPaymentCollection = async (
  id: string,
  scope: AcmeKitContainer,
  fields: string[]
): Promise<PaymentCollectionDTO> => {
  return refetchEntity({
    entity: "payment_collection",
    idOrFilter: id,
    scope,
    fields,
  })
}
