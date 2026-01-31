import { WorkflowManager, WorkflowScheduler } from "@acmekit/orchestration"
import {
  ContainerRegistrationKeys,
  createAcmeKitContainer,
} from "@acmekit/utils"
import { asValue } from "../../deps/awilix"
import { join } from "path"
import { logger } from "../../logger"
import { MockSchedulerStorage } from "../__fixtures__/mock-scheduler-storage"
import { JobLoader } from "../job-loader"

describe("register jobs", () => {
  WorkflowScheduler.setStorage(new MockSchedulerStorage())

  afterEach(() => {
    WorkflowManager.unregisterAll()
  })

  it("should registers jobs from plugins", async () => {
    const container = createAcmeKitContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))

    const jobLoader: JobLoader = new JobLoader(
      join(__dirname, "../__fixtures__/plugin/jobs"),
      container
    )
    await jobLoader.load()
    const workflow = WorkflowManager.getWorkflow("job-summarize-orders")
    expect(workflow).toBeDefined()
    expect(workflow?.options.schedule).toEqual({
      cron: "* * * * * *",
      numberOfExecutions: 2,
    })
  })

  it("should not load non js/ts files", async () => {
    const container = createAcmeKitContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))

    const jobLoader: JobLoader = new JobLoader(
      join(__dirname, "../__fixtures__/plugin/jobs-with-other-files"),
      container
    )
    await jobLoader.load()
    const workflow = WorkflowManager.getWorkflow("job-summarize-orders")
    expect(workflow).toBeUndefined()
  })
})
