import { createLinksWorkflow } from "@acmekit/core-flows"
import { Modules } from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { refetchVariant } from "../../../../helpers"
import { AdminCreateVariantInventoryItemType } from "../../../../validators"
import { HttpTypes } from "@acmekit/framework/types"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    AdminCreateVariantInventoryItemType,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminProductVariantResponse>
) => {
  const variantId = req.params.variant_id

  await createLinksWorkflow(req.scope).run({
    input: [
      {
        [Modules.PRODUCT]: { variant_id: variantId },
        [Modules.INVENTORY]: {
          inventory_item_id: req.validatedBody.inventory_item_id,
        },
        data: { required_quantity: req.validatedBody.required_quantity },
      },
    ],
  })

  const variant = await refetchVariant(
    variantId,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ variant })
}
