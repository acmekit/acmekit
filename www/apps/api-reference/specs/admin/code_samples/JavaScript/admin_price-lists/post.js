import AcmeKit from "@acmekit/js-sdk"

export const sdk = new AcmeKit({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

sdk.admin.priceList.create({
  title: "My Price List",
  status: "active",
  type: "sale",
  prices: [
    {
      variant_id: "variant_123",
      amount: 10,
      currency_code: "usd",
      rules: {
        region_id: "reg_123"
      }
    }
  ]
})
.then(({ price_list }) => {
  console.log(price_list)
})