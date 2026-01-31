import { acmekitIntegrationTestRunner } from "@acmekit/test-utils"

jest.setTimeout(100000)

acmekitIntegrationTestRunner({
  testSuite: ({ getContainer, dbConnection, api, dbConfig }) => {
    let appContainer

    beforeAll(() => {
      appContainer = getContainer()
    })

    describe("auto-generated CRUD methods", () => {
      it("should create brands", async () => {
        const brandModule = appContainer.resolve("brand")

        const brand = await brandModule.createBrands({
          name: "AcmeKit Brand",
        })

        expect(brand).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "AcmeKit Brand",
          })
        )

        const multipleBrands = await brandModule.createBrands([
          {
            name: "AcmeKit Brand 2",
          },
          {
            name: "AcmeKit Brand 3",
          },
        ])

        expect(multipleBrands).toEqual([
          expect.objectContaining({
            id: expect.stringMatching("brand_"),
            name: "AcmeKit Brand 2",
          }),
          expect.objectContaining({
            id: expect.stringMatching("brand_"),
            name: "AcmeKit Brand 3",
          }),
        ])
      })

      it("should update brands", async () => {
        const brandModule = appContainer.resolve("brand")

        const multipleBrands = await brandModule.createBrands([
          {
            name: "AcmeKit Brand 2",
          },
          {
            name: "AcmeKit Brand 3",
          },
        ])

        const brand = await brandModule.updateBrands({
          id: multipleBrands[0].id,
          name: "AcmeKit Brand",
        })

        expect(brand).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "AcmeKit Brand",
          })
        )

        const multipleBrandsUpdated = await brandModule.updateBrands([
          {
            id: multipleBrands[0].id,
            name: "AcmeKit Brand 22",
          },
          {
            id: multipleBrands[1].id,
            name: "AcmeKit Brand 33",
          },
        ])

        expect(multipleBrandsUpdated).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: "AcmeKit Brand 22",
            }),
            expect.objectContaining({
              id: expect.any(String),
              name: "AcmeKit Brand 33",
            }),
          ])
        )

        const multipleBrandsUpdatedWithSelector =
          await brandModule.updateBrands({
            selector: {
              name: { $like: "AcmeKit Brand 22" },
            },
            data: {
              name: "AcmeKit Brand **",
            },
          })

        expect(multipleBrandsUpdatedWithSelector).toEqual([
          expect.objectContaining({
            id: expect.any(String),
            name: "AcmeKit Brand **",
          }),
        ])
      })
    })
  },
})
