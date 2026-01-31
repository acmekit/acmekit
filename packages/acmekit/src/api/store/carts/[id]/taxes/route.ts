import { updateTaxLinesWorkflow } from "@acmekit/core-flows"
import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"
import { refetchCart } from "../../helpers"

export const POST = async (
  req: AcmeKitRequest<{}, HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.StoreCartResponse>
) => {
  await updateTaxLinesWorkflow(req.scope).run({
    input: {
      cart_id: req.params.id,
      force_tax_calculation: true,
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ cart })
}
