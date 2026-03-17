import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/utils"
import Translation from "../modules/translation"

export default defineLink(
  ProductModule.linkable.productOption.id,
  Translation.linkable.translation.id
)
