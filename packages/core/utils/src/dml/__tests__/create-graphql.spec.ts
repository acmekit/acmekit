import { model } from "../entity-builder"
import { toGraphQLSchema } from "../helpers/create-graphql"

describe("GraphQL builder", () => {
  test("should generate the proper graphql output for the given entities definition", () => {
    const tag = model.define("tag", {
      id: model.id(),
      value: model.text(),
    })

    const email = model.define("email", {
      email: model.text(),
      isVerified: model.boolean(),
    })

    enum DepartmentEnum {
      FinanceDept = "finance",
      MarketingDept = "marketing",
    }

    const user = model.define("user", {
      id: model.id(),
      username: model.text(),
      email: model.hasOne(() => email, { mappedBy: "owner" }),
      spend_limit: model.bigNumber(),
      rate: model.float(),
      phones: model.array(),
      group: model.belongsTo(() => group, { mappedBy: "users" }),
      role: model
        .enum(["moderator", "admin", "guest", "new-user"])
        .default("guest"),
      department: model.enum(DepartmentEnum),
      tags: model.manyToMany(() => tag, {
        pivotTable: "custom_user_tags",
      }),
    })

    const group = model.define("group", {
      id: model.number(),
      name: model.text(),
      admin: model.hasOne(() => user, { foreignKey: true }),
      users: model.hasMany(() => user),
    })

    const toGql = toGraphQLSchema([tag, email, user, group])

    const expected = `
      scalar DateTime
      scalar JSON
      directive @enumValue(value: String) on ENUM_VALUE
      type Tag {
        id: ID!
        value: String!
        created_at: DateTime!
        updated_at: DateTime!
        deleted_at: DateTime
      }

      type Email {
        email: String!
        isVerified: Boolean!
        created_at: DateTime!
        updated_at: DateTime!
        deleted_at: DateTime
      }

      extend type Email {
        owner: User!
      }

      enum UserRoleEnum {
        MODERATOR @enumValue(value: "moderator")
        ADMIN @enumValue(value: "admin")
        GUEST @enumValue(value: "guest")
        NEW_USER @enumValue(value: "new-user")
      }

      enum UserDepartmentEnum {
        FINANCE @enumValue(value: "finance")
        MARKETING @enumValue(value: "marketing")
      }

      type User {
        id: ID!
        username: String!
        email: Email!
        spend_limit: Float!
        rate: Float!
        phones: [String]!
        group_id:String!
        group: Group!
        role: UserRoleEnum!
        department: UserDepartmentEnum!
        tags: [Tag]!
        raw_spend_limit: JSON!
        created_at: DateTime!
        updated_at: DateTime!
        deleted_at: DateTime
      }

      type Group {
        id: Int!
        name: String!
        admin_id: String!
        admin: User!
        users: [User]!
        created_at: DateTime!
        updated_at: DateTime!
        deleted_at: DateTime
      }
      `

    expect(toGql.replace(/\s/g, "")).toEqual(expected.replace(/\s/g, ""))
  })
})
