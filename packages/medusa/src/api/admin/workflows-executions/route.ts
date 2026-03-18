import { HttpTypes } from "/framework/types"
import {
  AuthenticatedMedusaRequest,
  AcmeKitResponse,
} from "/framework/http"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetWorkflowExecutionsParams>,
  res: AcmeKitResponse<HttpTypes.AdminWorkflowExecutionListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "workflow_execution",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: workflowExecutions, metadata } = await remoteQuery(queryObject)

  res.json({
    workflow_executions: workflowExecutions,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
