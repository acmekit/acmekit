import { InternalModuleDeclaration } from "@acmekit/types"
import { MODULE_SCOPE } from "../../types"

import { asValue } from "@acmekit/deps/awilix"
import { AcmeKitModule } from "../../acmekit-module"

const mockRegisterAcmeKitModule = jest.fn().mockImplementation(() => {
  return {
    moduleKey: {
      definition: {
        key: "moduleKey",
      },
      moduleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
      },
    },
  }
})

const mockModuleLoader = jest.fn().mockImplementation(({ container }) => {
  container.register({
    moduleKey: asValue({}),
  })
  return Promise.resolve({})
})

jest.mock("./../../loaders", () => ({
  registerAcmeKitModule: jest
    .fn()
    .mockImplementation((...args) => mockRegisterAcmeKitModule()),
  moduleLoader: jest
    .fn()
    .mockImplementation((...args) => mockModuleLoader.apply(this, args)),
}))

describe("AcmeKit Modules", () => {
  beforeEach(() => {
    AcmeKitModule.clearInstances()
    jest.resetModules()
    jest.clearAllMocks()
  })

  it("should create singleton instances", async () => {
    await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    expect(mockRegisterAcmeKitModule).toBeCalledTimes(1)
    expect(mockModuleLoader).toBeCalledTimes(1)

    await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    expect(mockRegisterAcmeKitModule).toBeCalledTimes(2)
    expect(mockModuleLoader).toBeCalledTimes(2)
  })

  it("should prevent the module being loaded multiple times under concurrent requests", async () => {
    const load: any = []

    for (let i = 5; i--; ) {
      load.push(
        AcmeKitModule.bootstrap({
          moduleKey: "moduleKey",
          defaultPath: "@path",
          declaration: {
            scope: MODULE_SCOPE.INTERNAL,
            resolve: "@path",
            options: {
              abc: 123,
            },
          } as InternalModuleDeclaration,
        })
      )
    }

    const intances = Promise.all(load)

    expect(mockRegisterAcmeKitModule).toBeCalledTimes(1)
    expect(mockModuleLoader).toBeCalledTimes(1)
    expect(intances[(await intances).length - 1]).toBe(intances[0])
  })

  it("getModuleInstance should return the first instance of the module if there is none flagged as 'main'", async () => {
    const moduleA = await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    expect(AcmeKitModule.getModuleInstance("moduleKey")).toEqual(moduleA)
  })

  it("should return the module flagged as 'main' when multiple instances are available", async () => {
    await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    const moduleB = await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        main: true,
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    expect(AcmeKitModule.getModuleInstance("moduleKey")).toEqual(moduleB)
  })

  it("should retrieve the module by their given alias", async () => {
    const moduleA = await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        alias: "mod_A",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    const moduleB = await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        main: true,
        alias: "mod_B",
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    const moduleC = await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        alias: "mod_C",
        options: {
          moduleC: true,
        },
      } as InternalModuleDeclaration,
    })

    // main
    expect(AcmeKitModule.getModuleInstance("moduleKey")).toEqual(moduleB)

    expect(AcmeKitModule.getModuleInstance("moduleKey", "mod_A")).toEqual(
      moduleA
    )
    expect(AcmeKitModule.getModuleInstance("moduleKey", "mod_B")).toEqual(
      moduleB
    )
    expect(AcmeKitModule.getModuleInstance("moduleKey", "mod_C")).toEqual(
      moduleC
    )
  })

  it("should prevent two main modules being set as 'main'", async () => {
    await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        alias: "mod_A",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        main: true,
        alias: "mod_B",
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    const moduleC = AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        main: true,
        alias: "mod_C",
        options: {
          moduleC: true,
        },
      } as InternalModuleDeclaration,
    })

    await expect(moduleC).rejects.toThrow(
      "Module moduleKey already have a 'main' registered."
    )
  })

  it("should prevent the same alias be used for different instances of the same module", async () => {
    await AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        alias: "module_alias",
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    const moduleC = AcmeKitModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        alias: "module_alias",
        options: {
          moduleC: true,
        },
      } as InternalModuleDeclaration,
    })

    await expect(moduleC).rejects.toThrow(
      "Module moduleKey already registed as 'module_alias'. Please choose a different alias."
    )
  })
})
