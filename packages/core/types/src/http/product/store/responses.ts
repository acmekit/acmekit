import { PaginatedResponse } from "../../common"
import { StoreProduct, StoreProductVariant } from "../store"

export interface StoreProductResponse {
  /**
   * The product's details.
   */
  product: StoreProduct
}

export type StoreProductListResponse = PaginatedResponse<{
  /**
   * The list of products.
   */
  products: StoreProduct[]
}>

export interface StoreProductVariantResponse {
  /**
   * The product variant's details.
   */
  variant: StoreProductVariant
}

export type StoreProductVariantListResponse = PaginatedResponse<{
  /**
   * The list of product variants.
   */
  variants: StoreProductVariant[]
}>
