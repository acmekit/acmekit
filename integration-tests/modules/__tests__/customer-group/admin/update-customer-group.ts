import { acmekitIntegrationTestRunner } from "@acmekit/test-utils"
import { ICustomerModuleService } from "@acmekit/types"
import { Modules } from "@acmekit/utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}
const adminHeaders = {
  headers: { "x-acmekit-access-token": "test_token" },
}

acmekitIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /admin/customer-groups/:id", () => {
      let appContainer
      let customerModuleService: ICustomerModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        customerModuleService = appContainer.resolve(Modules.CUSTOMER)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should update a customer group", async () => {
        const customer = await customerModuleService.createCustomerGroups({
          name: "VIP",
        })

        const response = await api.post(
          `/admin/customer-groups/${customer.id}`,
          {
            name: "regular",
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer_group).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "regular",
          })
        )
      })
    })
  },
})
