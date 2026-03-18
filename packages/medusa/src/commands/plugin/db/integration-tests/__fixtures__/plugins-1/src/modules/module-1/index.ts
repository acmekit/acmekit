import { AcmeKitService, Module } from "/framework/utils"

export default Module("module1", {
  service: class Module1Service extends AcmeKitService({}) {},
})
