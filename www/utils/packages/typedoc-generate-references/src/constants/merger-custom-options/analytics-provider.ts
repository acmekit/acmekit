import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const analyticsProviderOptions: FormattingOptionsType = {
  "^analytics_provider/.*AbstractAnalyticsProviderService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create an Analytics Module Provider and the methods you must implement in its main service.`,
    frontmatterData: {
      slug: "/references/analytics/provider",
      keywords: ["analytics", "provider", "integration"],
    },
    reflectionTitle: {
      fullReplacement: "How to Create an Analytics Module Provider",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    expandProperties: true,
    sortMembers: true,
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
      reflection_typeParameters: false,
    },
    startSections: [
      `## Implementation Example
      
As you implement your Analytics Module Provider, it can be useful to refer to an existing provider and how it's implemeted.

If you need to refer to an existing implementation as an example, check the [PostHog Analytics Module Provider in the Medusa repository](https://github.com/medusajs/medusa/tree/develop/packages/modules/providers/analytics-posthog).`,
      `## Create Module Provider Directory

Start by creating a new directory for your module provider.

If you're creating the module provider in a Medusa application, create it under the \`src/modules\` directory. For example, \`src/modules/my-analytics\`.

If you're creating the module provider in a plugin, create it under the \`src/providers\` directory. For example, \`src/providers/my-analytics\`.

<Note>

The rest of this guide always uses the \`src/modules/my-analytics\` directory as an example.

</Note>`,
      `## 2. Create the Analytics Module Provider's Service

Create the file \`src/modules/my-analytics/service.ts\` that holds the implementation of the module provider's main service. It must extend the \`AbstractAnalyticsProviderService\` class imported from \`@medusajs/framework/utils\`:

\`\`\`ts title="src/modules/my-analytics/service.ts"
import { AbstractAnalyticsProviderService } from "@medusajs/framework/utils"

class MyAnalyticsProviderService extends AbstractAnalyticsProviderService {
  // TODO implement methods
}

export default MyAnalyticsProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Provider Definition File

Create the file \`src/modules/my-analytics/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-analytics/index.ts"
import MyAnalyticsProviderService from "./service"
import { 
  ModuleProvider, 
  Modules
} from "@medusajs/framework/utils"

export default ModuleProvider(Modules.ANALYTICS, {
  services: [MyAnalyticsProviderService],
})
\`\`\`

This exports the module provider's definition, indicating that the \`MyAnalyticsProviderService\` is the module provider's service.`,
      `## 4. Use Module Provider

To use your Analytics Module Provider, add it to the \`providers\` array of the Analytics Module in \`medusa-config.ts\`:

<Note>

The Analytics Module accepts one provider only.

</Note>

\`\`\`ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/analytics",
      options: {
        providers: [
          {
            // if module provider is in a plugin, use \`plugin-name/providers/my-analytics\`
            resolve: "./src/modules/my-analytics",
            id: "my-analytics",
            options: {
              // provider options...
            },
          },
        ],
      },
    },
  ]
})
\`\`\`
`,
      `## 5. Test it Out

To test the module out, you'll track in your third-party provider when an order is placed.

You'll first create a [workflow](!docs!/learn/fundamentals/workflows) that tracks the order completion event. Then, you can execute the workflow in a [subscriber](!docs!/learn/fundamentals/events-and-subscribers) that listens to the \`order.placed\` event.

For example, create a workflow at \`src/workflows/track-order-placed.ts\` with the following content:

\`\`\`ts title="src/workflows/track-order-created.ts"
import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { OrderDTO } from "@medusajs/framework/types"

type StepInput = {
  order: OrderDTO
}

const trackOrderCreatedStep = createStep(
  "track-order-created-step",
  async ({ order }: StepInput, { container }) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS)

    await analyticsModuleService.track({
      event: "order_created",
      userId: order.customer_id,
      properties: {
        order_id: order.id,
        total: order.total,
        items: order.items.map((item) => ({
          variant_id: item.variant_id,
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        customer_id: order.customer_id,
      },
    })
  }
)

type WorkflowInput = {
  order_id: string
}

export const trackOrderCreatedWorkflow = createWorkflow(
  "track-order-created-workflow",
  ({ order_id }: WorkflowInput) => {
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "*",
        "customer.*",
        "items.*"
      ],
      filters: {
        id: order_id,
      },
    })
    trackOrderCreatedStep({
      order: orders[0],
    })
  }
)
\`\`\`

This workflow retrieves the order details using the \`useQueryGraphStep\` and then tracks the order creation event using the \`trackOrderCreatedStep\`.

In the step, you resolve the service of the Analytics Module from the [Medusa container](!docs!/learn/fundamentals/medusa-container) and use its \`track\` method to track the event. This method will use the underlying provider configured (which is your provider, in this case) to track the event.

Next, create a subscriber at \`src/subscribers/order-placed.ts\` with the following content:

\`\`\`ts title="src/subscribers/order-placed.ts"
import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import { trackOrderCreatedWorkflow } from "../workflows/track-order-created"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await trackOrderCreatedWorkflow(container).run({
    input: {
      order_id: data.id,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
\`\`\`

This subscriber listens to the \`order.placed\` event and executes the \`trackOrderCreatedWorkflow\` workflow, passing the order ID as input.

You'll now track the order creation event whenever an order is placed in your Medusa application. You can test this out by placing an order and checking in your third-party provider if the event was tracked successfully.
`,
      `## Additional Resources

- [How to Use the Analytics Module](/references/analytics/service)
`,
    ],
  },
}

export default analyticsProviderOptions
