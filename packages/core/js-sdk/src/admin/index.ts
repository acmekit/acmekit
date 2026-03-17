import { Client } from "../client"
import { ApiKey } from "./api-key"
import { Claim } from "./claim"
import { Customer } from "./customer"
import { CustomerGroup } from "./customer-group"
import { DraftOrder } from "./draft-order"
import { Exchange } from "./exchange"
import { Invite } from "./invite"
import { Notification } from "./notification"
import { Order } from "./order"
import { OrderEdit } from "./order-edit"
import { Plugin } from "./plugin"
import { RefundReason } from "./refund-reasons"
import { Return } from "./return"
import { ReturnReason } from "./return-reason"
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
   * @tags order
   */
  public returnReason: ReturnReason
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
  public order: Order
  /**
   * @tags order
   */
  public draftOrder: DraftOrder
  /**
   * @tags order
   */
  public orderEdit: OrderEdit
  /**
   * @tags order
   */
  public return: Return
  /**
   * @tags order
   */
  public claim: Claim
  /**
   * @tags order
   */
  public exchange: Exchange
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
   * @tags order
   */
  public refundReason: RefundReason
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
    this.returnReason = new ReturnReason(client)
    this.salesChannel = new SalesChannel(client)
    this.notification = new Notification(client)
    this.order = new Order(client)
    this.draftOrder = new DraftOrder(client)
    this.orderEdit = new OrderEdit(client)
    this.return = new Return(client)
    this.claim = new Claim(client)
    this.translation = new Translation(client)
    this.user = new User(client)
    this.locale = new Locale(client)
    this.refundReason = new RefundReason(client)
    this.exchange = new Exchange(client)
    this.apiKey = new ApiKey(client)
    this.workflowExecution = new WorkflowExecution(client)
    this.customerGroup = new CustomerGroup(client)
    this.plugin = new Plugin(client)
    this.views = new Views(client)
  }
}
