import { Client } from "../client"
import { ApiKey } from "./api-key"
import { Claim } from "./claim"
import { Customer } from "./customer"
import { CustomerGroup } from "./customer-group"
import { DraftOrder } from "./draft-order"
import { Exchange } from "./exchange"
import { Fulfillment } from "./fulfillment"
import { FulfillmentProvider } from "./fulfillment-provider"
import { FulfillmentSet } from "./fulfillment-set"
import { Invite } from "./invite"
import { Notification } from "./notification"
import { Order } from "./order"
import { OrderEdit } from "./order-edit"
import { Payment } from "./payment"
import { PaymentCollection } from "./payment-collection"
import { Plugin } from "./plugin"
import { RefundReason } from "./refund-reasons"
import { Return } from "./return"
import { ReturnReason } from "./return-reason"
import { SalesChannel } from "./sales-channel"
import { ShippingOption } from "./shipping-option"
import { ShippingProfile } from "./shipping-profile"
import { User } from "./user"
import { Views } from "./views"
import { WorkflowExecution } from "./workflow-execution"
import { ShippingOptionType } from "./shipping-option-type"
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
   * @tags fulfillment
   */
  public fulfillmentSet: FulfillmentSet
  /**
   * @tags fulfillment
   */
  public fulfillment: Fulfillment
  /**
   * @tags fulfillment
   */
  public fulfillmentProvider: FulfillmentProvider
  /**
   * @tags fulfillment
   */
  public shippingOption: ShippingOption
  /**
   * @tags fulfillment
   */
  public shippingOptionType: ShippingOptionType
  /**
   * @tags fulfillment
   */
  public shippingProfile: ShippingProfile
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
   * @tags payment
   */
  public payment: Payment
  /**
   * @tags order
   */
  public refundReason: RefundReason
  /**
   * @tags payment
   */
  public paymentCollection: PaymentCollection
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
    this.fulfillmentSet = new FulfillmentSet(client)
    this.fulfillment = new Fulfillment(client)
    this.fulfillmentProvider = new FulfillmentProvider(client)
    this.shippingOption = new ShippingOption(client)
    this.shippingOptionType = new ShippingOptionType(client)
    this.shippingProfile = new ShippingProfile(client)
    this.notification = new Notification(client)
    this.order = new Order(client)
    this.draftOrder = new DraftOrder(client)
    this.orderEdit = new OrderEdit(client)
    this.return = new Return(client)
    this.claim = new Claim(client)
    this.translation = new Translation(client)
    this.user = new User(client)
    this.locale = new Locale(client)
    this.payment = new Payment(client)
    this.refundReason = new RefundReason(client)
    this.exchange = new Exchange(client)
    this.paymentCollection = new PaymentCollection(client)
    this.apiKey = new ApiKey(client)
    this.workflowExecution = new WorkflowExecution(client)
    this.customerGroup = new CustomerGroup(client)
    this.plugin = new Plugin(client)
    this.views = new Views(client)
  }
}
