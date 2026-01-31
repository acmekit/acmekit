import { deleteOrderPaymentCollections } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminDeletePaymentCollectionResponse>
) => {
  const { id } = req.params

  await deleteOrderPaymentCollections(req.scope).run({
    input: { id },
  })

  res.status(200).json({
    id,
    object: "payment-collection",
    deleted: true,
  })
}
