import {
  AuthenticatedMedusaRequest,
  AcmeKitResponse,
} from "/framework/http"

import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "/framework/utils"
import { AdminGetWorkflowExecutionDetailsParamsType } from "../../validators"
import { HttpTypes } from "/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetWorkflowExecutionDetailsParamsType>,
  res: AcmeKitResponse<HttpTypes.AdminWorkflowExecutionResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { workflow_id, transaction_id } = req.params
  const variables = { workflow_id, transaction_id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "workflow_execution",
    variables,
    fields: req.queryConfig.fields,
  })

  const [workflowExecution] = await remoteQuery(queryObject)

  res.status(200).json({ workflow_execution: workflowExecution })
}
