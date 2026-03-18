import {
  defineJoinerConfig,
  AcmeKitService,
  model,
  Module,
} from "@acmekit/framework/utils"

export const User = model.define("user", {
  id: model.id().primaryKey(),
  name: model.text(),
})

export const userJoinerConfig = defineJoinerConfig("user", {
  models: [User],
})

export class UserService extends AcmeKitService({ User }) {
  constructor() {
    super(...arguments)
  }
}

export const UserModule = Module("user", {
  service: UserService,
})

export const Car = model.define("car", {
  id: model.id().primaryKey(),
  name: model.text(),
})

export const carJoinerConfig = defineJoinerConfig("car", {
  models: [Car],
})

export class CarService extends AcmeKitService({ Car }) {
  constructor() {
    super(...arguments)
  }
}

export const CarModule = Module("car", {
  service: CarService,
})

export const CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATable =
  model.define("very_long_table_name_of_custom_module", {
    id: model.id().primaryKey(),
    name: model.text(),
  })

export const longNameJoinerConfig = defineJoinerConfig(
  "CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATable",
  {
    models: [
      CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATable,
    ],
  }
)

export class CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATableService extends AcmeKitService(
  {
    CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATable,
  }
) {
  constructor() {
    super(...arguments)
  }
}

export const CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATableModule =
  Module(
    "CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATable",
    {
      service:
        CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATableService,
    }
  )
