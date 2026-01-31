import { markPaymentCollectionAsPaid } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntity,
} from "@acmekit/framework/http"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminMarkPaymentCollectionAsPaid,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminPaymentCollectionResponse>
) => {
  const { id } = req.params

  await markPaymentCollectionAsPaid(req.scope).run({
    input: {
      ...req.body,
      payment_collection_id: id,
      captured_by: req.auth_context.actor_id,
    },
  })

  const paymentCollection = await refetchEntity({
    entity: "payment_collection",
    idOrFilter: id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ payment_collection: paymentCollection })
}
