interface AdminAddressPayload {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string | null
  city: string
  country_code: string
  province?: string | null
  postal_code: string
  phone?: string | null
  company?: string | null
}

export interface AdminCreateDraftOrder {
  sales_channel_id?: string | null
  email?: string | null
  customer_id?: string | null
  region_id: string
  promo_codes?: string[] | null
  currency_code?: string | null
  billing_address?: AdminAddressPayload | null
  shipping_address?: AdminAddressPayload | null
  no_notification_order?: boolean | null
  shipping_methods?: string[] | null
  metadata?: Record<string, unknown> | null
}
