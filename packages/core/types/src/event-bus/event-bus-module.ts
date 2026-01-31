import {
  InterceptorSubscriber,
  Message,
  Subscriber,
  SubscriberContext,
} from "./common"

export interface IEventBusModuleService {
  /**
   * This method emits one or more events. Subscribers listening to the event(s) are executed asynchronously.
   *
   * @param data - The details of the events to emit.
   * @param options - Additional options for the event.
   *
   * @example
   * await eventModuleService.emit({
   *   name: "user.created",
   *   data: {
   *     user_id: "user_123"
   *   }
   * })
   */
  emit<T>(
    data: Message<T> | Message<T>[],
    options?: Record<string, unknown>
  ): Promise<void>

  /**
   * This method adds a subscriber to an event. It's mainly used internally to register subscribers.
   *
   * @param eventName - The name of the event to subscribe to.
   * @param subscriber - The subscriber function to execute when the event is emitted.
   * @param context - The context of the subscriber.
   * @returns The instance of the Event Module
   *
   * @example
   * eventModuleService.subscribe("user.created", async (data) => {
   *   console.log("User created", data)
   * })
   */
  subscribe(
    eventName: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this

  /**
   * This method removes a subscriber from an event. It's mainly used internally to unregister subscribers.
   *
   * @param eventName - The name of the event to unsubscribe from.
   * @param subscriber - The subscriber function to remove.
   * @param context - The context of the subscriber.
   * @returns The instance of the Event Module
   *
   * @example
   * eventModuleService.unsubscribe("user.created", async (data) => {
   *   console.log("User created", data)
   * })
   */
  unsubscribe(
    eventName: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this

  /**
   * This method emits all events in the specified group. Grouped events are useful when you have distributed transactions
   * where you need to explicitly group, release and clear events upon lifecycle events of a transaction.
   *
   * @param eventGroupId - The ID of the event group.
   *
   * @example
   * await eventModuleService.releaseGroupedEvents("group_123")
   */
  releaseGroupedEvents(eventGroupId: string): Promise<void>
  /**
   * This method removes all events in the specified group. Grouped events are useful when you have distributed transactions
   * where you need to explicitly group, release and clear events upon lifecycle events of a transaction.
   *
   * @param eventGroupId - The ID of the event group.
   * @param options - Additional options for the event.
   * @param options.eventNames - The names of the events to clear. If not provided, The group will
   * be entirely cleared.
   *
   * @example
   * await eventModuleService.clearGroupedEvents("group_123")
   */
  clearGroupedEvents(
    eventGroupId: string,
    options?: {
      eventNames?: string[]
    }
  ): Promise<void>

  /**
   * This method adds an interceptor to the event bus. This means that the interceptor will be
   * called before the event is emitted.
   *
   * @param interceptor - The interceptor to add.
   * @returns The instance of the Event Module
   *
   * @example
   * eventModuleService.addInterceptor((message, context) => {
   *   console.log("Interceptor", message, context)
   * })
   */
  addInterceptor?(interceptor: InterceptorSubscriber): this

  /**
   * This method removes an interceptor from the event bus.
   *
   * @param interceptor - The interceptor to remove.
   * @returns The instance of the Event Module
   *
   * @example
   * eventModuleService.removeInterceptor((message, context) => {
   *   console.log("Interceptor", message, context)
   * })
   */
  removeInterceptor?(interceptor: InterceptorSubscriber): this
}
