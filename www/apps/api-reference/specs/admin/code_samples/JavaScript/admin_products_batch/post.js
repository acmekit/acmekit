import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.product.batch({
  create: [
    {
      title: "Shirt",
      options: [{
        title: "Default",
        values: ["Default Option"]
      }],
      variants: [
        {
          title: "Default",
          options: {
            Default: "Default Option"
          },
          prices: []
        }
      ]
    }
  ],
  update: [{
    id: "prod_123",
    title: "Pants"
  }],
  delete: ["prod_321"]
})
.then(({ created, updated, deleted }) => {
  console.log(created, updated, deleted)
})