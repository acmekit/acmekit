import { MedusaContainer } from "@medusajs/framework/types"
import { defineFileConfig, FeatureFlag } from "@medusajs/framework/utils"

export const testJobHandler = jest.fn()

export default async function greetingJob(container: MedusaContainer) {
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
