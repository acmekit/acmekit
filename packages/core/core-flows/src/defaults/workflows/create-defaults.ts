import { createWorkflow, when, WorkflowResponse } from "@acmekit/framework/workflows-sdk"
import { createApiKeysStep } from "../../api-key"
import { useQueryGraphStep } from "../../common"

export const createDefaultsWorkflowID = "create-defaults"
/**
 * This workflow creates default data for an AcmeKit application, including
 * a default client API key if none exists. The application uses this workflow
 * to create the default data when first started.
 *
 * You can use this workflow within your customizations or custom workflows.
 *
 * @example
 * const { result } = await createDefaultsWorkflow(container).run()
 *
 * @summary Create default data for an AcmeKit application.
 */
export const createDefaultsWorkflow = createWorkflow(
  createDefaultsWorkflowID,
  () => {
    const clientApiKey = useQueryGraphStep({
      entity: "api_key",
      fields: ["id", "type"],
      filters: {
        type: "client",
      },
      options: {
        isList: false,
      },
    })

    when({ clientApiKey }, ({ clientApiKey }) => !clientApiKey?.data).then(
      () => {
        createApiKeysStep({
          api_keys: [
            {
              title: "Default Client API Key",
              type: "client",
              created_by: "",
            },
          ],
        })
      }
    )

    return new WorkflowResponse(void 0)
  }
)
