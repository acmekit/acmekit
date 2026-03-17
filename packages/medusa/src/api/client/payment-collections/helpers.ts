import {
  MedusaContainer,
  PaymentCollectionDTO,
} from "@medusajs/framework/types"
import { refetchEntity } from "@medusajs/framework/http"

export const refetchPaymentCollection = async (
  id: string,
  scope: MedusaContainer,
  fields: string[]
): Promise<PaymentCollectionDTO> => {
  return refetchEntity({
    entity: "payment_collection",
    idOrFilter: id,
    scope,
    fields,
  })
}
