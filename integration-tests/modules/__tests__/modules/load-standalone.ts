import { AcmeKitApp } from "@acmekit/modules-sdk"
import { acmekitIntegrationTestRunner } from "@acmekit/test-utils"
import { IProductModuleService } from "@acmekit/types"
import { Modules } from "@acmekit/utils"

jest.setTimeout(30000)

acmekitIntegrationTestRunner({
  testSuite: ({ dbConfig: { clientUrl } }) => {
    describe("Standalone Modules", () => {
      beforeAll(async () => {
        process.env.DATABASE_URL = clientUrl
      })

      afterAll(async () => {
        process.env.DATABASE_URL = undefined
      })

      it("Should migrate database and initialize Product module using connection string from environment variable ", async function () {
        const { modules, runMigrations } = await AcmeKitApp({
          modulesConfig: {
            [Modules.PRODUCT]: true,
          },
        })

        await runMigrations()

        const product = modules[
          Modules.PRODUCT
        ] as unknown as IProductModuleService

        const productList = await product.listProducts()

        expect(productList).toEqual(expect.arrayContaining([]))
      })
    })
  },
})
