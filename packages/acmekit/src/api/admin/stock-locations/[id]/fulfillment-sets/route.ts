import { createLocationFulfillmentSetWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { refetchStockLocation } from "../../helpers"
import { HttpTypes } from "@acmekit/framework/types"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreateStockLocationFulfillmentSet,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminStockLocationResponse>
) => {
  await createLocationFulfillmentSetWorkflow(req.scope).run({
    input: {
      location_id: req.params.id,
      fulfillment_set_data: {
        name: req.validatedBody.name,
        type: req.validatedBody.type,
      },
    },
  })

  const stockLocation = await refetchStockLocation(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ stock_location: stockLocation })
}
