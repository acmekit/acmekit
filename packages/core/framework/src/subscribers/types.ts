import { Event, AcmeKitContainer } from "@acmekit/types"

interface SubscriberContext extends Record<string, unknown> {
  subscriberId?: string
}

export type SubscriberConfig = {
  event: string | string[]
  context?: SubscriberContext
}

export type SubscriberArgs<T = unknown> = {
  event: Event<T>
  container: AcmeKitContainer
  pluginOptions: Record<string, unknown>
}
