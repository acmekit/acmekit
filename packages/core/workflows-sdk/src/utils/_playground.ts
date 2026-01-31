import { createStep, createWorkflow, StepResponse, transform } from "./composer"
import { createHook } from "./composer/create-hook"
import { WorkflowResponse } from "./composer/helpers/workflow-response"

const step1 = createStep(
  "step1",
  () => {
    return new StepResponse("step1")
  },
  () => {
    console.log("compensate step1")
  }
)

const step2 = createStep(
  "step2",
  (input: any) => {
    return new StepResponse(input)
  },
  (input) => {
    console.log("compensate step2", input)
  }
)

const workflow = createWorkflow("workflow", () => {
  const step1Result = step1()

  const step2Input = transform({ step1Result }, (input) => {
    return input
  })

  const step2Result = step2(step2Input)

  const hook = createHook("hook", {
    step2Result,
  })

  return new WorkflowResponse(void 0, {
    hooks: [hook],
  })
})

workflow.hooks.hook(() => {
  throw new Error("hook failed")
})

workflow()
  .run()
  .then((res) => {
    console.log(res)
  })
  .catch((e) => {
    console.log(e)
  })
