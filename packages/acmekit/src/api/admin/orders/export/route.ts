import { exportOrdersWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"

/**
 * @since 2.12.3
 */
export const POST = async (
  req: AuthenticatedAcmeKitRequest<{}, HttpTypes.AdminOrderFilters>,
  res: AcmeKitResponse<HttpTypes.AdminExportOrderResponse>
) => {
  const selectFields = req.queryConfig.fields ?? []
  const input = { select: selectFields, filter: req.filterableFields }

  const { transaction } = await exportOrdersWorkflow(req.scope).run({
    input,
  })

  res.status(202).json({ transaction_id: transaction.transactionId })
}
