import { Client } from "../client"
import { ApiKey } from "./api-key"
import { Customer } from "./customer"
import { CustomerGroup } from "./customer-group"
import { DraftOrder } from "./draft-order"
import { Invite } from "./invite"
import { Notification } from "./notification"
import { Plugin } from "./plugin"
import { SalesChannel } from "./sales-channel"
import { User } from "./user"
import { Views } from "./views"
import { WorkflowExecution } from "./workflow-execution"
import { Locale } from "./locale"
import { Translation } from "./translation"

export class Admin {
  /**
   * @tags user
   */
  public invite: Invite
  /**
   * @tags customer
   */
  public customer: Customer
  /**
   * @tags sales channel
   */
  public salesChannel: SalesChannel
  /**
   * @tags notification
   */
  public notification: Notification
  /**
   * @tags order
   */
  public draftOrder: DraftOrder
  /**
   * @tags user
   */
  public user: User
  /**
   * @tags locale
   * @since 2.12.3
   */
  public locale: Locale
  /**
   * @tags api key
   */
  public apiKey: ApiKey
  /**
   * @tags workflow
   */
  public workflowExecution: WorkflowExecution
  /**
   * @tags customer
   */
  public customerGroup: CustomerGroup
  /**
   * @tags translations
   */
  public translation: Translation
  /**
   * @tags plugin
   */
  public plugin: Plugin
  /**
   * @tags views
   * @featureFlag view_configurations
   */
  public views: Views

  constructor(client: Client) {
    this.invite = new Invite(client)
    this.customer = new Customer(client)
    this.salesChannel = new SalesChannel(client)
    this.notification = new Notification(client)
    this.draftOrder = new DraftOrder(client)
    this.translation = new Translation(client)
    this.user = new User(client)
    this.locale = new Locale(client)
    this.apiKey = new ApiKey(client)
    this.workflowExecution = new WorkflowExecution(client)
    this.customerGroup = new CustomerGroup(client)
    this.plugin = new Plugin(client)
    this.views = new Views(client)
  }
}
