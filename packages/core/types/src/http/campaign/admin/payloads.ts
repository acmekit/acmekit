import { CampaignBudgetTypeValues } from "../../../promotion"

export interface AdminCreateCampaign {
  /**
   * The campaign's name.
   */
  name: string
  /**
   * The campaign's description.
   */
  description?: string | null
  /**
   * The campaign's identifier.
   */
  campaign_identifier: string
  /**
   * The date the campaign and its promotions start at.
   */
  starts_at?: Date | null
  /**
   * The date the campaign and its promotions end at.
   */
  ends_at?: Date | null
  /**
   * The campaign's budget.
   */
  budget?: {
    /**
     * The budget's type. `spend` means the limit is set on the total amount discounted by the campaign's promotions;
     * `usage` means the limit is set on the total number of times the campaign's promotions can be used.
     * `use_by_attribute` means the limit is set for a specific condition, such as per customer.
     */
    type?: CampaignBudgetTypeValues
    /**
     * The budget's currency code.
     *
     * @example
     * usd
     */
    currency_code?: string | null
    /**
     * The budget's limit.
     */
    limit?: number | null
    /**
     * The attribute that the budget limit is applied to. By default,
     * the budget is applied globally. If the type is `use_by_attribute`, this field indicates the 
     * attribute the budget is tracked by. For example, `customer_id` means the budget is tracked per customer.
     *
     * @example
     * customer_id
     * @since 2.11.0
     */
    attribute?: string | null
  } | null
}

export interface AdminUpdateCampaign {
  /**
   * The campaign's name.
   */
  name?: string
  /**
   * The campaign's description.
   */
  description?: string | null
  /**
   * The campaign's identifier.
   */
  campaign_identifier?: string
  /**
   * The date the campaign and its promotions start at.
   */
  starts_at?: Date | null
  /**
   * The date the campaign and its promotions end at.
   */
  ends_at?: Date | null
  /**
   * The campaign's budget.
   */
  budget?: {
    /**
     * The budget's limit.
     */
    limit?: number | null
  }
}
