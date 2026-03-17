import { HttpTypes } from "@medusajs/framework/types"
import { StoreRequestWithContext } from "../types"

export const wrapVariantsWithTaxPrices = async <T>(
  _req: StoreRequestWithContext<T>,
  _variants: HttpTypes.StoreProductVariant[]
) => {
  // Tax module removed
}
