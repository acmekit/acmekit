import { createOrderPaymentCollectionWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntity,
} from "@acmekit/framework/http"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreatePaymentCollection,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminPaymentCollectionResponse>
) => {
  const { result } = await createOrderPaymentCollectionWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  const paymentCollection = await refetchEntity({
    entity: "payment_collection",
    idOrFilter: result[0].id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ payment_collection: paymentCollection })
}
