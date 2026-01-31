import { HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import { AdminGetWorkflowExecutionDetailsParamsType } from "../validators"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<AdminGetWorkflowExecutionDetailsParamsType>,
  res: AcmeKitResponse<HttpTypes.AdminWorkflowExecutionResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "workflow_execution",
    variables,
    fields: req.queryConfig.fields,
  })

  const [workflowExecution] = await remoteQuery(queryObject)
  res.status(200).json({ workflow_execution: workflowExecution })
}
