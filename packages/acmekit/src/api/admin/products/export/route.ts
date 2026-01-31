import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"
import { remapKeysForProduct } from "../helpers"
import { exportProductsWorkflow } from "@acmekit/core-flows"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<{}, HttpTypes.AdminProductExportParams>,
  res: AcmeKitResponse<HttpTypes.AdminExportProductResponse>
) => {
  const selectFields = remapKeysForProduct(req.queryConfig.fields ?? [])
  const input = { select: selectFields, filter: req.filterableFields }

  const { transaction } = await exportProductsWorkflow(req.scope).run({
    input,
  })

  res.status(202).json({ transaction_id: transaction.transactionId })
}
