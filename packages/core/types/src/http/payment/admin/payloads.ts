export interface AdminCapturePayment {
  /**
   * Custom amount to capture. If not specified, the
   * payment's amount is captured.
   */
  amount?: number
}

export interface AdminRefundPayment {
  /**
   * Custom amount to refund. If not specified, the
   * payment's amount is refunded.
   */
  amount?: number
  /**
   * The ID of the refund's reason.
   */
  refund_reason_id?: string
  /**
   * A note to attach to the refund.
   */
  note?: string
}

export interface AdminCreatePaymentCollection {
  /**
   * The ID of the order this payment collection belongs to.
   */
  order_id: string
  /**
   * The payment collection's amount.
   */
  amount: number
}

export interface AdminMarkPaymentCollectionAsPaid {
  order_id: string
}
