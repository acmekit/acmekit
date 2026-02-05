import type { ApiKeyDTO, CreateApiKeyDTO } from "@acmekit/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@acmekit/framework/workflows-sdk"
import { createApiKeysStep } from "../steps"

/**
 * The data to create API keys.
 */
export type CreateApiKeysWorkflowInput = {
  /**
   * The API keys to create.
   */
  api_keys: CreateApiKeyDTO[]
}

/**
 * The created API keys.
 */
export type CreateApiKeysWorkflowOutput = ApiKeyDTO[]

export const createApiKeysWorkflowId = "create-api-keys"
/**
 * This workflow creates one or more API keys (client or secret). It's used by the
 * Create API Key Admin API Route.
 *
 * @example
 * const { result } = await createApiKeysWorkflow(container).run({
 *   input: {
 *     api_keys: [
 *       { type: "client", title: "Default client key", created_by: "user_123" }
 *     ]
 *   }
 * })
 *
 * @summary Create client or secret API keys.
 */
export const createApiKeysWorkflow = createWorkflow(
  createApiKeysWorkflowId,
  (input: WorkflowData<CreateApiKeysWorkflowInput>) => {
    const apiKeys = createApiKeysStep(input)

    const apiKeysCreated = createHook("apiKeysCreated", {
      apiKeys,
    })

    return new WorkflowResponse(apiKeys, {
      hooks: [apiKeysCreated],
    })
  }
)
