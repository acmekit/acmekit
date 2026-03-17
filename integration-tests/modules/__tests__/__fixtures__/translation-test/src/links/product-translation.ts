import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import Translation from "../modules/translation"

export default defineLink(
  ProductModule.linkable.product.id,
  Translation.linkable.translation.id
)
