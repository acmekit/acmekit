import { FormattingOptionsType } from "types"

const analyticsOptions: FormattingOptionsType = {
  "^analytics/.*IAnalyticsModuleService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn about the different methods in the Analytics Module's service and how to use them.
    
:::note

The Analytics Module is available starting [Medusa v2.8.3](https://github.com/medusajs/medusa/releases/tag/v2.8.3).

:::`,
    frontmatterData: {
      slug: "/references/analytics/service",
      tags: ["analytics", "server", "how to"],
      sidebar_label: "Use Analytics Module",
    },
    reflectionTitle: {
      fullReplacement: "How to Use Analytics Module",
    },
    expandMembers: true,
    sortMembers: true,
    startSections: [
      `## Configure Analytics Module Provider
      
To use the Analytics Module, you need to configure it along with an Analytics Module Provider.

Medusa provides two Analytics Module Providers: [Local](/infrastructure-modules/analytics/local) and [PostHog](/infrastructure-modules/analytics/posthog) module providers.

To configure the Analytics Module and its provider, add it to the list of modules in your \`medusa-config.ts\` file. For example:

\`\`\`ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/analytics",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/analytics-local",
            id: "local",
          },
        ],
      },
    },
  ],
})
\`\`\`

Refer to the documentation of each provider for specific configuration options.
`,
      `## Resolve Analytics Module's Service

In your workflow's step, you can resolve the Analytics Module's service from the Medusa container:

\`\`\`ts
import { Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  "step-1",
  async ({}, { container }) => {
    const analyticsModuleService = container.resolve(
      Modules.Analytics
    )
    
    // TODO use analyticsModuleService
  } 
)
\`\`\`

You can then use the Analytics Module's service's methods in the step, which would use the underlying provider's logic. The rest of this guide details these methods.

---
`,
    ],
  },
}

export default analyticsOptions
