import { CustomDBMigrator } from "../../dal/mikro-orm/custom-db-migrator"
import { defineMikroOrmCliConfig } from "../mikro-orm-cli-config-builder"

const moduleName = "myTestService"

describe("defineMikroOrmCliConfig", () => {
  test(`should throw an error if entities is not provided`, () => {
    const options = {}

    expect(() => defineMikroOrmCliConfig(moduleName, options as any)).toThrow(
      "defineMikroOrmCliConfig failed with: entities is required"
    )
  })

  test("should return the correct config", () => {
    const config = defineMikroOrmCliConfig(moduleName, {
      entities: [{} as any],
      dbName: "acmekit-fulfillment",
    })

    expect(config).toEqual({
      entities: [{}],
      driver: expect.any(Function),
      host: "127.0.0.1",
      user: "postgres",
      password: "",
      dbName: "acmekit-fulfillment",
      migrations: {
        generator: expect.any(Function),
        snapshotName: ".snapshot-acmekit-my-test",
      },
      extensions: [CustomDBMigrator],
    })
  })

  test("should return the correct config inferring the databaseName", () => {
    const config = defineMikroOrmCliConfig(moduleName, {
      entities: [{} as any],
    })

    expect(config).toEqual({
      entities: [{}],
      driver: expect.any(Function),
      dbName: "acmekit-my-test",
      host: "127.0.0.1",
      user: "postgres",
      password: "",
      migrations: {
        generator: expect.any(Function),
        snapshotName: ".snapshot-acmekit-my-test",
      },
      extensions: [CustomDBMigrator],
    })
  })
})
