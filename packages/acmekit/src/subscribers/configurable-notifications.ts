import { INotificationModuleService } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  pickValueFromObject,
  promiseAll,
} from "@acmekit/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "../types/subscribers"

type HandlerConfig = {
  event: string
  template: string
  channel: string
  to: string
  resource_id: string
  data: Record<string, string>
}

// TODO: Load from acmekit-config.js for domain-specific notifications.
// Empty by default for generic apps; add entries for events your app emits.
const handlerConfig: HandlerConfig[] = []

const configAsMap = handlerConfig.reduce(
  (acc: Record<string, HandlerConfig[]>, h) => {
    if (!acc[h.event]) {
      acc[h.event] = []
    }

    acc[h.event].push(h)
    return acc
  },
  {}
)

export default async function configurableNotifications({
  event,
  container,
}: SubscriberArgs<any>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const notificationService: INotificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )

  const handlers = configAsMap[event.name] ?? []
  const payload = event.data

  await promiseAll(
    handlers.map(async (handler) => {
      const notificationData = {
        template: handler.template,
        channel: handler.channel,
        to: pickValueFromObject(handler.to, payload),
        trigger_type: handler.event,
        resource_id: pickValueFromObject(handler.resource_id, payload),
        data: Object.entries(handler.data).reduce((acc, [key, value]) => {
          acc[key] = pickValueFromObject(value, payload)
          return acc
        }, {}),
      }

      // We don't want to fail all handlers, so we catch and log errors only
      try {
        await notificationService.createNotifications(notificationData)
      } catch (err) {
        logger.error(
          `Failed to send notification for ${event.name}`,
          err.message
        )
      }
    })
  )
}

export const config: SubscriberConfig = {
  event: handlerConfig.map((h) => h.event),
  context: {
    subscriberId: "configurable-notifications-handler",
  },
}
