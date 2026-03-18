import { defineLink, AcmeKitService, model, Module } from "@acmekit/utils"

const model1 = model.define("model-1", {
  id: model.id().primaryKey(),
})

const model2 = model.define("model-2", {
  id: model.id().primaryKey(),
})

const module1 = Module("module-1", {
  service: class Service1 extends AcmeKitService({ model1 }) {},
})

const module2 = Module("module-2", {
  service: class Service2 extends AcmeKitService({ model2 }) {},
})

export const module1And2Link = defineLink(
  module1.linkable.model1,
  module2.linkable.model2
)
