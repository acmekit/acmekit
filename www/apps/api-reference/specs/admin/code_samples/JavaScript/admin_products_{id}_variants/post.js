import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.product.createVariant("prod_123", {
  title: "Blue Shirt",
  options: {
    Color: "Blue"
  },
  prices: [
    {
      amount: 10,
      currency_code: "usd"
    }
  ]
})
.then(({ product }) => {
  console.log(product)
})