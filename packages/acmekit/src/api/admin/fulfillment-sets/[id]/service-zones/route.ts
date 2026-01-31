import { createServiceZonesWorkflow } from "@acmekit/core-flows"
import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"
import { refetchFulfillmentSet } from "../../helpers"
import { HttpTypes } from "@acmekit/framework/types"

export const POST = async (
  req: AcmeKitRequest<
    HttpTypes.AdminCreateFulfillmentSetServiceZone,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminFulfillmentSetResponse>
) => {
  const workflowInput = {
    data: [
      {
        fulfillment_set_id: req.params.id,
        name: req.validatedBody.name,
        geo_zones: req.validatedBody.geo_zones,
      },
    ],
  }

  await createServiceZonesWorkflow(req.scope).run({
    input: workflowInput,
  })

  const fulfillmentSet = await refetchFulfillmentSet(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ fulfillment_set: fulfillmentSet })
}
