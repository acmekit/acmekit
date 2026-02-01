import { createWorkflow, when, WorkflowResponse } from "@acmekit/framework/workflows-sdk"
import { createApiKeysStep } from "../../api-key"
import { useQueryGraphStep } from "../../common"
import { createDefaultStoreStep } from "../steps/create-default-store"

export const createDefaultsWorkflowID = "create-defaults"
/**
 * This workflow creates default data for a AcmeKit application, including
 * a default store and publishable API key. The AcmeKit application uses this workflow
 * to create the default data, if not existing, when the application is first started.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * create default data within your custom flows, such as seed scripts.
 *
 * @example
 * const { result } = await createDefaultsWorkflow(container)
 * .run()
 *
 * @summary
 *
 * Create default data for a AcmeKit application.
 */
export const createDefaultsWorkflow = createWorkflow(
  createDefaultsWorkflowID,
  () => {
    const store = createDefaultStoreStep({
      store: {},
    })

    const publishableApiKey = useQueryGraphStep({
      entity: "api_key",
      fields: ["id", "type"],
      filters: {
        type: "publishable",
      },
      options: {
        isList: false,
      },
    })

    when(
      { publishableApiKey },
      ({ publishableApiKey }) => !publishableApiKey?.data
    ).then(() => {
      createApiKeysStep({
        api_keys: [
          {
            title: "Default Publishable API Key",
            type: "publishable",
            created_by: "",
          },
        ],
      })
    })

    return new WorkflowResponse(store)
  }
)
