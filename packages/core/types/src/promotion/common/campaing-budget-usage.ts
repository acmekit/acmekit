/**
 * The context passed when promotion use is registered, reverted or limit is checked.
 */
export type CampaignBudgetUsageContext = {
  /**
   * The ID of the customer.
   */
  customer_id: string | null
  /**
   * The email of the customer.
   */
  customer_email: string | null
}
/**
 * Record of promotion usage as part of a campaign whose budget type
 * is `use_by_attribute` or `spend_by_attribute`.
 * 
 * @since 2.11.0
 */
export interface CampaignBudgetUsageDTO {
  /**
   * The ID of the campaign budget usage.
   */
  id: string
  /**
   * The value of the attribute that the promotion was used by.
   * For example, if the budget campaign's attribute is `customer_id`,',
   * this value will be the ID of the customer that used the promotion.
   */
  attribute_value: string
  /**
   * The amount of times the promotion was used or
   * the amount of money discounted by the promotion,
   * depending on the campaign budget's type.
   */
  used: number
  /**
   * The ID of the campaign budget.
   */
  budget_id: string
  /**
   * The raw used value.
   */
  raw_used: Record<string, any>
  /**
   * The date and time the campaign budget usage was created.
   */
  created_at: string
  /**
   * The date and time the campaign budget usage was updated.
   */
  updated_at: string
  /**
   * The date and time the campaign budget usage was deleted.
   */
  deleted_at: string
}
