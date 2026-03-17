import { StoreCartShippingOption, StoreCartShippingOptionWithServiceZone, } from "../../fulfillment"

/**
 * The response of listing the shipping options for a cart.
 */
export interface StoreShippingOptionListResponse {
  /**
   * The shipping options for the cart.
   */
  shipping_options: StoreCartShippingOptionWithServiceZone[]
}

/**
 * The response of calculating the price of a shipping option.
 */
export interface StoreShippingOptionResponse {
  /**
   * The shipping option's details.
   */
  shipping_option: StoreCartShippingOption
}
