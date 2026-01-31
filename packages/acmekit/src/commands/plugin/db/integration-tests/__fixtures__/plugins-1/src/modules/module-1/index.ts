import { AcmeKitService, Module } from "@acmekit/framework/utils"

export default Module("module1", {
  service: class Module1Service extends AcmeKitService({}) {},
})
