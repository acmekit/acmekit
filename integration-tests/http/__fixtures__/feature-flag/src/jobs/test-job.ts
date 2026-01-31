import { AcmeKitContainer } from "@acmekit/framework/types"
import { defineFileConfig, FeatureFlag } from "@acmekit/framework/utils"

export const testJobHandler = jest.fn()

export default async function greetingJob(container: AcmeKitContainer) {
  testJobHandler()
}

export const config = {
  name: "greeting-every-second",
  numberOfExecutions: 1,
  schedule: "* * * * * *",
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("custom_ff"),
})
