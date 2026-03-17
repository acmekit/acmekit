type AdminBaseRefundReasonPayload = {
  /**
   * The refund reason's label.
   * 
   * @example
   * "Refund"
   */
  label: string
  /**
   * The refund reason's code.
   *
   * @example
   * "refund"
   */
  code: string
  /**
   * The refund reason's description.
   */
  description?: string
  /**
   * Custom key-value pairs that can be added to the refund reason.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateRefundReason extends AdminBaseRefundReasonPayload {}

export interface AdminUpdateRefundReason extends AdminBaseRefundReasonPayload {}
