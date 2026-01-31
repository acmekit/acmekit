import { OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminExchangeListParams extends FindParams {
  /**
   * Filter by exchange ID(s).
   */
  id?: string | string[]
  /**
   * Filter by order ID(s) to get their associated exchanges.
   */
  order_id?: string | string[]
  /**
   * Filter by exchange status(es).
   */
  status?: string | string[]
  /**
   * Apply filters on the exchange's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the exchange's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the exchange's deletion date.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminOrderExchangeListParams extends SelectParams {
  /**
   * Filter by exchange ID(s).
   */
  id?: string | string[]
  /**
   * Filter by exchange status(es).
   */
  status?: string | string[]
  /**
   * Apply filters on the exchange's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the exchange's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the exchange's deletion date.
   */
  deleted_at?: OperatorMap<string>
}
