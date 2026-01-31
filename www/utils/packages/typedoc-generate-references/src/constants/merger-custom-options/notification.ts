import { FormattingOptionsType } from "types"
import baseSectionsOptions from "../base-section-options.js"

const notificationOptions: FormattingOptionsType = {
  "^notification/.*AbstractNotificationProviderService": {
    reflectionGroups: {
      Constructors: false,
    },
    reflectionDescription: `In this document, you’ll learn how to create a Notification Module Provider and the methods you must implement in it.`,
    frontmatterData: {
      slug: "/references/notification-provider-module",
      tags: ["notification", "server", "how to"],
      sidebar_label: "Create Notification Provider",
    },
    reflectionTitle: {
      fullReplacement: "How to Create a Notification Module Provider",
    },
    shouldIncrementAfterStartSections: true,
    expandMembers: true,
    expandProperties: true,
    sections: {
      ...baseSectionsOptions,
      member_declaration_title: false,
      reflection_typeParameters: false,
    },
    maxLevel: 2,
    startSections: [
      `## Implementation Example
      
As you implement your Notification Module Provider, it can be useful to refer to an existing provider and how it's implemeted.

If you need to refer to an existing implementation as an example, check the [SendGrid Notification Module Provider in the AcmeKit repository](https://github.com/acmekit/acmekit/tree/develop/packages/modules/providers/notification-sendgrid).`,
      `## 1. Create Module Provider Directory

Start by creating a new directory for your module provider.

If you're creating the module provider in a AcmeKit application, create it under the \`src/modules\` directory. For example, \`src/modules/my-notification\`.

If you're creating the module provider in a plugin, create it under the \`src/providers\` directory. For example, \`src/providers/my-notification\`.

<Note>

The rest of this guide always uses the \`src/modules/my-notification\` directory as an example.

</Note>`,
      `## 2. Create the Notification Module Provider's Service

Create the file \`src/modules/my-notification/service.ts\` that holds the implementation of the notification service.

The Notification Module Provider's main service must extend the \`AbstractNotificationProviderService\` class imported from \`@acmekit/framework/utils\`:

\`\`\`ts title="src/modules/my-notification/service.ts"
import { 
  AbstractNotificationProviderService
} from "@acmekit/framework/utils"

class MyNotificationProviderService extends AbstractNotificationProviderService {
  // TODO add methods
}

export default MyNotificationProviderService
\`\`\``,
    ],
    endSections: [
      `## 3. Create Module Provider Definition File

Create the file \`src/modules/my-notification/index.ts\` with the following content:

\`\`\`ts title="src/modules/my-notification/index.ts"
import MyNotificationProviderService from "./service"
import { 
  ModuleProvider, 
  Modules
} from "@acmekit/framework/utils"

export default ModuleProvider(Modules.NOTIFICATION, {
  services: [MyNotificationProviderService],
})
\`\`\`

This exports the module provider's definition, indicating that the \`MyNotificationProviderService\` is the module provider's service.

<Note title="Tip">

A notification module provider can have export multiple provider services, where each are registered as a separate notification provider.

</Note>`,
      `## 4. Use Module Provider

To use your Notification Module Provider, add it to the \`providers\` array of the Notification Module in \`acmekit-config.ts\`:

<Note>

The Notification Module accepts one provider per channel.

</Note>

\`\`\`ts title="acmekit-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@acmekit/acmekit/notification",
      options: {
        providers: [
          // default provider
          {
            resolve: "@acmekit/acmekit/notification-local",
            id: "local",
            options: {
              name: "Local Notification Provider",
              channels: ["feed"],
            },
          },
          {
            // if module provider is in a plugin, use \`plugin-name/providers/my-notification\`
            resolve: "./src/modules/my-notification",
            id: "my-notification",
            options: {
              channels: ["email"],
              // provider options...
            },
          },
        ],
      },
    },
  ]
})
\`\`\`

Make sure to specify the correct channels for your provider in the \`channels\` option.`,
      `## 5. Test it Out

### Create Subscriber

To test out the provider, create a subscriber at \`src/subscribers/user-created.ts\` with the following content:

\`\`\`ts title="src/subscribers/user-created.ts"
import { Modules } from "@acmekit/framework/utils"
import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@acmekit/acmekit"

export default async function userCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )
  const query = container.resolve("query")

  const { data: [user] } = await query.graph({
    entity: "user",
    fields: ["*"],
    filters: {
      id: data.id,
    }
  })

  await notificationModuleService.createNotifications({
    to: user.email,
    channel: "email",
    template: "new-user"
  })
}

export const config: SubscriberConfig = {
  event: "user.created",
}
\`\`\`

In the subscriber, you resolve the Notification and User modules. Then, you use the User Module's main service to retrieve the user's details.

Finally, you use the Notification Module's main service to send a notification to the user's email through the \`email\` channel (assuming that's your provider's channel).

Make sure to replace the value of \`template\` to the ID of the template in your provider.

### Create User

Use the following command to create a user:

\`\`\`bash
npx acmekit user -e admin@test.com -p supersecret
\`\`\`

After the user is created, the subscriber is executed, sending the notification using your provider.
`,
    ],
  },
}

export default notificationOptions
