import { getOrdersListWorkflow } from "@acmekit/core-flows"
import { HttpTypes, OrderDTO } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminOrderFilters>,
  res: AcmeKitResponse<HttpTypes.AdminOrderListResponse>
) => {
  const variables = {
    filters: {
      ...req.filterableFields,
      is_draft_order: false,
    },
    ...req.queryConfig.pagination,
  }

  const workflow = getOrdersListWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      fields: req.queryConfig.fields,
      variables,
    },
  })

  const { rows, metadata } = result as {
    rows: OrderDTO[]
    metadata: any
  }
  res.json({
    orders: rows as unknown as HttpTypes.AdminOrder[],
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
