import { AcmeKitRequest, AcmeKitResponse } from "../types"
import { applyLocale } from "../middlewares/apply-locale"
import { AcmeKitContainer } from "@acmekit/types"

describe("applyLocale", () => {
  let mockRequest: Partial<AcmeKitRequest>
  let mockResponse: AcmeKitResponse
  let nextFunction: jest.Mock

  beforeEach(() => {
    mockRequest = {
      query: {},
      get: jest.fn(),
      scope: {
        resolve: jest.fn().mockReturnValue({
          graph: jest.fn().mockResolvedValue({
            data: [{ supported_locales: [{ locale_code: "en-US" }] }],
          }),
        }),
      } as unknown as AcmeKitContainer,
    }
    mockResponse = {} as AcmeKitResponse
    nextFunction = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should set locale from query parameter", async () => {
    mockRequest.query = { locale: "en-US" }

    await applyLocale(mockRequest as AcmeKitRequest, mockResponse, nextFunction)

    expect(mockRequest.locale).toBe("en-US")
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })

  it("should set locale from x-acmekit-locale header when query param is not present", async () => {
    mockRequest.query = {}
    ;(mockRequest.get as jest.Mock).mockImplementation((header: string) => {
      if (header === "x-acmekit-locale") {
        return "fr-FR"
      }
      return undefined
    })

    await applyLocale(mockRequest as AcmeKitRequest, mockResponse, nextFunction)

    expect(mockRequest.locale).toBe("fr-FR")
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })

  it("should prioritize query parameter over x-acmekit-locale header", async () => {
    mockRequest.query = { locale: "de-DE" }
    ;(mockRequest.get as jest.Mock).mockImplementation((header: string) => {
      if (header === "x-acmekit-locale") {
        return "fr-FR"
      }
      return undefined
    })

    await applyLocale(mockRequest as AcmeKitRequest, mockResponse, nextFunction)

    expect(mockRequest.locale).toBe("de-DE")
    expect(mockRequest.get).not.toHaveBeenCalled()
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })

  it("should not set locale when neither query param nor header is present", async () => {
    mockRequest.query = {}
    ;(mockRequest.get as jest.Mock).mockReturnValue(undefined)

    await applyLocale(mockRequest as AcmeKitRequest, mockResponse, nextFunction)

    expect(mockRequest.locale).toBeUndefined()
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })

  it("should handle empty string in query parameter", async () => {
    mockRequest.query = { locale: "" }
    ;(mockRequest.get as jest.Mock).mockImplementation((header: string) => {
      if (header === "x-acmekit-locale") {
        return "es-ES"
      }
      return undefined
    })

    await applyLocale(mockRequest as AcmeKitRequest, mockResponse, nextFunction)

    // Empty string is falsy, so it should fall back to header
    expect(mockRequest.locale).toBe("es-ES")
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })

  it("should handle various locale formats", async () => {
    const locales = ["en", "en-US", "zh-Hans-CN", "pt-BR"]

    for (const locale of locales) {
      mockRequest.query = { locale }
      mockRequest.locale = undefined

      await applyLocale(
        mockRequest as AcmeKitRequest,
        mockResponse,
        nextFunction
      )

      expect(mockRequest.locale).toBe(locale)
    }
  })
})
