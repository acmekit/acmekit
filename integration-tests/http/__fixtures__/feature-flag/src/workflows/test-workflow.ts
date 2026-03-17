import { defineFileConfig, FeatureFlag } from "@medusajs/framework/utils"
import { createStep, createWorkflow } from "@medusajs/framework/workflows-sdk"

const testWorkflowHandler = jest.fn()

const step1 = createStep("step1", () => testWorkflowHandler())

export const testWorkflow = createWorkflow("test-workflow", () => {
  step1()
})

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("custom_ff"),
})
