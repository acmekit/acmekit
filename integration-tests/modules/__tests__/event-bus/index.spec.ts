import { AcmeKitContainer } from "@acmekit/types"
import { Modules, composeMessage } from "@acmekit/utils"
import { acmekitIntegrationTestRunner } from "@acmekit/test-utils"
import testEventPayloadHandlerMock from "../../src/subscribers/test-event-payload"

jest.setTimeout(30000)

acmekitIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    let container!: AcmeKitContainer

    describe("EventBusModule", () => {
      beforeAll(() => {
        container = getContainer()
      })

      it(`should emit event with the expected shape to be received by the subscribers`, async () => {
        const eventBus = container.resolve(Modules.EVENT_BUS)
        const eventName = "test-event-payload"

        await eventBus.emit(
          composeMessage(eventName, {
            data: {
              test: "foo",
            },
            object: "object",
            source: "source",
            action: "action",
          })
        )

        expect(testEventPayloadHandlerMock).toHaveBeenCalled()
        expect(
          testEventPayloadHandlerMock.mock.calls[0][0].pluginOptions
        ).toEqual(expect.any(Object))
        expect(testEventPayloadHandlerMock.mock.calls[0][0].event).toEqual({
          name: eventName,
          data: {
            test: "foo",
          },
          metadata: {
            object: "object",
            source: "source",
            action: "action",
          },
        })
      })
    })
  },
})
