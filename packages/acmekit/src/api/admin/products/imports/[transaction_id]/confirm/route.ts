import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import {
  importProductsAsChunksWorkflowId,
  waitConfirmationProductImportStepId,
} from "@acmekit/core-flows"
import { IWorkflowEngineService } from "@acmekit/framework/types"
import { Modules, TransactionHandlerType } from "@acmekit/framework/utils"
import { StepResponse } from "@acmekit/framework/workflows-sdk"

/**
 * @since 2.8.5
 */
export const POST = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    Modules.WORKFLOW_ENGINE
  )
  const transactionId = req.params.transaction_id

  await workflowEngineService.setStepSuccess({
    idempotencyKey: {
      action: TransactionHandlerType.INVOKE,
      transactionId,
      stepId: waitConfirmationProductImportStepId,
      workflowId: importProductsAsChunksWorkflowId,
    },
    stepResponse: new StepResponse(true),
  })

  res.status(202).json({})
}
