import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/utils"
import Translation from "../modules/translation"

export default defineLink(
  ProductModule.linkable.productVariant.id,
  Translation.linkable.translation.id
)
