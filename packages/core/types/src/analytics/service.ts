import { IModuleService } from "../modules-sdk"
import { IdentifyAnalyticsEventDTO, TrackAnalyticsEventDTO } from "./mutations"
import { IAnalyticsProvider } from "./provider"

export interface IAnalyticsModuleService extends IModuleService {
  /**
   * This method returns the service of the configured Analytics Module Provider in `medusa-config.ts`. This is useful
   * if you want to execute custom methods defined in the provider's service or you need direct access to it.
   * 
   * @returns {IAnalyticsProvider} An instance of the Analytics Module Provider's service.
   * 
   * @example
   * const postHogProviderService = analyticsModuleService.getProvider()
   * // TODO: perform custom actions with the provider
   */
  getProvider(): IAnalyticsProvider

  /**
   * This method tracks an event in the analytics provider. The Analytics Module
   * will use the `track` method of the underlying provider configured in `medusa-config.ts` to track the event.
   *
   * @param {TrackAnalyticsEventDTO} data - The event's details.
   * @returns {Promise<void>} Resolves when the event is tracked successfully.
   *
   * @example
   * await analyticsModuleService.track({
   *   event: "order_placed",
   *   properties: {
   *     order_id: "order_123",
   *     customer_id: "customer_456",
   *     total: 100,
   *   }
   * })
   */
  track(data: TrackAnalyticsEventDTO): Promise<void>

  /**
   * This method identifies an actor or group in the analytics provider. The Analytics Module
   * will use the `identify` method of the underlying provider configured in `medusa-config.ts` to identify the actor or group.
   *
   * @param {IdentifyAnalyticsEventDTO} data - The details of the actor or group.
   * @returns {Promise<void>} Resolves when the actor or group is identified successfully.
   *
   * @example
   * await analyticsModuleService.identify({
   *   actor_id: "123",
   *   properties: {
   *     name: "John Doe"
   *   }
   * })
   */
  identify(data: IdentifyAnalyticsEventDTO): Promise<void>
}
