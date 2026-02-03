# Integration Tests

The `acmekit-test-utils` package provides utility functions to create integration tests for your API routes and workflows.

For example:

```ts
import { AcmekitIntegrationTestRunner } from "acmekit-test-utils"

AcmekitIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe("Custom endpoints", () => {
      describe("GET /store/custom", () => {
        it("returns correct message", async () => {
          const response = await api.get(
            `/store/custom`
          )
  
          expect(response.status).toEqual(200)
          expect(response.data).toHaveProperty("message")
          expect(response.data.message).toEqual("Hello, World!")
        })
      })
    })
  }
})
```

Learn more in [this documentation](https://docs.acmekitjs.com/learn/debugging-and-testing/testing-tools/integration-tests).