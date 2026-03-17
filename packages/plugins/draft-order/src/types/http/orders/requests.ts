export interface AdminOrderEditAddShippingMethod {
  shipping_option_id: string
  custom_amount?: number | undefined
  description?: string | undefined
  internal_note?: string | undefined
  metadata?: Record<string, unknown> | undefined
}

export interface AdminOrderEditUpdateShippingMethod {
  custom_amount?: number | null | undefined
  internal_note?: string | null | undefined
  metadata?: Record<string, unknown> | null | undefined
}
