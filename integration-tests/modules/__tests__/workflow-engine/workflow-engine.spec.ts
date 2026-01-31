import { emitEventStep } from "@acmekit/core-flows"
import { Modules, TransactionState } from "@acmekit/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowData,
  WorkflowResponse,
} from "@acmekit/framework/workflows-sdk"
import { acmekitIntegrationTestRunner } from "@acmekit/test-utils"
import { IEventBusModuleService } from "@acmekit/types"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(300000)

acmekitIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Workflow Engine API", () => {
      let acmekitContainer

      beforeAll(() => {
        acmekitContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, acmekitContainer)
      })

      describe("Testing WorkflowEngine.run", () => {
        beforeAll(async () => {
          const step1 = createStep(
            {
              name: "my-step",
            },
            async (input: { initial: string }, { container }) => {
              const testMod = container.resolve("testingModule") as any

              return new StepResponse(testMod.methodName(input.initial))
            }
          )

          createWorkflow(
            {
              name: "my-workflow-name",
            },
            function (input: WorkflowData<{ initial: string }>) {
              const stepRes = step1(input)

              return new WorkflowResponse(stepRes)
            }
          )
        })

        it("Should invoke modules passing the current acmekit context as argument", async () => {
          const testMod = acmekitContainer.resolve("testingModule") as any

          const methodSpy = jest.spyOn(testMod, "methodName")

          const engine = acmekitContainer.resolve(Modules.WORKFLOW_ENGINE)

          const res = await engine.run("my-workflow-name", {
            transactionId: "trx-id",
            input: {
              initial: "abc",
            },
            context: {
              meta: {
                myStuff: "myStuff",
              },
            },
          })

          expect(res.result).toEqual("abc called")

          expect(methodSpy).toHaveBeenCalledTimes(1)
          expect(methodSpy).toHaveBeenCalledWith(
            "abc",
            expect.objectContaining({
              transactionId: "trx-id",
              __type: "AcmeKitContext",
              eventGroupId: expect.any(String),
              idempotencyKey: "my-workflow-name:trx-id:my-step:invoke",
              meta: {
                myStuff: "myStuff",
              },
            })
          )
        })
      })

      describe("Workflows event", () => {
        const failingEventName = "failing-event"

        it("should not compensate the workflow if the event subscriber fails", async () => {
          const step1 = createStep(
            {
              name: "my-step",
            },
            async (_) => {
              return new StepResponse({ result: "success" })
            }
          )

          createWorkflow(
            {
              name: "my-workflow-name-2",
              retentionTime: 50,
            },
            function (input: WorkflowData<{ initial: string }>) {
              const stepRes = step1()

              emitEventStep({
                eventName: failingEventName,
                data: {
                  input: stepRes,
                },
              })

              return new WorkflowResponse(stepRes)
            }
          )

          const container = getContainer()
          const eventBus = container.resolve(
            Modules.EVENT_BUS
          ) as IEventBusModuleService

          const eventSpy = jest.fn()
          eventBus.subscribe(failingEventName, async (event) => {
            eventSpy(event)
            throw new Error("Failed to emit event")
          })

          const engine = container.resolve(Modules.WORKFLOW_ENGINE)

          const transactionId = "trx-id-failing-event"
          const res = await engine.run("my-workflow-name-2", {
            transactionId,
            input: {
              initial: "abc",
            },
          })

          expect(res.result).toEqual({ result: "success" })

          const executions = await engine.listWorkflowExecutions({
            transaction_id: transactionId,
          })

          expect(executions.length).toBe(1)
          expect(executions[0].state).toBe(TransactionState.DONE)

          expect(eventSpy).toHaveBeenCalledTimes(1)
          expect(eventSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              data: {
                input: {
                  result: "success",
                },
              },
            })
          )
        })
      })
    })
  },
})
