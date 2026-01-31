import { listShippingOptionsForOrderWorkflow } from "@acmekit/core-flows"
import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"
import { AdminShippingOption, HttpTypes } from "@acmekit/framework/types"

/**
 * @since 2.10.0
 */
export const GET = async (
  req: AcmeKitRequest<{}, HttpTypes.AdminGetOrderShippingOptionList>,
  res: AcmeKitResponse<{ shipping_options: AdminShippingOption[] }>
) => {
  const { id } = req.params

  const workflow = listShippingOptionsForOrderWorkflow(req.scope)
  const { result: shipping_options } = await workflow.run({
    input: {
      order_id: id,
    },
  })

  res.json({ shipping_options })
}
