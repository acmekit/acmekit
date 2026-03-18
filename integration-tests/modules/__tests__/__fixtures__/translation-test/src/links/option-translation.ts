import ProductModule from "@acmekit/medusa/product"
import { defineLink } from "@acmekit/utils"
import Translation from "../modules/translation"

export default defineLink(
  ProductModule.linkable.productOption.id,
  Translation.linkable.translation.id
)
