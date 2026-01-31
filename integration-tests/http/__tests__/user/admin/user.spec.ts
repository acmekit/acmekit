import { IWorkflowEngineService } from "@acmekit/framework/types"
import { acmekitIntegrationTestRunner } from "@acmekit/test-utils"
import { IAuthModuleService } from "@acmekit/types"
import { Modules } from "@acmekit/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

process.env.MEDUSA_FF_RBAC = "true"

acmekitIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let user, container, authIdentity

    beforeEach(async () => {
      container = getContainer()
      const { user: adminUser, authIdentity: authId } = await createAdminUser(
        dbConnection,
        adminHeaders,
        container
      )

      user = adminUser
      authIdentity = authId
    })

    describe("GET /admin/users/:id", () => {
      it("should return user by id", async () => {
        const response = await api.get(`/admin/users/${user.id}`, adminHeaders)

        const v2Response = {
          id: user.id,
          email: "admin@acmekit.js",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }

        // BREAKING: V2 users do not have role + api_token
        expect(response.status).toEqual(200)
        expect(response.data.user).toEqual(expect.objectContaining(v2Response))
      })
    })

    describe("GET /admin/users", () => {
      it("should list users", async () => {
        const response = await api.get("/admin/users", adminHeaders)

        expect(response.status).toEqual(200)

        const v2Response = [
          expect.objectContaining({
            id: user.id,
            email: "admin@acmekit.js",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        ]

        expect(response.data.users).toEqual(v2Response)
      })

      it("should list users that match the free text search", async () => {
        const emptyResponse = await api.get(
          "/admin/users?q=member",
          adminHeaders
        )

        expect(emptyResponse.status).toEqual(200)
        expect(emptyResponse.data.users.length).toEqual(0)

        const response = await api.get("/admin/users?q=user", adminHeaders)

        expect(response.data.users.length).toEqual(1)
        expect(response.data.users).toEqual([
          expect.objectContaining({
            id: user.id,
            email: "admin@acmekit.js",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        ])
      })
    })

    describe("POST /admin/users/:id", () => {
      it("should update a user", async () => {
        const updateResponse = (
          await api.post(
            `/admin/users/${user.id}`,
            { first_name: "John", last_name: "Doe" },
            adminHeaders
          )
        ).data.user

        expect(updateResponse).toEqual(
          expect.objectContaining({
            id: user.id,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            first_name: "John",
            last_name: "Doe",
          })
        )
      })
    })

    describe("DELETE /admin/users", () => {
      it("Deletes a user and updates associated auth identity", async () => {
        const userTwoAdminHeaders = {
          headers: { "x-acmekit-access-token": "test_token" },
        }

        const { user: userTwo, authIdentity: userTwoAuthIdentity } =
          await createAdminUser(dbConnection, userTwoAdminHeaders, container, {
            email: "test@test.com",
          })

        const response = await api.delete(
          `/admin/users/${userTwo.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: userTwo.id,
          object: "user",
          deleted: true,
        })

        const authModule: IAuthModuleService = container.resolve(Modules.AUTH)

        const updatedAuthIdentity = await authModule.retrieveAuthIdentity(
          userTwoAuthIdentity.id
        )

        // Ensure the auth identity has been updated to not contain the user's id
        expect(updatedAuthIdentity).toEqual(
          expect.objectContaining({
            id: userTwoAuthIdentity.id,
            app_metadata: expect.not.objectContaining({
              user_id: userTwo.id,
            }),
          })
        )

        // Authentication should still succeed
        const authenticateToken = (
          await api.post(`/auth/user/emailpass`, {
            email: userTwo.email,
            password: "somepassword",
          })
        ).data.token

        expect(authenticateToken).toEqual(expect.any(String))

        // However, it should not be possible to access routes any longer
        const meResponse = await api
          .get(`/admin/users/me`, {
            headers: {
              authorization: `Bearer ${authenticateToken}`,
            },
          })
          .catch((e) => e)

        expect(meResponse.response.status).toEqual(401)
      })

      it("throws if you attempt to delete your own user", async () => {
        const error = await api
          .delete(`/admin/users/${user.id}`, adminHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          "A user cannot delete itself"
        )
      })

      // TODO: Migrate when analytics config is implemented in 2.0
      it.skip("Deletes a user and their analytics config", async () => {
        const userId = "member-user"

        // await simpleAnalyticsConfigFactory(dbConnection, {
        //   user_id: userId,
        // })

        const response = await api.delete(
          `/admin/users/${userId}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: userId,
          object: "user",
          deleted: true,
        })

        const configs = await dbConnection.manager.query(
          `SELECT * FROM public.analytics_config WHERE user_id = '${userId}'`
        )

        expect(configs).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
              deleted_at: expect.any(Date),
              id: expect.any(String),
              user_id: userId,
              opt_out: false,
              anonymize: false,
            }),
          ])
        )
      })
    })

    // TODO: Migrate when implemented in 2.0
    describe.skip("POST /admin/users/reset-password + POST /admin/users/password-token", () => {
      let user
      beforeEach(async () => {
        const response = await api
          .post(
            "/admin/users",
            {
              email: "test@forgottenPassword.com",
              role: "member",
              password: "test123453",
            },
            adminHeaders
          )
          .catch((err) => console.log(err))

        user = response.data.user
      })

      it("Doesn't fail to fetch user when resetting password for an unknown email (unauthorized endpoint)", async () => {
        const resp = await api.post("/admin/users/password-token", {
          email: "test-doesnt-exist@test.com",
        })

        expect(resp.status).toEqual(204)
      })

      it("Doesn't fail when generating password reset token (unauthorized endpoint)", async () => {
        const resp = await api
          .post("/admin/users/password-token", {
            email: user.email,
          })
          .catch((err) => {
            console.log(err)
          })

        expect(resp.data).toEqual("")
        expect(resp.status).toEqual(204)
      })

      it("Resets the password given a valid token (unauthorized endpoint)", async () => {
        const expiry = Math.floor(Date.now() / 1000) + 60 * 15
        const dbUser = await dbConnection.manager.query(
          `SELECT * FROM public.user WHERE email = '${user.email}'`
        )

        const token_payload = {
          user_id: user.id,
          email: user.email,
          exp: expiry,
        }
        const token = jwt.sign(token_payload, dbUser[0].password_hash)

        const result = await api
          .post("/admin/users/reset-password", {
            token,
            email: "test@forgottenpassword.com",
            password: "new password",
          })
          .catch((err) => console.log(err))

        const loginResult = await api.post("admin/auth", {
          email: "test@forgottenpassword.com",
          password: "new password",
        })

        expect(result.status).toEqual(200)
        expect(result.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
        expect(result.data.user.password_hash).toEqual(undefined)

        expect(loginResult.status).toEqual(200)
        expect(loginResult.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
      })

      it("Resets the password given a valid token without including email(unauthorized endpoint)", async () => {
        const expiry = Math.floor(Date.now() / 1000) + 60 * 15
        const dbUser = await dbConnection.manager.query(
          `SELECT * FROM public.user WHERE email = '${user.email}'`
        )

        const token_payload = {
          user_id: user.id,
          email: user.email,
          exp: expiry,
        }
        const token = jwt.sign(token_payload, dbUser[0].password_hash)

        const result = await api
          .post("/admin/users/reset-password", {
            token,
            password: "new password",
          })
          .catch((err) => console.log(err.response.data.message))

        const loginResult = await api.post("admin/auth", {
          email: user.email,
          password: "new password",
        })

        expect(result.status).toEqual(200)
        expect(result.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
        expect(result.data.user.password_hash).toEqual(undefined)

        expect(loginResult.status).toEqual(200)
        expect(loginResult.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
      })

      it("Fails to Reset the password given an invalid token (unauthorized endpoint)", async () => {
        expect.assertions(2)

        const token = "test.test.test"

        await api
          .post("/admin/users/reset-password", {
            token,
            email: "test@forgottenpassword.com",
            password: "new password",
          })
          .catch((err) => {
            expect(err.response.status).toEqual(400)
            expect(err.response.data.message).toEqual("invalid token")
          })
      })
    })

    describe("User creation with roles", () => {
      it("should fail to create user with non-existent role", async () => {
        const workflowService: IWorkflowEngineService = container.resolve(
          Modules.WORKFLOW_ENGINE
        )

        const error = await workflowService
          .run("create-users-workflow", {
            input: {
              users: [
                {
                  email: "test-role@acmekit.js",
                  roles: ["non_existent_role_id"],
                },
              ],
            },
          })
          .catch((e) => e)

        expect(error.message).toContain("non_existent_role_id")
      })

      it("should create user with valid role", async () => {
        const workflowService: IWorkflowEngineService = container.resolve(
          Modules.WORKFLOW_ENGINE
        )

        // Get the super admin role created by the RBAC module loader
        const rbacService = container.resolve(Modules.RBAC)
        const superAdminRoles = await rbacService.listRbacRoles({
          id: "role_super_admin",
        })

        expect(superAdminRoles.length).toBeGreaterThan(0)

        const { result: users } = await workflowService.run(
          "create-users-workflow",
          {
            input: {
              users: [
                {
                  email: "test-with-role@acmekit.js",
                  roles: [superAdminRoles[0].id],
                },
              ],
            },
          }
        )

        expect(users).toHaveLength(1)
        expect(users[0].email).toEqual("test-with-role@acmekit.js")
      })
    })
  },
})
