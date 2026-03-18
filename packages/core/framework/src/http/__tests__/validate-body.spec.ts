import { AcmeKitError } from "@acmekit/utils"
import { z, ZodNullable, ZodObject, ZodOptional } from "@acmekit/deps/zod"
import { AcmeKitRequest, AcmeKitResponse } from "../types"
import { validateAndTransformBody } from "../utils/validate-body"

const createLinkBody = () => {
  return z.object({
    add: z.array(z.string()).optional(),
    remove: z.array(z.string()).optional(),
  })
}

describe("validateAndTransformBody", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should pass additionalDataValidator to validator factory", async () => {
    let mockRequest = {
      query: {},
      body: {
        additional_data: {},
      },
    } as AcmeKitRequest

    const mockResponse = {} as AcmeKitResponse
    const nextFunction = jest.fn()

    mockRequest.additionalDataValidator = z
      .object({
        brand_id: z.number(),
      })
      .nullish()

    const validatorFactory = (
      schema?: ZodOptional<ZodNullable<ZodObject<any, any>>>
    ) => {
      return schema
        ? createLinkBody().extend({
            additional_data: schema,
          })
        : createLinkBody()
    }

    let middleware = validateAndTransformBody(validatorFactory)

    await middleware(mockRequest, mockResponse, nextFunction)
    expect(nextFunction.mock.calls[0]).toEqual([
      new AcmeKitError(
        "invalid_data",
        `Invalid request: Field 'additional_data, brand_id' is required`
      ),
    ])
  })

  it("should allow additional_data to be undefined", async () => {
    let mockRequest = {
      query: {},
      body: {},
    } as AcmeKitRequest

    const mockResponse = {} as AcmeKitResponse
    const nextFunction = jest.fn()

    mockRequest.additionalDataValidator = z
      .object({
        brand_id: z.number(),
      })
      .nullish()

    const validatorFactory = (
      schema?: ZodOptional<ZodNullable<ZodObject<any, any>>>
    ) => {
      return schema
        ? createLinkBody().extend({
            additional_data: schema,
          })
        : createLinkBody()
    }

    let middleware = validateAndTransformBody(validatorFactory)

    await middleware(mockRequest, mockResponse, nextFunction)
    expect(nextFunction.mock.calls[0]).toEqual([])
  })

  it("should allow additional_data nested properties to be undefined", async () => {
    let mockRequest = {
      query: {},
      body: {
        additional_data: {},
      },
    } as AcmeKitRequest

    const mockResponse = {} as AcmeKitResponse
    const nextFunction = jest.fn()

    mockRequest.additionalDataValidator = z
      .object({
        brand_id: z.number().optional(),
      })
      .nullish()

    const validatorFactory = (
      schema?: ZodOptional<ZodNullable<ZodObject<any, any>>>
    ) => {
      return schema
        ? createLinkBody().extend({
            additional_data: schema,
          })
        : createLinkBody()
    }

    let middleware = validateAndTransformBody(validatorFactory)

    await middleware(mockRequest, mockResponse, nextFunction)
    expect(nextFunction.mock.calls[0]).toEqual([])
  })
})
