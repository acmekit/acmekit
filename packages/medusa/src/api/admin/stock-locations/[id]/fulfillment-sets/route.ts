import { createLocationFulfillmentSetWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { refetchStockLocation } from "../../helpers"
import { HttpTypes } from "@medusajs/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateStockLocationFulfillmentSet,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminStockLocationResponse>
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
