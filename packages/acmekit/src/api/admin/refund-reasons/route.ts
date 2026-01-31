import { createRefundReasonsWorkflow } from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntities,
  refetchEntity,
} from "@acmekit/framework/http"
import {
  HttpTypes,
  PaginatedResponse,
  RefundReasonResponse,
  RefundReasonsResponse,
} from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.RefundReasonFilters>,
  res: AcmeKitResponse<PaginatedResponse<RefundReasonsResponse>>
) => {
  const { data: refund_reasons, metadata } = await refetchEntities({
    entity: "refund_reasons",
    idOrFilter: req.filterableFields,
    scope: req.scope,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  res.json({
    refund_reasons,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreateRefundReason,
    HttpTypes.AdminRefundReasonParams
  >,
  res: AcmeKitResponse<RefundReasonResponse>
) => {
  const {
    result: [refundReason],
  } = await createRefundReasonsWorkflow(req.scope).run({
    input: { data: [req.validatedBody] },
  })

  const refund_reason = await refetchEntity({
    entity: "refund_reason",
    idOrFilter: refundReason.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ refund_reason })
}
