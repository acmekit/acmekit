export const schema = `
  type Product @Listeners(values: ["product.created", "product.updated", "product.deleted"]) {
    id: ID
    title: String
    created_at: DateTime

    deep: InternalNested
    variants: [ProductVariant]
  }
  
  type InternalNested {
    a: Int
    obj: InternalObject
  }
  
  type InternalObject {
    b: Int
  }
  
  type ProductVariant @Listeners(values: ["variant.created", "variant.updated", "variant.deleted"]) {
    id: ID
    product_id: String
    sku: String
    prices: [Price]
  }
  
  type Price @Listeners(values: ["price.created", "price.updated", "price.deleted"]) {
    amount: Float
  }
`
