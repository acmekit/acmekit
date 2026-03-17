import { expectTypeOf } from "expect-type"
import "../__fixtures__/index-service-entry-points"
import { IndexOperatorMap as OperatorMap } from "../index-operator-map"
import { IndexQueryConfig, OrderBy } from "../query-config"

describe("IndexQueryConfig", () => {
  it("should infer the config types properly", async () => {
    type IndexConfig = IndexQueryConfig<"product">

    expectTypeOf<IndexConfig["fields"]>().toEqualTypeOf<
      (
        | "*"
        | "id"
        | "title"
        | "variants.*"
        | "variants.id"
        | "variants.product_id"
        | "variants.sku"
        | "variants.prices.*"
        | "variants.prices.amount"
      )[]
    >()

    expectTypeOf<IndexConfig["filters"]>().toEqualTypeOf<
      | {
          id?: string | string[] | OperatorMap<string | string[] | null> | null
          title?:
            | string
            | string[]
            | OperatorMap<string | string[] | null>
            | null
          variants?: {
            id?:
              | string
              | string[]
              | OperatorMap<string | string[] | null>
              | null
            product_id?:
              | string
              | string[]
              | OperatorMap<string | string[] | null>
              | null
            sku?:
              | string
              | string[]
              | OperatorMap<string | string[] | null>
              | null
            prices?: {
              amount?:
                | number
                | number[]
                | OperatorMap<number | number[] | null>
                | null
            }
          }
        }
      | undefined
    >()

    expectTypeOf<IndexConfig["pagination"]>().toEqualTypeOf<
      | {
          skip?: number
          take?: number
          order?: {
            id?: OrderBy
            title?: OrderBy
            variants?: {
              id?: OrderBy
              product_id?: OrderBy
              sku?: OrderBy
              prices?: {
                amount?: OrderBy
              }
            }
          }
        }
      | undefined
    >()
  })
})
