import { Logger, NotificationTypes } from "@acmekit/framework/types"
import { AbstractNotificationProviderService } from "@acmekit/framework/utils"
import { AcmeKitCloudEmailOptions } from "@types"

export class AcmeKitCloudEmailNotificationProvider extends AbstractNotificationProviderService {
  static identifier = "notification-acmekit-cloud-email"
  protected options_: AcmeKitCloudEmailOptions
  protected logger_: Logger

  constructor({}, options: AcmeKitCloudEmailOptions) {
    super()

    this.options_ = options
  }

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${this.options_.api_key}`,
    }

    if (this.options_.sandbox_handle) {
      headers["x-acmekit-sandbox-handle"] = this.options_.sandbox_handle
    }

    if (this.options_.environment_handle) {
      headers["x-acmekit-environment-handle"] = this.options_.environment_handle
    }

    try {
      const response = await fetch(`${this.options_.endpoint}/send`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          to: notification.to,
          from: notification.from,
          attachments: notification.attachments,
          template: notification.template,
          data: notification.data,
          provider_data: notification.provider_data,
          content: notification.content,
        }),
      })
      const responseBody = await response.json()

      if (!response.ok) {
        throw new Error(
          `Failed to send email: ${response.status} - ${response.statusText}: ${responseBody.message}`
        )
      }

      return { id: responseBody.id }
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`)
    }
  }
}
